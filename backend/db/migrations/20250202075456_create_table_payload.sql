-- migrate:up
CREATE TYPE payload_status AS ENUM ('shipping', 'shipped', 'launched');
CREATE TYPE payload_type AS ENUM ('water', 'spring', 'stair', 'star', 'cake', 'diamond');

CREATE TABLE IF NOT EXISTS payload
(
    id         uuid PRIMARY KEY        DEFAULT gen_random_uuid(),
    created_at timestamptz    NOT NULL DEFAULT NOW(),
    paint_time NUMERIC        NOT NULL,
    type       payload_type   NOT NULL,
    status     payload_status NOT NULL
);


-- migrate:down
DROP TABLE IF EXISTS payload;
DROP TYPE IF EXISTS payload_status;