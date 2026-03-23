package com.groupa11.impactdashboard.controller;

import com.groupa11.impactdashboard.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    private final DashboardService dashboardService;

    public RootController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of("status", "ok", "message", "Impact Dashboard Backend is running");
    }

    @GetMapping("/api/fix-badges")
    public Map<String, Object> fixBadges() {
        return dashboardService.fixBadges();
    }
}
