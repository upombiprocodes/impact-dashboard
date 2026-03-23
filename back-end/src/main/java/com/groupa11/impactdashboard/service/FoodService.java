package com.groupa11.impactdashboard.service;

import com.groupa11.impactdashboard.dto.FoodResponse;
import com.groupa11.impactdashboard.dto.LogFoodRequest;
import com.groupa11.impactdashboard.dto.LogFoodResponse;
import com.groupa11.impactdashboard.dto.ActivityLogResponse;
import com.groupa11.impactdashboard.model.ActivityLog;
import com.groupa11.impactdashboard.model.Food;
import com.groupa11.impactdashboard.model.UserWeeklyData;
import com.groupa11.impactdashboard.repository.ActivityLogRepository;
import com.groupa11.impactdashboard.repository.FoodRepository;
import com.groupa11.impactdashboard.repository.UserWeeklyDataRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodService {

    private final FoodRepository foodRepository;
    private final ActivityLogRepository activityLogRepository;
    private final UserWeeklyDataRepository weeklyDataRepository;

    public FoodService(FoodRepository foodRepository,
                       ActivityLogRepository activityLogRepository,
                       UserWeeklyDataRepository weeklyDataRepository) {
        this.foodRepository = foodRepository;
        this.activityLogRepository = activityLogRepository;
        this.weeklyDataRepository = weeklyDataRepository;
    }

    public List<FoodResponse> getFoods(String category, Boolean isVeg, String search) {
        List<Food> foods;

        if (search != null && !search.isEmpty()) {
            foods = foodRepository.findByNameContainingIgnoreCase(search);
        } else if (category != null && !category.equals("all") && isVeg != null) {
            foods = foodRepository.findByCategoryAndIsVeg(category, isVeg);
        } else if (category != null && !category.equals("all")) {
            foods = foodRepository.findByCategory(category);
        } else if (isVeg != null) {
            foods = foodRepository.findByIsVeg(isVeg);
        } else {
            foods = foodRepository.findAll();
        }

        return foods.stream().map(this::toFoodResponse).collect(Collectors.toList());
    }

    public List<String> getCategories() {
        List<String> cats = new ArrayList<>();
        cats.add("all");
        cats.addAll(foodRepository.findDistinctCategories());
        return cats;
    }

    public FoodResponse getFoodById(Long id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Food not found"));
        return toFoodResponse(food);
    }

    public LogFoodResponse logFood(LogFoodRequest request, Long userId) {
        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Food not found"));

        double co2Impact = Math.round((food.getCo2Per100g() * request.getQuantityGrams()) / 100.0 * 100.0) / 100.0;
        String loggedAt = Instant.now().toString();

        ActivityLog log = new ActivityLog(userId, food.getId(), request.getQuantityGrams(), co2Impact, loggedAt);
        log = activityLogRepository.save(log);

        // Update user's weekly footprint
        if (userId != null) {
            List<UserWeeklyData> weeks = weeklyDataRepository.findByUserIdOrderByIdAsc(userId);
            if (!weeks.isEmpty()) {
                UserWeeklyData lastWeek = weeks.get(weeks.size() - 1);
                lastWeek.setFootprint(lastWeek.getFootprint() + (int) Math.round(co2Impact));
                weeklyDataRepository.save(lastWeek);
            }
        }

        return new LogFoodResponse(log.getId(), food.getName(), request.getQuantityGrams(), co2Impact, loggedAt);
    }

    public List<ActivityLogResponse> getActivityLogs(Long userId, int limit) {
        List<ActivityLog> logs;
        if (userId != null) {
            logs = activityLogRepository.findByUserIdOrderByIdDesc(userId);
        } else {
            logs = activityLogRepository.findAll();
        }

        return logs.stream()
                .limit(limit)
                .map(log -> {
                    String foodName = foodRepository.findById(log.getFoodId())
                            .map(Food::getName).orElse("Unknown");
                    return new ActivityLogResponse(
                            log.getId(), foodName, log.getQuantityGrams(),
                            log.getCo2Impact(), log.getLoggedAt()
                    );
                })
                .collect(Collectors.toList());
    }

    private FoodResponse toFoodResponse(Food f) {
        return new FoodResponse(f.getId(), f.getName(), f.getCategory(), f.isVeg(),
                f.getProtein(), f.getCo2Per100g(), f.getRating(), f.getOrigin(), f.getNotes());
    }
}
