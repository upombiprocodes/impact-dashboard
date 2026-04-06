package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "challenges")
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String difficulty;
    private String category;
    private String icon;
    private double co2Impact;
    private String unit;
    private String tips;

    public Challenge() {}

    public Challenge(String title, String description, String difficulty, String category,
                     String icon, double co2Impact, String unit, String tips) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.category = category;
        this.icon = icon;
        this.co2Impact = co2Impact;
        this.unit = unit;
        this.tips = tips;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public double getCo2Impact() { return co2Impact; }
    public void setCo2Impact(double co2Impact) { this.co2Impact = co2Impact; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getTips() { return tips; }
    public void setTips(String tips) { this.tips = tips; }
}
