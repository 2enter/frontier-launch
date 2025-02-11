-- migrate:up
ALTER TABLE news
    ADD COLUMN updated_at timestamptz NOT NULL DEFAULT NOW();

-- migrate:down
ALTER TABLE news
    DROP COLUMN updated_at;

