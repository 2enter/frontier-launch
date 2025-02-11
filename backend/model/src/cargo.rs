use crate::enums::{CargoStatus, CargoType};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool, Postgres};
use typeshare::typeshare;
use uuid::Uuid;

#[typeshare]
#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Cargo {
    pub id: Uuid,
    pub created_at: DateTime<Utc>,
    pub paint_time: i32,
    pub r#type: CargoType,
    pub status: CargoStatus,
}

#[typeshare]
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CargoInput {
    pub paint_time: f32,
    pub r#type: CargoType,
}

impl Cargo {
    pub async fn get_20(pool: &PgPool) -> Vec<Self> {
        sqlx::query_as("SELECT * FROM cargo ORDER BY created_at DESC LIMIT 20")
            .fetch_all(pool)
            .await
            .unwrap()
    }

    pub async fn get_unshipped(pool: &PgPool) -> Vec<Self> {
        sqlx::query_as("SELECT id, created_at FROM cargo WHERE status = 'shipping'")
            .fetch_all(pool)
            .await
            .unwrap_or_default()
    }

    pub async fn deliver(pool: &PgPool) -> Vec<Self> {
        let target_time = Utc::now() - chrono::Duration::seconds(60);
        sqlx::query_as(
            r#"UPDATE cargo SET status = 'delivered' WHERE status = 'shipping' and created_at < $1 RETURNING id;"#
        )
            .bind(target_time).fetch_all(pool).await.unwrap_or_default()
    }

    pub async fn launch(pool: &PgPool) -> usize {
        sqlx::query_as::<Postgres, Self>(
            "UPDATE cargo SET status = 'launched' WHERE status = 'delivered' RETURNING id;",
        )
        .fetch_all(pool)
        .await
        .unwrap_or_default()
        .len()
    }
}
