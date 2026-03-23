package com.groupa11.impactdashboard.controller;

import com.groupa11.impactdashboard.dto.AuthResponse;
import com.groupa11.impactdashboard.dto.UserCreateRequest;
import com.groupa11.impactdashboard.dto.UserLoginRequest;
import com.groupa11.impactdashboard.dto.UserResponse;
import com.groupa11.impactdashboard.model.User;
import com.groupa11.impactdashboard.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody UserCreateRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody UserLoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/demo-login")
    public AuthResponse demoLogin() {
        return authService.demoLogin();
    }

    @PostMapping("/logout")
    public Map<String, String> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authService.logout(authHeader.substring(7));
        }
        return Map.of("message", "Logged out successfully");
    }

    @GetMapping("/me")
    public UserResponse getMe(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        User user = authService.getUserById(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        return authService.toUserResponse(user);
    }
}
