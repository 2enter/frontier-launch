-- migrate:up
ALTER TABLE IF EXISTS payload
    RENAME TO cargo;

ALTER TYPE payload_status RENAME TO cargo_status;
ALTER TYPE payload_type RENAME TO cargo_type;

-- migrate:down
ALTER TABLE IF EXISTS cargo
    RENAME TO payload;

ALTER TYPE cargo_status RENAME TO payload_status;
ALTER TYPE cargo_type RENAME TO payload_type;
