package com.leucine.equipment.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.ZonedDateTime;

@Entity
@Table(name = "maintenance_logs")
@Getter
@Setter
public class MaintenanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column(name = "maintenance_date", nullable = false)
    private ZonedDateTime maintenanceDate;

    @Column
    private String notes;

    @Column(name = "performed_by", nullable = false)
    private String performedBy;
}
