package com.groupa11.impactdashboard.repository;

import com.groupa11.impactdashboard.model.ChallengeCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChallengeCompletionRepository extends JpaRepository<ChallengeCompletion, Long> {
    List<ChallengeCompletion> findByUserId(Long userId);
    List<ChallengeCompletion> findByUserIdOrderByCompletedAtDesc(Long userId);
}
