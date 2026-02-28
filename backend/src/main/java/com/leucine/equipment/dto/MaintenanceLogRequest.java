package com.leucine.equipment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.ZonedDateTime;

public record MaintenanceLogRequest(
        @NotNull(message = "Equipment ID is required")
        Long equipmentId,
        
        @NotNull(message = "Maintenance date is required")
        ZonedDateTime maintenanceDate,
        
        String notes,
        
        @NotBlank(message = "Performed by is required")
        String performedBy
) {}
