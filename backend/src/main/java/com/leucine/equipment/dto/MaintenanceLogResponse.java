package com.leucine.equipment.dto;

import java.time.ZonedDateTime;

public record MaintenanceLogResponse(
        Long id,
        Long equipmentId,
        ZonedDateTime maintenanceDate,
        String notes,
        String performedBy
) {}
