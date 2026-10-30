package com.authplatform.authservice.filiere;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class FiliereService {

    private final FiliereRepository filiereRepository;

    public FiliereService(FiliereRepository filiereRepository) {
        this.filiereRepository = filiereRepository;
    }

    public List<FiliereResponse> getActiveFilieres() {
        return filiereRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public FiliereResponse getFiliereById(Long id) {
        Filiere filiere = filiereRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Filière introuvable : " + id
                        ));

        return toResponse(filiere);
    }

    private FiliereResponse toResponse(Filiere filiere) {
        return new FiliereResponse(
                filiere.getId(),
                filiere.getName(),
                filiere.getDescription()
        );
    }
}
