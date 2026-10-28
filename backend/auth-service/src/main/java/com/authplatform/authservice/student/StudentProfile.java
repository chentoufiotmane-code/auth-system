package com.authplatform.authservice.student;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "student_profiles",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_student_profile_keycloak_id",
                        columnNames = "keycloak_id"
                )
        }
)
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "keycloak_id", nullable = false, updatable = false)
    private String keycloakId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(length = 30)
    private String phone;

    private LocalDate dateOfBirth;

    @Column(length = 300)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "diploma_type", nullable = false, length = 20)
    private DiplomaType diplomaType;

    @Column(name = "diploma_name", length = 150)
    private String diplomaName;

    @Column(length = 200)
    private String institution;

    private Integer graduationYear;

    @Column(precision = 4, scale = 2)
    private BigDecimal firstYearGrade;

    @Column(precision = 4, scale = 2)
    private BigDecimal secondYearGrade;

    @Column(name = "document_name")
    private String documentName;

    @Column(name = "document_data", columnDefinition = "bytea")
    private byte[] documentData;

    @Column(name = "document_size")
    private Long documentSize;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public StudentProfile() {
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getKeycloakId() {
        return keycloakId;
    }

    public void setKeycloakId(String keycloakId) {
        this.keycloakId = keycloakId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public DiplomaType getDiplomaType() {
        return diplomaType;
    }

    public void setDiplomaType(DiplomaType diplomaType) {
        this.diplomaType = diplomaType;
    }

    public String getDiplomaName() {
        return diplomaName;
    }

    public void setDiplomaName(String diplomaName) {
        this.diplomaName = diplomaName;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public BigDecimal getFirstYearGrade() {
        return firstYearGrade;
    }

    public void setFirstYearGrade(BigDecimal firstYearGrade) {
        this.firstYearGrade = firstYearGrade;
    }

    public BigDecimal getSecondYearGrade() {
        return secondYearGrade;
    }

    public void setSecondYearGrade(BigDecimal secondYearGrade) {
        this.secondYearGrade = secondYearGrade;
    }

    public String getDocumentName() {
        return documentName;
    }

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }

    public byte[] getDocumentData() {
        return documentData;
    }

    public void setDocumentData(byte[] documentData) {
        this.documentData = documentData;
    }

    public Long getDocumentSize() {
        return documentSize;
    }

    public void setDocumentSize(Long documentSize) {
        this.documentSize = documentSize;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}