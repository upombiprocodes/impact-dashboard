package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private Long userId;

    @Column(nullable = false)
    private Long foodId;

    private double quantityGrams;
    private double co2Impact;
    private String loggedAt;

    public ActivityLog() {}

    public ActivityLog(Long userId, Long foodId, double quantityGrams, double co2Impact, String loggedAt) {
        this.userId = userId;
        this.foodId = foodId;
        this.quantityGrams = quantityGrams;
        this.co2Impact = co2Impact;
        this.loggedAt = loggedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getFoodId() { return foodId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }

    public double getQuantityGrams() { return quantityGrams; }
    public void setQuantityGrams(double quantityGrams) { this.quantityGrams = quantityGrams; }

    public double getCo2Impact() { return co2Impact; }
    public void setCo2Impact(double co2Impact) { this.co2Impact = co2Impact; }

    public String getLoggedAt() { return loggedAt; }
    public void setLoggedAt(String loggedAt) { this.loggedAt = loggedAt; }
}
