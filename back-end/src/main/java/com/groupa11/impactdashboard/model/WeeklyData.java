package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "weekly_data")
public class WeeklyData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String week;
    private int footprint;
    private int saved;
    private int baseline;

    public WeeklyData() {}

    public WeeklyData(String week, int footprint, int saved, int baseline) {
        this.week = week;
        this.footprint = footprint;
        this.saved = saved;
        this.baseline = baseline;
    }

    public Long getId() { return id; }
    public String getWeek() { return week; }
    public int getFootprint() { return footprint; }
    public int getSaved() { return saved; }
    public int getBaseline() { return baseline; }
}
