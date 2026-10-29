package com.authplatform.authservice.student.dto;

import com.authplatform.authservice.student.DiplomaType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record StudentProfileResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        LocalDate dateOfBirth,
        String address,
        DiplomaType diplomaType,
        String diplomaName,
        String institution,
        Integer graduationYear,
        BigDecimal firstYearGrade,
        BigDecimal secondYearGrade,
        String documentName,
        byte[] documentData,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}