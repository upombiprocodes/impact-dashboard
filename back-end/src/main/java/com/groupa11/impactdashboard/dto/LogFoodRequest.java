package com.groupa11.impactdashboard.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LogFoodRequest {
    @JsonProperty("food_id")
    private Long foodId;
    @JsonProperty("quantity_grams")
    private double quantityGrams;

    public Long getFoodId() { return foodId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }
    public double getQuantityGrams() { return quantityGrams; }
    public void setQuantityGrams(double quantityGrams) { this.quantityGrams = quantityGrams; }
}
