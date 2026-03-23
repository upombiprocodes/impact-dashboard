package com.groupa11.impactdashboard.repository;

import com.groupa11.impactdashboard.model.SavedItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedItemRepository extends JpaRepository<SavedItem, Long> {
}
