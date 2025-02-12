use crate::routes::get_routes;
use sqlx::postgres::PgPoolOptions;
use tokio::net::TcpListener;

mod config;
mod cron;
mod handlers;
mod routes;
mod state;
mod weather;
mod webdriver;

use crate::handlers::ws::ws_broadcast;
use config::Config;
use state::AppState;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();

    let config = Config::init();

    let pool = PgPoolOptions::new().connect(&config.database_url).await?;
    let addr = format!("{}:{}", &config.host, &config.port);

    let listener = TcpListener::bind(&addr).await?;
    let app_state = AppState::new(pool, config);

    let app = get_routes(app_state.clone());

    cron::init(app_state.clone()).await?;
    axum::serve(listener, app.into_make_service()).await?;

    Ok(())
}
