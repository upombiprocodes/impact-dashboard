package com.groupa11.impactdashboard.repository;

import com.groupa11.impactdashboard.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUserIdOrderByIdDesc(Long userId);
    List<ActivityLog> findByUserId(Long userId);
}
