package com.groupa11.impactdashboard.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FoodResponse {
    private Long id;
    private String name;
    private String category;
    @JsonProperty("is_veg")
    private boolean isVeg;
    private double protein;
    @JsonProperty("co2_per_100g")
    private double co2Per100g;
    private String rating;
    private String origin;
    private String notes;

    public FoodResponse() {}

    public FoodResponse(Long id, String name, String category, boolean isVeg, double protein,
                        double co2Per100g, String rating, String origin, String notes) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.isVeg = isVeg;
        this.protein = protein;
        this.co2Per100g = co2Per100g;
        this.rating = rating;
        this.origin = origin;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public boolean isVeg() { return isVeg; }
    public double getProtein() { return protein; }
    public double getCo2Per100g() { return co2Per100g; }
    public String getRating() { return rating; }
    public String getOrigin() { return origin; }
    public String getNotes() { return notes; }
}
