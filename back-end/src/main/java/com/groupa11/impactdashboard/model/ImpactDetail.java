package com.groupa11.impactdashboard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "impact_details")
public class ImpactDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;

    @Column(name = "\"value\"")
    private String value;

    public ImpactDetail() {}

    public ImpactDetail(String label, String value) {
        this.label = label;
        this.value = value;
    }

    public Long getId() { return id; }
    public String getLabel() { return label; }
    public String getValue() { return value; }
}
