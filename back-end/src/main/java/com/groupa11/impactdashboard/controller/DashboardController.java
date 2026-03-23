package com.groupa11.impactdashboard.controller;

import com.groupa11.impactdashboard.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        return dashboardService.getGlobalSummary();
    }

    @GetMapping("/chart")
    public List<Map<String, Object>> getChart() {
        return dashboardService.getGlobalChart();
    }

    @GetMapping("/badges")
    public List<Map<String, Object>> getBadges() {
        return dashboardService.getGlobalBadges();
    }

    @GetMapping("/goal")
    public Map<String, Object> getGoal() {
        return dashboardService.getGlobalGoal();
    }

    @GetMapping("/details")
    public Map<String, Object> getDetails() {
        return dashboardService.getGlobalDetails();
    }
}
