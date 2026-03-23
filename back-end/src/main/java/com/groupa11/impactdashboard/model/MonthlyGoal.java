package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "monthly_goals")
public class MonthlyGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int target;
    private int current;
    private int daysLeft;

    public MonthlyGoal() {}

    public MonthlyGoal(int target, int current, int daysLeft) {
        this.target = target;
        this.current = current;
        this.daysLeft = daysLeft;
    }

    public Long getId() { return id; }
    public int getTarget() { return target; }
    public int getCurrent() { return current; }
    public int getDaysLeft() { return daysLeft; }
}
