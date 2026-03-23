package com.groupa11.impactdashboard;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupa11.impactdashboard.dto.UserCreateRequest;
import com.groupa11.impactdashboard.dto.UserLoginRequest;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class FullIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static String token1;
    private static String token2;
    private static String demoToken;
    private static final String TS = String.valueOf(System.currentTimeMillis());

    // ========== AUTH ==========

    @Test
    @Order(1)
    void registerUser() throws Exception {
        UserCreateRequest req = new UserCreateRequest();
        req.setEmail("test1_" + TS + "@test.com");
        req.setUsername("testuser1_" + TS);
        req.setPassword("pass123");

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.username").value("testuser1_" + TS))
                .andReturn();

        token1 = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("token").asText();
    }

    @Test
    @Order(2)
    void loginUser() throws Exception {
        UserLoginRequest req = new UserLoginRequest();
        req.setUsername("test1_" + TS + "@test.com");
        req.setPassword("pass123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.username").value("testuser1_" + TS));
    }

    @Test
    @Order(3)
    void demoLogin() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/demo-login"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username").value("alex_demo"))
                .andReturn();

        demoToken = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("token").asText();
    }

    @Test
    @Order(4)
    void getProfile() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser1_" + TS));
    }

    // ========== NEW USER DASHBOARD (EMPTY) ==========

    @Test
    @Order(5)
    void newUserDashboardEmpty() throws Exception {
        mockMvc.perform(get("/api/user/dashboard/details")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contributions", hasSize(0)))
                .andExpect(jsonPath("$.saved", hasSize(0)));
    }

    // ========== FOODS ==========

    @Test
    @Order(6)
    void foodsList() throws Exception {
        mockMvc.perform(get("/api/foods"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(20))));
    }

    // ========== CHALLENGES ==========

    @Test
    @Order(7)
    void completeChallenge() throws Exception {
        mockMvc.perform(post("/api/user/challenges/1/complete?co2_saved=4.05")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.co2_saved").value(4.05));
    }

    @Test
    @Order(8)
    void todayChallenges() throws Exception {
        mockMvc.perform(get("/api/user/challenges/today")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed_challenge_ids", hasItem(1)));
    }

    @Test
    @Order(9)
    void challengeHistory() throws Exception {
        mockMvc.perform(get("/api/user/challenges/history")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    // ========== FOOD LOGGING ==========

    @Test
    @Order(10)
    void logFood() throws Exception {
        mockMvc.perform(post("/api/log-food")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"food_id\":1,\"quantity_grams\":200}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.co2_impact").value(54.0))
                .andExpect(jsonPath("$.food_name").value("Beef steak"));
    }

    @Test
    @Order(11)
    void activityLogs() throws Exception {
        mockMvc.perform(get("/api/activity-logs")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    // ========== DASHBOARD AFTER ACTIVITY ==========

    @Test
    @Order(12)
    void dashboardAfterActivity() throws Exception {
        mockMvc.perform(get("/api/user/dashboard/details")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.saved", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.contributions", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.impact", hasSize(greaterThan(0))));
    }

    @Test
    @Order(13)
    void summaryAfterActivity() throws Exception {
        mockMvc.perform(get("/api/user/dashboard/summary")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.co2Emitted").value(54))
                .andExpect(jsonPath("$.co2Saved").value(4))
                .andExpect(jsonPath("$.streak").value(1));
    }

    // ========== USER ISOLATION ==========

    @Test
    @Order(14)
    void userIsolation() throws Exception {
        UserCreateRequest req = new UserCreateRequest();
        req.setEmail("test2_" + TS + "@test.com");
        req.setUsername("testuser2_" + TS);
        req.setPassword("pass123");

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        token2 = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("token").asText();

        mockMvc.perform(get("/api/activity-logs")
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        mockMvc.perform(get("/api/user/dashboard/summary")
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.co2Emitted").value(0));
    }

    // ========== LOGOUT ==========

    @Test
    @Order(15)
    void logout() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logged out successfully"));
    }

    // ========== GLOBAL DASHBOARD ==========

    @Test
    @Order(16)
    void globalDashboardSummary() throws Exception {
        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.co2Emitted").value(25.0))
                .andExpect(jsonPath("$.totalBadges").value(6));
    }

    @Test
    @Order(17)
    void globalDashboardChart() throws Exception {
        mockMvc.perform(get("/api/dashboard/chart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(12)));
    }

    @Test
    @Order(18)
    void globalBadges() throws Exception {
        mockMvc.perform(get("/api/dashboard/badges"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(6)));
    }

    @Test
    @Order(19)
    void globalGoal() throws Exception {
        mockMvc.perform(get("/api/dashboard/goal"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.target").value(100));
    }

    @Test
    @Order(20)
    void globalDetails() throws Exception {
        mockMvc.perform(get("/api/dashboard/details"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.emitted", hasSize(7)))
                .andExpect(jsonPath("$.streak", hasSize(28)));
    }

    // ========== ROOT ==========

    @Test
    @Order(21)
    void rootEndpoint() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));
    }

    // ========== DUPLICATE PREVENTION ==========

    @Test
    @Order(22)
    void duplicateEmailBlocked() throws Exception {
        UserCreateRequest req = new UserCreateRequest();
        req.setEmail("test1_" + TS + "@test.com");
        req.setUsername("newuser_" + TS);
        req.setPassword("pass123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
}
