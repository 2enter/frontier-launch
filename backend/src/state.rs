use crate::config::Config;
use sqlx::PgPool;
use tokio::sync::broadcast;

#[allow(dead_code)]
#[derive(Clone, Debug)]
pub struct AppState {
    pub pool: PgPool,
    pub config: Config,
    pub ws_sender: broadcast::Sender<String>,
}

impl AppState {
    pub fn new(pool: PgPool, config: Config) -> Self {
        Self {
            pool,
            config,
            ws_sender: broadcast::channel(100).0,
        }
    }
}
