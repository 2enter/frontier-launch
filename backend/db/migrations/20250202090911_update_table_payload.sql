-- migrate:up
ALTER TABLE IF EXISTS payload
    ALTER COLUMN paint_time TYPE INTEGER;

-- migrate:down
ALTER TABLE IF EXISTS payload
    ALTER COLUMN paint_time TYPE NUMERIC;

