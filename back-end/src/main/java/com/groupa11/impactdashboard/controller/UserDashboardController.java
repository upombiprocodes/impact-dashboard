package com.groupa11.impactdashboard.controller;

import com.groupa11.impactdashboard.service.ChallengeService;
import com.groupa11.impactdashboard.service.DashboardService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserDashboardController {

    private final DashboardService dashboardService;
    private final ChallengeService challengeService;

    public UserDashboardController(DashboardService dashboardService,
                                   ChallengeService challengeService) {
        this.dashboardService = dashboardService;
        this.challengeService = challengeService;
    }

    @GetMapping("/dashboard/summary")
    public Map<String, Object> getUserSummary(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return dashboardService.getUserSummary(userId);
    }

    @GetMapping("/dashboard/chart")
    public List<Map<String, Object>> getUserChart(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return dashboardService.getUserChart(userId);
    }

    @GetMapping("/dashboard/details")
    public Map<String, Object> getUserDetails(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return dashboardService.getUserDetails(userId);
    }

    @PostMapping("/challenges/{challengeId}/complete")
    public Map<String, Object> completeChallenge(
            @PathVariable int challengeId,
            HttpServletRequest request) {
        Long userId = requireAuth(request);
        return challengeService.completeChallenge(userId, challengeId);
    }

    @GetMapping("/challenges/history")
    public List<Map<String, Object>> getChallengeHistory(HttpServletRequest request) {
        Long userId = requireAuth(request);
        return challengeService.getChallengeHistory(userId);
    }

    @GetMapping("/challenges/today")
    public Map<String, Object> getTodayCompletions(HttpServletRequest request) {
        Long userId = requireAuth(request);
        return challengeService.getTodayCompletions(userId);
    }

    private Long requireAuth(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        return userId;
    }
}
