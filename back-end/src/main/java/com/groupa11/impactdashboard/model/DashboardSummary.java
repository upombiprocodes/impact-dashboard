package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "dashboard_summary")
public class DashboardSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double co2Emitted;
    private double co2Saved;
    private int streak;
    private int badgesUnlocked;
    private int totalBadges;
    private double percentChange;

    public DashboardSummary() {}

    public DashboardSummary(double co2Emitted, double co2Saved, int streak,
                            int badgesUnlocked, int totalBadges, double percentChange) {
        this.co2Emitted = co2Emitted;
        this.co2Saved = co2Saved;
        this.streak = streak;
        this.badgesUnlocked = badgesUnlocked;
        this.totalBadges = totalBadges;
        this.percentChange = percentChange;
    }

    public Long getId() { return id; }
    public double getCo2Emitted() { return co2Emitted; }
    public void setCo2Emitted(double co2Emitted) { this.co2Emitted = co2Emitted; }
    public double getCo2Saved() { return co2Saved; }
    public void setCo2Saved(double co2Saved) { this.co2Saved = co2Saved; }
    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }
    public int getBadgesUnlocked() { return badgesUnlocked; }
    public void setBadgesUnlocked(int badgesUnlocked) { this.badgesUnlocked = badgesUnlocked; }
    public int getTotalBadges() { return totalBadges; }
    public void setTotalBadges(int totalBadges) { this.totalBadges = totalBadges; }
    public double getPercentChange() { return percentChange; }
    public void setPercentChange(double percentChange) { this.percentChange = percentChange; }
}
