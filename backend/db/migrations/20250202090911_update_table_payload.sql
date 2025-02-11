-- migrate:up
ALTER TABLE payload
    ALTER COLUMN paint_time TYPE INTEGER;

-- migrate:down
ALTER TABLE payload
    ALTER COLUMN paint_time TYPE NUMERIC;

