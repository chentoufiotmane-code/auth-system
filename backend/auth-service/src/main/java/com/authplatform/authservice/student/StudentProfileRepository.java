package com.authplatform.authservice.student;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentProfileRepository
        extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByKeycloakId(String keycloakId);

    boolean existsByKeycloakId(String keycloakId);
}