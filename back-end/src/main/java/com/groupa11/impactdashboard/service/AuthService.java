package com.groupa11.impactdashboard.service;

import com.groupa11.impactdashboard.dto.AuthResponse;
import com.groupa11.impactdashboard.dto.UserCreateRequest;
import com.groupa11.impactdashboard.dto.UserLoginRequest;
import com.groupa11.impactdashboard.dto.UserResponse;
import com.groupa11.impactdashboard.model.*;
import com.groupa11.impactdashboard.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.groupa11.impactdashboard.model.AuthToken;
import com.groupa11.impactdashboard.repository.AuthTokenRepository;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserWeeklyDataRepository weeklyDataRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final ChallengeCompletionRepository challengeCompletionRepository;
    private final AuthTokenRepository authTokenRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserRepository userRepository,
                       UserWeeklyDataRepository weeklyDataRepository,
                       UserBadgeRepository userBadgeRepository,
                       ChallengeCompletionRepository challengeCompletionRepository,
                       AuthTokenRepository authTokenRepository) {
        this.userRepository = userRepository;
        this.weeklyDataRepository = weeklyDataRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.challengeCompletionRepository = challengeCompletionRepository;
        this.authTokenRepository = authTokenRepository;
    }

    public Long getUserIdFromToken(String token) {
        return authTokenRepository.findByToken(token)
                .map(AuthToken::getUserId)
                .orElse(null);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public AuthResponse register(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already taken");
        }

        User user = new User(
                request.getEmail(),
                request.getUsername(),
                hashPassword(request.getPassword()),
                request.getDisplay_name() != null ? request.getDisplay_name() : request.getUsername(),
                false
        );
        user = userRepository.save(user);
        initUserData(user.getId());

        String token = createToken();
        authTokenRepository.save(new AuthToken(token, user.getId()));
        return new AuthResponse(token, toUserResponse(user));
    }

    public AuthResponse login(UserLoginRequest request) {
        User user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!hashPassword(request.getPassword()).equals(user.getHashedPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = createToken();
        authTokenRepository.save(new AuthToken(token, user.getId()));
        return new AuthResponse(token, toUserResponse(user));
    }

    public AuthResponse demoLogin() {
        User demoUser = userRepository.findByUsername("alex_demo").orElse(null);

        if (demoUser == null) {
            demoUser = new User(
                    "alex@demo.com",
                    "alex_demo",
                    hashPassword("demo123"),
                    "Alex",
                    true
            );
            demoUser = userRepository.save(demoUser);
            initDemoUserData(demoUser.getId());
        }

        String token = createToken();
        authTokenRepository.save(new AuthToken(token, demoUser.getId()));
        return new AuthResponse(token, toUserResponse(demoUser));
    }

    @jakarta.transaction.Transactional
    public void logout(String token) {
        if (token != null) {
            authTokenRepository.deleteByToken(token);
        }
    }

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getDisplayName(),
                user.isDemo(),
                user.getCreatedAt()
        );
    }

    private void initUserData(Long userId) {
        for (int i = 1; i <= 12; i++) {
            weeklyDataRepository.save(new UserWeeklyData(userId, "W" + i, 0, 0, 35));
        }
        String[] badges = {"First Week", "Beef-Free", "Carbon Crusher", "Hot Streak", "Plant Pioneer", "Climate Champ"};
        for (String badge : badges) {
            userBadgeRepository.save(new UserBadge(userId, badge, false, null));
        }
    }

    private void initDemoUserData(Long userId) {
        int[][] weekData = {
                {32, 22}, {29, 28}, {35, 18}, {28, 30}, {31, 25}, {25, 32},
                {30, 27}, {24, 35}, {26, 29}, {22, 38}, {20, 41}, {18, 45}
        };
        for (int i = 0; i < 12; i++) {
            weeklyDataRepository.save(new UserWeeklyData(userId, "W" + (i + 1),
                    weekData[i][0], weekData[i][1], 35));
        }

        Object[][] badges = {
                {"First Week", true}, {"Beef-Free", true}, {"Carbon Crusher", true},
                {"Hot Streak", true}, {"Plant Pioneer", true}, {"Climate Champ", false}
        };
        for (Object[] b : badges) {
            boolean unlocked = (boolean) b[1];
            userBadgeRepository.save(new UserBadge(userId, (String) b[0], unlocked,
                    unlocked ? Instant.now() : null));
        }

        for (int i = 0; i < 15; i++) {
            challengeCompletionRepository.save(new ChallengeCompletion(
                    userId,
                    (i % 50) + 1,
                    Instant.now().minus(i, ChronoUnit.DAYS),
                    (i + 1) * 0.5
            ));
        }
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private String createToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
