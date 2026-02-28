package com.leucine.equipment.service;

import com.leucine.equipment.dto.*;
import com.leucine.equipment.exception.*;
import com.leucine.equipment.model.*;
import com.leucine.equipment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceLogService {
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final EquipmentRepository equipmentRepository;

    @Transactional(readOnly = true)
    public List<MaintenanceLogResponse> getLogsByEquipmentId(Long equipmentId) {
        return maintenanceLogRepository.findByEquipmentIdOrderByMaintenanceDateDesc(equipmentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MaintenanceLogResponse createMaintenanceLog(MaintenanceLogRequest request) {
        Equipment equipment = equipmentRepository.findById(request.equipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found"));
                
        // BUSINESS RULE: Updating maintenance log sets equipment status to Active and updates lastCleanedDate
        equipment.setStatus("Active");
        equipment.setLastCleanedDate(request.maintenanceDate());
        equipmentRepository.save(equipment);
        
        MaintenanceLog log = new MaintenanceLog();
        log.setEquipment(equipment);
        log.setMaintenanceDate(request.maintenanceDate());
        log.setNotes(request.notes());
        log.setPerformedBy(request.performedBy());
        
        return mapToResponse(maintenanceLogRepository.save(log));
    }
    
    private MaintenanceLogResponse mapToResponse(MaintenanceLog log) {
        return new MaintenanceLogResponse(
                log.getId(),
                log.getEquipment().getId(),
                log.getMaintenanceDate(),
                log.getNotes(),
                log.getPerformedBy()
        );
    }
}
