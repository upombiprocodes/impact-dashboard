package com.groupa11.impactdashboard.repository;

import com.groupa11.impactdashboard.model.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findByCategory(String category);
    List<Challenge> findByDifficulty(String difficulty);
}
