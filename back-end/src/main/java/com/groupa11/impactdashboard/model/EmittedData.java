package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "emitted_data")
public class EmittedData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String d;
    private int v;

    public EmittedData() {}

    public EmittedData(String d, int v) {
        this.d = d;
        this.v = v;
    }

    public Long getId() { return id; }
    public String getD() { return d; }
    public int getV() { return v; }
}
