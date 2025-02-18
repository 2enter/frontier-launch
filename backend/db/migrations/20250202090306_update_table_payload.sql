-- migrate:up
ALTER TABLE IF EXISTS payload
    ALTER COLUMN status SET DEFAULT 'shipping';

-- migrate:down
ALTER TABLE IF EXISTS payload
    ALTER COLUMN status DROP DEFAULT;

