package com.groupa11.impactdashboard.repository;

import com.groupa11.impactdashboard.model.Contribution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContributionRepository extends JpaRepository<Contribution, Long> {
}
