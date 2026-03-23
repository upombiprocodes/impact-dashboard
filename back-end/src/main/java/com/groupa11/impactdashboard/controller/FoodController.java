package com.groupa11.impactdashboard.controller;

import com.groupa11.impactdashboard.dto.*;
import com.groupa11.impactdashboard.service.FoodService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping("/foods")
    public List<FoodResponse> getFoods(
            @RequestParam(required = false) String category,
            @RequestParam(name = "is_veg", required = false) Boolean isVeg,
            @RequestParam(required = false) String search) {
        return foodService.getFoods(category, isVeg, search);
    }

    @GetMapping("/foods/categories")
    public List<String> getCategories() {
        return foodService.getCategories();
    }

    @GetMapping("/foods/{foodId}")
    public FoodResponse getFood(@PathVariable Long foodId) {
        return foodService.getFoodById(foodId);
    }

    @PostMapping("/log-food")
    public LogFoodResponse logFood(@RequestBody LogFoodRequest request, HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        return foodService.logFood(request, userId);
    }

    @GetMapping("/activity-logs")
    public List<ActivityLogResponse> getActivityLogs(
            @RequestParam(defaultValue = "10") int limit,
            HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        return foodService.getActivityLogs(userId, limit);
    }
}
