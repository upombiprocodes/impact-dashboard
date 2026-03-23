package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "contributions")
public class Contribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String d;
    private String v;

    public Contribution() {}

    public Contribution(String d, String v) {
        this.d = d;
        this.v = v;
    }

    public Long getId() { return id; }
    public String getD() { return d; }
    public String getV() { return v; }
}
