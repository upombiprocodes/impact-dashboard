package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "challenge_completions")
public class ChallengeCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private int challengeId;

    @Column(nullable = false)
    private Instant completedAt = Instant.now();

    private double co2Saved;

    public ChallengeCompletion() {}

    public ChallengeCompletion(Long userId, int challengeId, Instant completedAt, double co2Saved) {
        this.userId = userId;
        this.challengeId = challengeId;
        this.completedAt = completedAt;
        this.co2Saved = co2Saved;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public int getChallengeId() { return challengeId; }
    public void setChallengeId(int challengeId) { this.challengeId = challengeId; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public double getCo2Saved() { return co2Saved; }
    public void setCo2Saved(double co2Saved) { this.co2Saved = co2Saved; }
}
