package com.groupa11.impactdashboard.service;

import com.groupa11.impactdashboard.model.*;
import com.groupa11.impactdashboard.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final DashboardSummaryRepository summaryRepo;
    private final WeeklyDataRepository weeklyDataRepo;
    private final BadgeRepository badgeRepo;
    private final MonthlyGoalRepository goalRepo;
    private final EmittedDataRepository emittedRepo;
    private final SavedItemRepository savedItemRepo;
    private final StreakDayRepository streakDayRepo;
    private final ContributionRepository contributionRepo;
    private final ImpactDetailRepository impactDetailRepo;
    private final UserWeeklyDataRepository userWeeklyDataRepo;
    private final UserBadgeRepository userBadgeRepo;
    private final ChallengeCompletionRepository challengeCompletionRepo;
    private final ActivityLogRepository activityLogRepo;
    private final FoodRepository foodRepo;

    public DashboardService(DashboardSummaryRepository summaryRepo,
                            WeeklyDataRepository weeklyDataRepo,
                            BadgeRepository badgeRepo,
                            MonthlyGoalRepository goalRepo,
                            EmittedDataRepository emittedRepo,
                            SavedItemRepository savedItemRepo,
                            StreakDayRepository streakDayRepo,
                            ContributionRepository contributionRepo,
                            ImpactDetailRepository impactDetailRepo,
                            UserWeeklyDataRepository userWeeklyDataRepo,
                            UserBadgeRepository userBadgeRepo,
                            ChallengeCompletionRepository challengeCompletionRepo,
                            ActivityLogRepository activityLogRepo,
                            FoodRepository foodRepo) {
        this.summaryRepo = summaryRepo;
        this.weeklyDataRepo = weeklyDataRepo;
        this.badgeRepo = badgeRepo;
        this.goalRepo = goalRepo;
        this.emittedRepo = emittedRepo;
        this.savedItemRepo = savedItemRepo;
        this.streakDayRepo = streakDayRepo;
        this.contributionRepo = contributionRepo;
        this.impactDetailRepo = impactDetailRepo;
        this.userWeeklyDataRepo = userWeeklyDataRepo;
        this.userBadgeRepo = userBadgeRepo;
        this.challengeCompletionRepo = challengeCompletionRepo;
        this.activityLogRepo = activityLogRepo;
        this.foodRepo = foodRepo;
    }

    // ========== GLOBAL DASHBOARD ==========

    public Map<String, Object> getGlobalSummary() {
        DashboardSummary s = summaryRepo.findAll().stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Summary not found"));
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("co2Emitted", s.getCo2Emitted());
        m.put("co2Saved", s.getCo2Saved());
        m.put("streak", s.getStreak());
        m.put("badgesUnlocked", s.getBadgesUnlocked());
        m.put("totalBadges", s.getTotalBadges());
        m.put("percentChange", s.getPercentChange());
        return m;
    }

    public List<Map<String, Object>> getGlobalChart() {
        return weeklyDataRepo.findAll().stream().map(w -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("week", w.getWeek());
            m.put("footprint", w.getFootprint());
            m.put("saved", w.getSaved());
            m.put("baseline", w.getBaseline());
            return m;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getGlobalBadges() {
        return badgeRepo.findAll().stream().map(b -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", b.getId());
            m.put("name", b.getName());
            m.put("icon", b.getIcon());
            m.put("unlocked", b.isUnlocked());
            m.put("description", b.getDescription());
            return m;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getGlobalGoal() {
        MonthlyGoal g = goalRepo.findAll().stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Goal not found"));
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("target", g.getTarget());
        m.put("current", g.getCurrent());
        m.put("daysLeft", g.getDaysLeft());
        return m;
    }

    public Map<String, Object> getGlobalDetails() {
        List<Map<String, Object>> emitted = emittedRepo.findAll().stream().map(e -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("d", e.getD());
            m.put("v", e.getV());
            return m;
        }).collect(Collectors.toList());

        List<Map<String, Object>> saved = savedItemRepo.findAll().stream().map(s -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("n", s.getN());
            m.put("v", s.getV());
            return m;
        }).collect(Collectors.toList());

        List<Boolean> streak = streakDayRepo.findAllByOrderByDayIndexAsc().stream()
                .map(StreakDay::isCompleted).collect(Collectors.toList());

        List<Map<String, Object>> contributions = contributionRepo.findAll().stream().map(c -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("d", c.getD());
            m.put("v", c.getV());
            return m;
        }).collect(Collectors.toList());

        List<Map<String, Object>> impact = impactDetailRepo.findAll().stream().map(i -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("label", i.getLabel());
            m.put("value", i.getValue());
            return m;
        }).collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("emitted", emitted);
        result.put("saved", saved);
        result.put("streak", streak);
        result.put("contributions", contributions);
        result.put("impact", impact);
        return result;
    }

    // ========== USER-SPECIFIC DASHBOARD ==========

    public Map<String, Object> getUserSummary(Long userId) {
        if (userId == null) return getGlobalSummary();

        List<UserWeeklyData> weeklyData = userWeeklyDataRepo.findByUserIdOrderByIdAsc(userId);
        int weeklySaved = weeklyData.stream().mapToInt(UserWeeklyData::getSaved).sum();

        int recentSaved = 0;
        int recentEmitted = 0;
        int size = weeklyData.size();
        for (int i = Math.max(0, size - 4); i < size; i++) {
            recentSaved += weeklyData.get(i).getSaved();
            recentEmitted += weeklyData.get(i).getFootprint();
        }

        List<UserBadge> badges = userBadgeRepo.findByUserId(userId);
        long unlocked = badges.stream().filter(UserBadge::isUnlocked).count();

        // Calculate streak and total CO2 saved from challenge completions
        List<ChallengeCompletion> completions = challengeCompletionRepo
                .findByUserIdOrderByCompletedAtDesc(userId);
        int streak = 0;
        if (!completions.isEmpty()) {
            LocalDate today = LocalDate.now(ZoneOffset.UTC);
            for (int i = 0; i < completions.size(); i++) {
                LocalDate cDate = completions.get(i).getCompletedAt()
                        .atZone(ZoneOffset.UTC).toLocalDate();
                if (Duration.between(cDate.atStartOfDay(), today.atStartOfDay()).toDays() <= i + 1) {
                    streak++;
                } else {
                    break;
                }
            }
        }

        // Calculate CO2 saved directly from challenge completions (source of truth)
        double challengeCo2Saved = completions.stream()
                .mapToDouble(ChallengeCompletion::getCo2Saved).sum();
        // Use the higher of weekly data sum or challenge completions sum
        double totalSaved = Math.max(weeklySaved, challengeCo2Saved);
        double displaySaved = Math.max(recentSaved, challengeCo2Saved);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("co2Emitted", recentEmitted);
        result.put("co2Saved", Math.round(displaySaved * 10.0) / 10.0);
        result.put("streak", streak);
        result.put("badgesUnlocked", (int) unlocked);
        result.put("totalBadges", badges.size());
        result.put("percentChange", totalSaved > 0 ? -12.5 : 0);
        return result;
    }

    public List<Map<String, Object>> getUserChart(Long userId) {
        if (userId == null) return getGlobalChart();

        return userWeeklyDataRepo.findByUserIdOrderByIdAsc(userId).stream().map(w -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("week", w.getWeek());
            m.put("footprint", w.getFootprint());
            m.put("saved", w.getSaved());
            m.put("baseline", w.getBaseline());
            return m;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getUserDetails(Long userId) {
        if (userId == null) return getGlobalDetails();

        String[] dayNames = {"M", "T", "W", "T", "F", "S", "S"};
        LocalDate today = LocalDate.now(ZoneOffset.UTC);

        List<ChallengeCompletion> completions = challengeCompletionRepo.findByUserId(userId);

        // Emitted per day-of-week from food logs
        Map<Integer, Double> dailyEmitted = new HashMap<>();
        List<ActivityLog> foodLogs = activityLogRepo.findByUserId(userId);
        for (ActivityLog log : foodLogs) {
            try {
                LocalDate logDate = Instant.parse(log.getLoggedAt())
                        .atZone(ZoneOffset.UTC).toLocalDate();
                long daysAgo = Duration.between(logDate.atStartOfDay(), today.atStartOfDay()).toDays();
                if (daysAgo < 7) {
                    int dow = logDate.getDayOfWeek().getValue() - 1; // 0=Mon
                    dailyEmitted.merge(dow, log.getCo2Impact(), Double::sum);
                }
            } catch (Exception ignored) {}
        }

        List<Map<String, Object>> emittedData = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("d", dayNames[i]);
            double val = dailyEmitted.getOrDefault(i, 0.0);
            m.put("v", Math.round(val * 10.0) / 10.0);
            emittedData.add(m);
        }

        // Saved breakdown from challenges (last 30 days)
        Map<String, Double> categoryTotals = new LinkedHashMap<>();
        for (ChallengeCompletion c : completions) {
            long daysAgo = Duration.between(
                    c.getCompletedAt().atZone(ZoneOffset.UTC).toLocalDate().atStartOfDay(),
                    today.atStartOfDay()).toDays();
            if (daysAgo < 30) {
                categoryTotals.merge("Challenges", c.getCo2Saved(), Double::sum);
            }
        }

        // Food log totals in last 30 days
        double foodTotal30d = 0.0;
        for (ActivityLog log : foodLogs) {
            try {
                LocalDate logDate = Instant.parse(log.getLoggedAt())
                        .atZone(ZoneOffset.UTC).toLocalDate();
                long daysAgo = Duration.between(logDate.atStartOfDay(), today.atStartOfDay()).toDays();
                if (daysAgo < 30) {
                    foodTotal30d += log.getCo2Impact();
                }
            } catch (Exception ignored) {}
        }
        if (foodTotal30d > 0) {
            categoryTotals.put("Food Logged", foodTotal30d);
        }

        List<Map<String, Object>> savedItems = new ArrayList<>();
        for (Map.Entry<String, Double> entry : categoryTotals.entrySet()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("n", entry.getKey());
            m.put("v", String.format("%.1fkg", entry.getValue()));
            savedItems.add(m);
        }

        // Streak calendar (last 28 days)
        Set<LocalDate> completionDates = completions.stream()
                .map(c -> c.getCompletedAt().atZone(ZoneOffset.UTC).toLocalDate())
                .collect(Collectors.toSet());
        List<Boolean> streakDays = new ArrayList<>();
        for (int i = 0; i < 28; i++) {
            LocalDate d = today.minusDays(27 - i);
            streakDays.add(completionDates.contains(d));
        }

        // Recent contributions
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd");
        List<ChallengeCompletion> recent = completions.stream()
                .sorted(Comparator.comparing(ChallengeCompletion::getCompletedAt).reversed())
                .limit(5)
                .collect(Collectors.toList());

        List<Map<String, Object>> contributionsList = new ArrayList<>();
        for (ChallengeCompletion c : recent) {
            LocalDate cDate = c.getCompletedAt().atZone(ZoneOffset.UTC).toLocalDate();
            long daysAgo = Duration.between(cDate.atStartOfDay(), today.atStartOfDay()).toDays();
            String label;
            if (daysAgo == 0) label = "Today";
            else if (daysAgo == 1) label = "Yesterday";
            else label = cDate.format(fmt);

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("d", label);
            m.put("v", String.format("+%.1fkg", c.getCo2Saved()));
            contributionsList.add(m);
        }

        // Environmental impact
        double totalSaved = completions.stream().mapToDouble(ChallengeCompletion::getCo2Saved).sum();
        List<Map<String, Object>> impact = new ArrayList<>();
        Map<String, Object> water = new LinkedHashMap<>();
        water.put("label", "Water");
        water.put("value", (int) (totalSaved * 15) + "L");
        impact.add(water);
        Map<String, Object> land = new LinkedHashMap<>();
        land.put("label", "Land");
        land.put("value", (int) (totalSaved * 0.5) + "m²");
        impact.add(land);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("emitted", emittedData);
        result.put("saved", savedItems);
        result.put("streak", streakDays);
        result.put("contributions", contributionsList);
        result.put("impact", impact);
        return result;
    }

    // Fix badges endpoint
    public Map<String, Object> fixBadges() {
        badgeRepo.findByName("Plant Pioneer").ifPresent(b -> {
            b.setUnlocked(true);
            badgeRepo.save(b);
        });
        summaryRepo.findAll().stream().findFirst().ifPresent(s -> {
            s.setBadgesUnlocked(5);
            summaryRepo.save(s);
        });
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "fixed");
        result.put("message", "Plant Pioneer badge unlocked, summary updated to 5 badges");
        return result;
    }
}
