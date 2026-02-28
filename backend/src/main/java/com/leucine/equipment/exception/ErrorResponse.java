package com.leucine.equipment.exception;

import java.time.ZonedDateTime;

public record ErrorResponse(int status, String message, ZonedDateTime timestamp) {
}
