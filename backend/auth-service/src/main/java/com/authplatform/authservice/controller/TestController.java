package com.authplatform.authservice.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(value = "*")
public class TestController {

    @GetMapping("/public/hello")
    public String publicHello() {
        return "Public endpoint";
    }

    @GetMapping("/api/hello")
    public String privateHello() {
        return "Protected endpoint";
    }
}