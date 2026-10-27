package com.authplatform.authservice.student;


import com.authplatform.authservice.student.dto.StudentProfileRequest;
import com.authplatform.authservice.student.dto.StudentProfileResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

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
}