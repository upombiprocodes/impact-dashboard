package com.groupa11.impactdashboard.repository;

import com.groupa11.impactdashboard.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Optional<Badge> findByName(String name);
}
