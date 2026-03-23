package com.groupa11.impactdashboard.repository;

import com.groupa11.impactdashboard.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByCategory(String category);
    List<Food> findByIsVeg(boolean isVeg);
    List<Food> findByCategoryAndIsVeg(String category, boolean isVeg);
    List<Food> findByNameContainingIgnoreCase(String name);

    @Query("SELECT DISTINCT f.category FROM Food f")
    List<String> findDistinctCategories();
}
