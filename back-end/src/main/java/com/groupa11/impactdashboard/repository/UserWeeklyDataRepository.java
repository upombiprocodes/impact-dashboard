package com.groupa11.impactdashboard.repository;

import com.groupa11.impactdashboard.model.UserWeeklyData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserWeeklyDataRepository extends JpaRepository<UserWeeklyData, Long> {
    List<UserWeeklyData> findByUserIdOrderByIdAsc(Long userId);
}
