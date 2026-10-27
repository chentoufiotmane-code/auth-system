package com.authplatform.authservice.student;



import com.authplatform.authservice.exception.StudentProfileNotFoundException;
import com.authplatform.authservice.student.dto.StudentProfileRequest;
import com.authplatform.authservice.student.dto.StudentProfileResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.CONFLICT;

@Service
@Transactional
public class StudentProfileService {

    private final StudentProfileRepository repository;
    private final StudentProfileMapper mapper;

    public StudentProfileService(
            StudentProfileRepository repository,
            StudentProfileMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getMyProfile(String keycloakId) {
        StudentProfile profile = repository.findByKeycloakId(keycloakId)
                .orElseThrow(
                        () -> new StudentProfileNotFoundException(keycloakId)
                );

        return mapper.toResponse(profile);
    }

    public StudentProfileResponse createMyProfile(
            String keycloakId,
            StudentProfileRequest request) {

        if (repository.existsByKeycloakId(keycloakId)) {
            throw new ResponseStatusException(
                    CONFLICT,
                    "A profile already exists for this account."
            );
        }

        StudentProfile profile = new StudentProfile();
        profile.setKeycloakId(keycloakId);

        mapper.updateEntity(profile, request);

        StudentProfile saved = repository.save(profile);

        return mapper.toResponse(saved);
    }

    public StudentProfileResponse updateMyProfile(
            String keycloakId,
            StudentProfileRequest request) {

        StudentProfile profile = repository.findByKeycloakId(keycloakId)
                .orElseThrow(
                        () -> new StudentProfileNotFoundException(keycloakId)
                );

        mapper.updateEntity(profile, request);

        StudentProfile saved = repository.save(profile);

        return mapper.toResponse(saved);
    }
}