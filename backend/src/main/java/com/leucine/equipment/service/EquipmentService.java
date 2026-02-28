package com.leucine.equipment.service;

import com.leucine.equipment.dto.*;
import com.leucine.equipment.exception.*;
import com.leucine.equipment.model.*;
import com.leucine.equipment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipmentService {
    private final EquipmentRepository equipmentRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;

    @Transactional(readOnly = true)
    public PaginatedResponse<EquipmentResponse> getAllEquipment(String status, String search, int page, int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by("id").descending());
        org.springframework.data.domain.Page<Equipment> equipmentPage = equipmentRepository.findByStatusAndSearch(status, search, pageable);
        List<EquipmentResponse> content = equipmentPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
        return new PaginatedResponse<>(
                content,
                equipmentPage.getNumber(),
                equipmentPage.getSize(),
                equipmentPage.getTotalElements(),
                equipmentPage.getTotalPages(),
                equipmentPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public List<EquipmentTypeResponse> getAllEquipmentTypes() {
        return equipmentTypeRepository.findAll().stream()
                .map(t -> new EquipmentTypeResponse(t.getId(), t.getName()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getEquipmentMetrics() {
        Map<String, Long> metrics = new HashMap<>();
        metrics.put("total", equipmentRepository.count());
        metrics.put("active", equipmentRepository.countByStatus("Active"));
        metrics.put("inactive", equipmentRepository.countByStatus("Inactive"));
        metrics.put("maintenance", equipmentRepository.countByStatus("Under Maintenance"));
        return metrics;
    }

    @Transactional
    public EquipmentResponse createEquipment(EquipmentRequest request) {
        ZonedDateTime effectiveCleanDate = request.lastCleanedDate();
        // If a user adds a brand new equipment as Active, assume it is newly acquired/clean
        if ("Active".equalsIgnoreCase(request.status()) && effectiveCleanDate == null) {
            effectiveCleanDate = ZonedDateTime.now();
        }
        
        validateStatusRule(request.status(), effectiveCleanDate);
        
        EquipmentType type = equipmentTypeRepository.findById(request.typeId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment Type not found"));
                
        Equipment equipment = new Equipment();
        equipment.setName(request.name());
        equipment.setType(type);
        equipment.setStatus(request.status());
        equipment.setLastCleanedDate(effectiveCleanDate);
        
        return mapToResponse(equipmentRepository.save(equipment));
    }

    @Transactional
    public EquipmentResponse updateEquipment(Long id, EquipmentRequest request) {
        ZonedDateTime effectiveCleanDate = request.lastCleanedDate();
        if ("Active".equalsIgnoreCase(request.status()) && effectiveCleanDate == null) {
            effectiveCleanDate = ZonedDateTime.now();
        }
        
        validateStatusRule(request.status(), effectiveCleanDate);
        
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found"));
                
        EquipmentType type = equipmentTypeRepository.findById(request.typeId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment Type not found"));
                
        equipment.setName(request.name());
        equipment.setType(type);
        equipment.setStatus(request.status());
        equipment.setLastCleanedDate(effectiveCleanDate);
        
        return mapToResponse(equipmentRepository.save(equipment));
    }

    @Transactional
    public void deleteEquipment(Long id) {
        if (!equipmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Equipment not found");
        }
        equipmentRepository.deleteById(id);
    }
    
    private void validateStatusRule(String status, ZonedDateTime lastCleanedDate) {
        if ("Active".equalsIgnoreCase(status)) {
            if (lastCleanedDate == null) {
                throw new InvalidEquipmentStatusException("Equipment cannot be marked Active if it has never been cleaned.");
            }
            if (lastCleanedDate.isBefore(ZonedDateTime.now().minus(30, ChronoUnit.DAYS))) {
                throw new InvalidEquipmentStatusException("Equipment cannot be marked Active if last cleaned date is older than 30 days.");
            }
        }
    }

    private EquipmentResponse mapToResponse(Equipment equipment) {
        return new EquipmentResponse(
                equipment.getId(),
                equipment.getName(),
                new EquipmentTypeResponse(equipment.getType().getId(), equipment.getType().getName()),
                equipment.getStatus(),
                equipment.getLastCleanedDate()
        );
    }
}
