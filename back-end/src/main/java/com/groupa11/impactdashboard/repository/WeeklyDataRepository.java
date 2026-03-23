package com.groupa11.impactdashboard.repository;

import com.groupa11.impactdashboard.model.WeeklyData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeeklyDataRepository extends JpaRepository<WeeklyData, Long> {
}
