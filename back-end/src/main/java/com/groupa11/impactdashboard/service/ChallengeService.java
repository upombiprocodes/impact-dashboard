package com.groupa11.impactdashboard.service;

import com.groupa11.impactdashboard.model.ChallengeCompletion;
import com.groupa11.impactdashboard.model.UserWeeklyData;
import com.groupa11.impactdashboard.repository.ChallengeCompletionRepository;
import com.groupa11.impactdashboard.repository.UserWeeklyDataRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChallengeService {

    private final ChallengeCompletionRepository completionRepository;
    private final UserWeeklyDataRepository weeklyDataRepository;

    public ChallengeService(ChallengeCompletionRepository completionRepository,
                            UserWeeklyDataRepository weeklyDataRepository) {
        this.completionRepository = completionRepository;
        this.weeklyDataRepository = weeklyDataRepository;
    }

    public Map<String, Object> completeChallenge(Long userId, int challengeId, double co2Saved) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);

        // Check if already completed today
        List<ChallengeCompletion> existing = completionRepository.findByUserId(userId);
        boolean alreadyToday = existing.stream()
                .filter(c -> c.getChallengeId() == challengeId)
                .anyMatch(c -> c.getCompletedAt().atZone(ZoneOffset.UTC).toLocalDate().equals(today));

        if (alreadyToday) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Challenge already completed today");
        }

        ChallengeCompletion completion = new ChallengeCompletion(userId, challengeId, Instant.now(), co2Saved);
        completionRepository.save(completion);

        // Update user's weekly saved
        List<UserWeeklyData> weeks = weeklyDataRepository.findByUserIdOrderByIdAsc(userId);
        if (!weeks.isEmpty()) {
            UserWeeklyData lastWeek = weeks.get(weeks.size() - 1);
            lastWeek.setSaved(lastWeek.getSaved() + (int) Math.round(co2Saved));
            weeklyDataRepository.save(lastWeek);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("message", "Challenge completed!");
        result.put("co2_saved", co2Saved);
        return result;
    }

    public List<Map<String, Object>> getChallengeHistory(Long userId) {
        List<ChallengeCompletion> completions = completionRepository
                .findByUserIdOrderByCompletedAtDesc(userId);

        return completions.stream()
                .limit(50)
                .map(c -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", c.getId());
                    m.put("challenge_id", c.getChallengeId());
                    m.put("co2_saved", c.getCo2Saved());
                    m.put("completed_at", c.getCompletedAt().toString());
                    return m;
                })
                .collect(Collectors.toList());
    }

    public Map<String, Object> getTodayCompletions(Long userId) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        List<ChallengeCompletion> all = completionRepository.findByUserId(userId);

        List<ChallengeCompletion> todayCompletions = all.stream()
                .filter(c -> c.getCompletedAt().atZone(ZoneOffset.UTC).toLocalDate().equals(today))
                .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("completed_challenge_ids",
                todayCompletions.stream().map(ChallengeCompletion::getChallengeId).collect(Collectors.toList()));
        result.put("total_co2_saved_today",
                todayCompletions.stream().mapToDouble(ChallengeCompletion::getCo2Saved).sum());
        return result;
    }
}
