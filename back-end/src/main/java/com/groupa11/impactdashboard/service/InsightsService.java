package com.groupa11.impactdashboard.service;

import com.groupa11.impactdashboard.model.ActivityLog;
import com.groupa11.impactdashboard.model.ChallengeCompletion;
import com.groupa11.impactdashboard.repository.ActivityLogRepository;
import com.groupa11.impactdashboard.repository.ChallengeCompletionRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InsightsService {

    private final ActivityLogRepository activityLogRepository;
    private final ChallengeCompletionRepository challengeCompletionRepository;

    public InsightsService(ActivityLogRepository activityLogRepository,
                           ChallengeCompletionRepository challengeCompletionRepository) {
        this.activityLogRepository = activityLogRepository;
        this.challengeCompletionRepository = challengeCompletionRepository;
    }

    /**
     * GET /api/insights/totals/{userId}
     * Returns { totalCo2Emitted, totalCo2Saved }
     */
    public Map<String, Object> getTotals(Long userId) {
        List<ActivityLog> logs = activityLogRepository.findByUserId(userId);
        double totalEmitted = logs.stream().mapToDouble(ActivityLog::getCo2Impact).sum();

        List<ChallengeCompletion> completions = challengeCompletionRepository.findByUserId(userId);
        double totalSaved = completions.stream().mapToDouble(ChallengeCompletion::getCo2Saved).sum();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalCo2Emitted", round(totalEmitted));
        result.put("totalCo2Saved", round(totalSaved));
        return result;
    }

    /**
     * GET /api/insights/carbon-journey/{userId}?weeks=N&breakdown=weekly|daily
     */
    public List<Map<String, Object>> getCarbonJourney(Long userId, int weeks, String breakdown) {
        if ("daily".equalsIgnoreCase(breakdown)) {
            return getDailyBreakdown(userId, weeks);
        }
        return getWeeklyBreakdown(userId, weeks);
    }

    /**
     * GET /api/insights/history/{userId}
     */
    public List<Map<String, Object>> getHistory(Long userId) {
        List<ActivityLog> logs = activityLogRepository.findByUserIdOrderByIdDesc(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (ActivityLog log : logs) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("id", log.getId());
            entry.put("foodId", log.getFoodId());
            entry.put("quantityGrams", log.getQuantityGrams());
            entry.put("co2Impact", log.getCo2Impact());
            entry.put("loggedAt", log.getLoggedAt());
            result.add(entry);
        }
        return result;
    }

    // ── Weekly breakdown ──
    private List<Map<String, Object>> getWeeklyBreakdown(Long userId, int weeks) {
        LocalDate today = LocalDate.now();
        LocalDate startOfCurrentWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate cutoff = startOfCurrentWeek.minusWeeks(weeks - 1);

        List<ActivityLog> logs = activityLogRepository.findByUserId(userId);
        List<ChallengeCompletion> completions = challengeCompletionRepository.findByUserId(userId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < weeks; i++) {
            LocalDate weekStart = cutoff.plusWeeks(i);
            LocalDate weekEnd = weekStart.plusDays(7);

            double emitted = logs.stream()
                    .filter(l -> isDateInRange(l.getLoggedAt(), weekStart, weekEnd))
                    .mapToDouble(ActivityLog::getCo2Impact)
                    .sum();

            double saved = completions.stream()
                    .filter(c -> isInstantInRange(c.getCompletedAt(), weekStart, weekEnd))
                    .mapToDouble(ChallengeCompletion::getCo2Saved)
                    .sum();

            // Week label like "2026-W11"
            int weekNumber = i + 1;
            int isoWeek = weekStart.get(java.time.temporal.IsoFields.WEEK_OF_WEEK_BASED_YEAR);
            String weekLabel = weekStart.getYear() + "-W" + String.format("%02d", isoWeek);

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("weekNumber", weekNumber);
            entry.put("weekLabel", weekLabel);
            entry.put("startDate", weekStart.toString());
            entry.put("totalEmitted", round(emitted));
            entry.put("totalSaved", round(saved));
            result.add(entry);
        }
        return result;
    }

    // ── Daily breakdown ──
    private List<Map<String, Object>> getDailyBreakdown(Long userId, int weeks) {
        LocalDate today = LocalDate.now();
        LocalDate startOfCurrentWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate cutoff = startOfCurrentWeek.minusWeeks(weeks - 1);

        List<ActivityLog> logs = activityLogRepository.findByUserId(userId);

        // Group by date
        Map<LocalDate, Double> dailyMap = new TreeMap<>();
        for (ActivityLog log : logs) {
            LocalDate date = parseDate(log.getLoggedAt());
            if (date != null && !date.isBefore(cutoff) && !date.isAfter(today)) {
                dailyMap.merge(date, log.getCo2Impact(), Double::sum);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<LocalDate, Double> entry : dailyMap.entrySet()) {
            Map<String, Object> day = new LinkedHashMap<>();
            day.put("date", entry.getKey().toString());
            day.put("totalEmitted", round(entry.getValue()));
            result.add(day);
        }
        return result;
    }

    // ── Helpers ──
    private boolean isDateInRange(String dateStr, LocalDate start, LocalDate end) {
        LocalDate date = parseDate(dateStr);
        return date != null && !date.isBefore(start) && date.isBefore(end);
    }

    private boolean isInstantInRange(Instant instant, LocalDate start, LocalDate end) {
        if (instant == null) return false;
        LocalDate date = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        return !date.isBefore(start) && date.isBefore(end);
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) return null;
        try {
            // Handle ISO datetime strings like "2026-04-01T12:00:00"
            if (dateStr.contains("T")) {
                return LocalDate.parse(dateStr.substring(0, 10));
            }
            return LocalDate.parse(dateStr);
        } catch (Exception e) {
            return null;
        }
    }

    private double round(double val) {
        return Math.round(val * 100.0) / 100.0;
    }
}
