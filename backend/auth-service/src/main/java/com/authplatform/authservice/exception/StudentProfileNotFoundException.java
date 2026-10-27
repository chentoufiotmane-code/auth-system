package com.authplatform.authservice.exception;


public class StudentProfileNotFoundException
        extends RuntimeException {

    public StudentProfileNotFoundException(String keycloakId) {
        super("Student profile not found for authenticated user.");
    }
}