-- migrate:up
CREATE TABLE IF NOT EXISTS news
(
    id         uuid PRIMARY KEY     DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    title      TEXT        NOT NULL,
    hype       INT         NOT NULL DEFAULT 0
);

-- migrate:down
DROP TABLE IF EXISTS news;
