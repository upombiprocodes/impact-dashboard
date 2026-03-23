package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "streak_days")
public class StreakDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int dayIndex;
    private boolean completed;

    public StreakDay() {}

    public StreakDay(int dayIndex, boolean completed) {
        this.dayIndex = dayIndex;
        this.completed = completed;
    }

    public Long getId() { return id; }
    public int getDayIndex() { return dayIndex; }
    public boolean isCompleted() { return completed; }
}
