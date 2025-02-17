-- migrate:up
ALTER TABLE IF EXISTS news
    ADD COLUMN updated_at timestamptz NOT NULL DEFAULT NOW();

-- migrate:down
ALTER TABLE IF EXISTS news
    DROP COLUMN updated_at;

