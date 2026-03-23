package com.groupa11.impactdashboard.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LogFoodResponse {
    private Long id;
    @JsonProperty("food_name")
    private String foodName;
    @JsonProperty("quantity_grams")
    private double quantityGrams;
    @JsonProperty("co2_impact")
    private double co2Impact;
    @JsonProperty("logged_at")
    private String loggedAt;

    public LogFoodResponse() {}

    public LogFoodResponse(Long id, String foodName, double quantityGrams, double co2Impact, String loggedAt) {
        this.id = id;
        this.foodName = foodName;
        this.quantityGrams = quantityGrams;
        this.co2Impact = co2Impact;
        this.loggedAt = loggedAt;
    }

    public Long getId() { return id; }
    public String getFoodName() { return foodName; }
    public double getQuantityGrams() { return quantityGrams; }
    public double getCo2Impact() { return co2Impact; }
    public String getLoggedAt() { return loggedAt; }
}
