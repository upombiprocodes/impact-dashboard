package com.groupa11.impactdashboard.repository;

import com.groupa11.impactdashboard.model.MonthlyGoal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonthlyGoalRepository extends JpaRepository<MonthlyGoal, Long> {
}
