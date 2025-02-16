# Stage 1: Build the application
FROM rust:1.84-slim AS builder
WORKDIR /app
COPY . .
RUN --mount=target=/var/lib/apt/lists,type=cache,sharing=locked \
    --mount=target=/var/cache/apt,type=cache,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean \
    && apt-get update \
    && apt-get install -y libssl-dev build-essential pkg-config

RUN --mount=type=bind,source=src,target=src \
    --mount=type=bind,source=Cargo.toml,target=Cargo.toml \
    --mount=type=bind,source=Cargo.lock,target=Cargo.lock \
    --mount=type=cache,target=/app/target/ \
    --mount=type=cache,target=/usr/local/cargo/registry/ \
    <<EOF
set -e
cargo build --release
cp ./target/release/backend /bin/backend
EOF

# Stage 2: Create a minimal runtime image
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /bin/backend ./bin/backend
RUN mkdir /app/backend/db/storage/texture -p
RUN mkdir /app/backend/db/storage/paint -p
EXPOSE 3000
RUN chmod +x ./bin/backend
CMD ["./bin/backend"]