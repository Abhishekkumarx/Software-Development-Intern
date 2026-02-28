package com.leucine.equipment.controller;

import com.leucine.equipment.dto.EquipmentRequest;
import com.leucine.equipment.dto.EquipmentResponse;
import com.leucine.equipment.dto.EquipmentTypeResponse;
import com.leucine.equipment.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<com.leucine.equipment.dto.PaginatedResponse<EquipmentResponse>> getAllEquipment(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(equipmentService.getAllEquipment(status, search, page, size));
    }

    @GetMapping("/types")
    public ResponseEntity<List<EquipmentTypeResponse>> getAllEquipmentTypes() {
        return ResponseEntity.ok(equipmentService.getAllEquipmentTypes());
    }

    @GetMapping("/metrics")
    public ResponseEntity<java.util.Map<String, Long>> getMetrics() {
        return ResponseEntity.ok(equipmentService.getEquipmentMetrics());
    }

    @PostMapping
    public ResponseEntity<EquipmentResponse> createEquipment(@Valid @RequestBody EquipmentRequest request) {
        return new ResponseEntity<>(equipmentService.createEquipment(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipmentResponse> updateEquipment(@PathVariable Long id, @Valid @RequestBody EquipmentRequest request) {
        return ResponseEntity.ok(equipmentService.updateEquipment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }
}
