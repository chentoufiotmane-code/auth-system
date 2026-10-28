package com.authplatform.authservice.student;


import com.authplatform.authservice.student.dto.StudentProfileRequest;
import com.authplatform.authservice.student.dto.StudentProfileResponse;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/student/profile")
public class StudentProfileController {

    private final StudentProfileService service;

    public StudentProfileController(StudentProfileService service) {
        this.service = service;
    }

    @GetMapping
    public StudentProfileResponse getMyProfile(
            @AuthenticationPrincipal Jwt jwt) {

        return service.getMyProfile(jwt.getSubject());
    }

    @PostMapping
    public ResponseEntity<StudentProfileResponse> createMyProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody StudentProfileRequest request) {

        StudentProfileResponse response =
                service.createMyProfile(jwt.getSubject(), request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping
    public StudentProfileResponse updateMyProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody StudentProfileRequest request) {

        return service.updateMyProfile(jwt.getSubject(), request);
    }

    @PostMapping("/document")
    public ResponseEntity<Void> uploadDocument(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") MultipartFile file) {

        service.uploadDocument(jwt.getSubject(), file);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/document")
    public ResponseEntity<byte[]> getDocument(
            @AuthenticationPrincipal Jwt jwt) {

        StudentProfile profile =
                service.getDocumentByKeycloakId(jwt.getSubject());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline()
                                .filename("student-document.pdf")
                                .build()
                                .toString()
                )
                .body(profile.getDocumentData());
    }
}