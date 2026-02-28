package com.leucine.equipment.dto;

import java.time.ZonedDateTime;

public record EquipmentResponse(
        Long id,
        String name,
        EquipmentTypeResponse type,
        String status,
        ZonedDateTime lastCleanedDate
) {}
