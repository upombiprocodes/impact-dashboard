package com.groupa11.impactdashboard.controller;

import com.groupa11.impactdashboard.service.InsightsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/insights")
public class InsightsController {

    private final InsightsService insightsService;

    public InsightsController(InsightsService insightsService) {
        this.insightsService = insightsService;
    }

    @GetMapping("/totals/{userId}")
    public Map<String, Object> getTotals(@PathVariable Long userId) {
        return insightsService.getTotals(userId);
    }

    @GetMapping("/carbon-journey/{userId}")
    public List<Map<String, Object>> getCarbonJourney(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "4") int weeks,
            @RequestParam(defaultValue = "weekly") String breakdown) {
        return insightsService.getCarbonJourney(userId, weeks, breakdown);
    }

    @GetMapping("/history/{userId}")
    public List<Map<String, Object>> getHistory(@PathVariable Long userId) {
        return insightsService.getHistory(userId);
    }
}
