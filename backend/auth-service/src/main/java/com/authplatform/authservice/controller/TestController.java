package com.authplatform.authservice.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/public")
    public String publicHello() {
        return "Public endpoint";
    }

    @GetMapping("/admin")
    public String privateHello() {
        return "Protected endpoint";
    }
}