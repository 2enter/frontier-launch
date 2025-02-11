-- migrate:up
ALTER TYPE payload_status RENAME VALUE 'shipped' TO 'delivered';

-- migrate:down
ALTER TYPE payload_status RENAME VALUE 'delivered' TO 'shipped';
