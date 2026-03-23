package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_weekly_data")
public class UserWeeklyData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String week;

    private int footprint;
    private int saved;
    private int baseline = 35;

    public UserWeeklyData() {}

    public UserWeeklyData(Long userId, String week, int footprint, int saved, int baseline) {
        this.userId = userId;
        this.week = week;
        this.footprint = footprint;
        this.saved = saved;
        this.baseline = baseline;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getWeek() { return week; }
    public void setWeek(String week) { this.week = week; }

    public int getFootprint() { return footprint; }
    public void setFootprint(int footprint) { this.footprint = footprint; }

    public int getSaved() { return saved; }
    public void setSaved(int saved) { this.saved = saved; }

    public int getBaseline() { return baseline; }
    public void setBaseline(int baseline) { this.baseline = baseline; }
}
