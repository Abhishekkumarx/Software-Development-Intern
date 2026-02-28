package com.leucine.equipment.controller;

import com.leucine.equipment.dto.MaintenanceLogRequest;
import com.leucine.equipment.dto.MaintenanceLogResponse;
import com.leucine.equipment.service.MaintenanceLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MaintenanceLogController {

    private final MaintenanceLogService maintenanceLogService;

    @GetMapping("/equipment/{equipmentId}/maintenance")
    public ResponseEntity<List<MaintenanceLogResponse>> getLogsByEquipmentId(@PathVariable Long equipmentId) {
        return ResponseEntity.ok(maintenanceLogService.getLogsByEquipmentId(equipmentId));
    }

    @PostMapping("/maintenance")
    public ResponseEntity<MaintenanceLogResponse> createMaintenanceLog(@Valid @RequestBody MaintenanceLogRequest request) {
        return new ResponseEntity<>(maintenanceLogService.createMaintenanceLog(request), HttpStatus.CREATED);
    }
}
