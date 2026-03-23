package com.groupa11.impactdashboard.repository;

import com.groupa11.impactdashboard.model.StreakDay;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StreakDayRepository extends JpaRepository<StreakDay, Long> {
    List<StreakDay> findAllByOrderByDayIndexAsc();
}
