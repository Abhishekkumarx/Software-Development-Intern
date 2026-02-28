package com.leucine.equipment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.ZonedDateTime;

public record EquipmentRequest(
        @NotBlank(message = "Name cannot be empty")
        String name,
        
        @NotNull(message = "Equipment type is required")
        Long typeId,
        
        @NotBlank(message = "Status cannot be empty")
        String status,
        
        ZonedDateTime lastCleanedDate
) {}
