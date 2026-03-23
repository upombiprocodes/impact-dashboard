package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "foods")
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private boolean isVeg;

    private double protein;
    private double co2Per100g;
    private String rating;
    private String origin;
    private String notes;

    public Food() {}

    public Food(String name, String category, boolean isVeg, double protein,
                double co2Per100g, String rating, String origin, String notes) {
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
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public boolean isVeg() { return isVeg; }
    public void setVeg(boolean veg) { isVeg = veg; }

    public double getProtein() { return protein; }
    public void setProtein(double protein) { this.protein = protein; }

    public double getCo2Per100g() { return co2Per100g; }
    public void setCo2Per100g(double co2Per100g) { this.co2Per100g = co2Per100g; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
