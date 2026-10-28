package com.authplatform.authservice.student;



import com.authplatform.authservice.exception.StudentProfileNotFoundException;
import com.authplatform.authservice.student.dto.StudentProfileRequest;
import com.authplatform.authservice.student.dto.StudentProfileResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.io.IOException;
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

    public void uploadDocument(String keycloakId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Please select a PDF file."
            );
        }

        if (file.getSize() > 2L * 1024 * 1024) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Maximum file size is 2 MB."
            );
        }

        String filename = file.getOriginalFilename();

        if (filename == null ||
                !filename.toLowerCase().endsWith(".pdf")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Only PDF files are allowed."
            );
        }

        try {
            byte[] data = file.getBytes();

            if (data.length < 5 ||
                    !new String(data, 0, 5,
                            java.nio.charset.StandardCharsets.US_ASCII)
                            .equals("%PDF-")) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Invalid PDF file."
                );
            }

            StudentProfile profile = repository
                    .findByKeycloakId(keycloakId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Student profile not found."
                    ));

            profile.setDocumentName(
                    java.nio.file.Paths.get(filename).getFileName().toString()
            );
            profile.setDocumentData(data);
            profile.setDocumentSize((long) data.length);

            repository.save(profile);

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Unable to read the PDF file."
            );
        }
    }

    public StudentProfile getDocumentByKeycloakId(String keycloakId) {
        StudentProfile profile = repository.findByKeycloakId(keycloakId)
                .orElseThrow(() ->
                        new RuntimeException("Student profile not found"));

        if (profile.getDocumentData() == null
                || profile.getDocumentData().length == 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No document uploaded"
            );
        }

        return profile;
    }
}