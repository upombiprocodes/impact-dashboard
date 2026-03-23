package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "saved_items")
public class SavedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String n;
    private String v;

    public SavedItem() {}

    public SavedItem(String n, String v) {
        this.n = n;
        this.v = v;
    }

    public Long getId() { return id; }
    public String getN() { return n; }
    public String getV() { return v; }
}
