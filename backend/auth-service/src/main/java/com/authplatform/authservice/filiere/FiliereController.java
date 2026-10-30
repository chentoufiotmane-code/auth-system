package com.authplatform.authservice.filiere;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filieres")
public class FiliereController {

    private final FiliereService filiereService;

    public FiliereController(FiliereService filiereService) {
        this.filiereService = filiereService;
    }

    @GetMapping
    public List<FiliereResponse> getActiveFilieres() {
        return filiereService.getActiveFilieres();
    }

    @GetMapping("/{id}")
    public FiliereResponse getFiliereById(@PathVariable Long id) {
        return filiereService.getFiliereById(id);
    }
}
