package com.groupa11.impactdashboard.repository;

import com.groupa11.impactdashboard.model.EmittedData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmittedDataRepository extends JpaRepository<EmittedData, Long> {
}
