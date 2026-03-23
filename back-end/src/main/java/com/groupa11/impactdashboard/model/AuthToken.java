package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "auth_tokens")
public class AuthToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public AuthToken() {}

    public AuthToken(String token, Long userId) {
        this.token = token;
        this.userId = userId;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getToken() { return token; }
    public Long getUserId() { return userId; }
    public Instant getCreatedAt() { return createdAt; }
}
