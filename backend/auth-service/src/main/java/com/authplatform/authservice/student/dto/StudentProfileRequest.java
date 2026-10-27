package com.authplatform.authservice.student.dto;

import com.authplatform.authservice.student.DiplomaType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record StudentProfileRequest(

        @NotBlank
        @Size(max = 100)
        String firstName,

        @NotBlank
        @Size(max = 100)
        String lastName,

        @NotBlank
        @Email
        @Size(max = 150)
        String email,

        @Size(max = 30)
        String phone,

        @Past
        LocalDate dateOfBirth,

        @Size(max = 300)
        String address,

        @NotNull
        DiplomaType diplomaType,

        @Size(max = 150)
        String diplomaName,

        @Size(max = 200)
        String institution,

        @Min(1950)
        @Max(2100)
        Integer graduationYear,

        @DecimalMin("0.00")
        @DecimalMax("20.00")
        BigDecimal firstYearGrade,

        @DecimalMin("0.00")
        @DecimalMax("20.00")
        BigDecimal secondYearGrade

) {}