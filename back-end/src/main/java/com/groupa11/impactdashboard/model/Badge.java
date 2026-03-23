package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "badges")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String icon;
    private boolean unlocked;
    private String description;

    public Badge() {}

    public Badge(String name, String icon, boolean unlocked, String description) {
        this.name = name;
        this.icon = icon;
        this.unlocked = unlocked;
        this.description = description;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getIcon() { return icon; }
    public boolean isUnlocked() { return unlocked; }
    public void setUnlocked(boolean unlocked) { this.unlocked = unlocked; }
    public String getDescription() { return description; }
}
