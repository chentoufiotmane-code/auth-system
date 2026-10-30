package com.authplatform.authservice.filiere;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FiliereRepository extends JpaRepository<Filiere, Long> {

    List<Filiere> findByActiveTrueOrderByNameAsc();

    boolean existsByNameIgnoreCase(String name);
}
