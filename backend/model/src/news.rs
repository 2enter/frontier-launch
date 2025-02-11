use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

#[derive(Debug, Serialize, FromRow)]
pub struct News {
    id: Uuid,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
    hype: i32,
    title: String,
}

impl News {
    pub async fn get_10(pool: &PgPool) -> Vec<String> {
        let mut news: Vec<Self> =
            sqlx::query_as("SELECT title, hype from news ORDER BY created_at DESC LIMIT 20")
                .fetch_all(pool)
                .await
                .unwrap_or_default();

        if news.is_empty() {
            return vec![];
        }

        // sort news by hype
        news.sort_by(|a, b| b.hype.cmp(&a.hype));
        news.truncate(10);
        news.iter().map(|n| n.title.clone()).collect()
    }
}
