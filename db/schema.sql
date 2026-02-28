CREATE TABLE equipment_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_id INTEGER NOT NULL REFERENCES equipment_types(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Under Maintenance')),
    last_cleaned_date TIMESTAMP WITH TIME ZONE
);

CREATE TABLE maintenance_logs (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    maintenance_date TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    performed_by VARCHAR(255) NOT NULL
);
