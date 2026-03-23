package com.groupa11.impactdashboard.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public class UserResponse {
    private Long id;
    private String email;
    private String username;
    @JsonProperty("display_name")
    private String displayName;
    @JsonProperty("is_demo")
    private boolean isDemo;
    @JsonProperty("created_at")
    private Instant createdAt;

    public UserResponse() {}

    public UserResponse(Long id, String email, String username, String displayName,
                        boolean isDemo, Instant createdAt) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.displayName = displayName;
        this.isDemo = isDemo;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public boolean isDemo() { return isDemo; }
    public void setDemo(boolean demo) { isDemo = demo; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
