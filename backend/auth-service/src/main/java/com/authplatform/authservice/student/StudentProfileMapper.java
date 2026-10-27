package com.authplatform.authservice.student;

import com.authplatform.authservice.student.dto.StudentProfileRequest;

import com.authplatform.authservice.student.dto.StudentProfileResponse;
import org.springframework.stereotype.Component;

@Component
public class StudentProfileMapper {

    public void updateEntity(
            StudentProfile profile,
            StudentProfileRequest request) {

        profile.setFirstName(request.firstName());
        profile.setLastName(request.lastName());
        profile.setEmail(request.email());
        profile.setPhone(request.phone());
        profile.setDateOfBirth(request.dateOfBirth());
        profile.setAddress(request.address());

        profile.setDiplomaType(request.diplomaType());
        profile.setDiplomaName(request.diplomaName());
        profile.setInstitution(request.institution());
        profile.setGraduationYear(request.graduationYear());

        profile.setFirstYearGrade(request.firstYearGrade());
        profile.setSecondYearGrade(request.secondYearGrade());
    }

    public StudentProfileResponse toResponse(StudentProfile profile) {
        return new StudentProfileResponse(
                profile.getId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getEmail(),
                profile.getPhone(),
                profile.getDateOfBirth(),
                profile.getAddress(),
                profile.getDiplomaType(),
                profile.getDiplomaName(),
                profile.getInstitution(),
                profile.getGraduationYear(),
                profile.getFirstYearGrade(),
                profile.getSecondYearGrade(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}