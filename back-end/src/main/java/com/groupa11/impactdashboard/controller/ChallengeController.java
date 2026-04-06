package com.groupa11.impactdashboard.controller;

import com.groupa11.impactdashboard.model.Challenge;
import com.groupa11.impactdashboard.repository.ChallengeRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeRepository challengeRepository;

    public ChallengeController(ChallengeRepository challengeRepository) {
        this.challengeRepository = challengeRepository;
    }

    @GetMapping
    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    @GetMapping("/daily")
    public Challenge getDailyChallenge() {
        List<Challenge> challenges = challengeRepository.findAll();
        if (challenges.isEmpty()) return null;

        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        LocalDate startOfYear = LocalDate.of(now.getYear(), 1, 1);
        long dayOfYear = ChronoUnit.DAYS.between(startOfYear, now);

        int index = (int) (dayOfYear % challenges.size());
        return challenges.get(index);
    }
}
