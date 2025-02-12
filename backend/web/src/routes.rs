use crate::handlers::cargo::*;
use crate::handlers::news::get_news;
use crate::handlers::redirect;
use crate::handlers::sys_info::get_temperature;
use crate::handlers::ws::ws_handler;
use crate::state::AppState;
use axum::routing::{any, get, post};
use axum::Router;
use tower_http::services::ServeDir;
use tower_http::trace::TraceLayer;

pub fn get_routes(state: AppState) -> Router {
    Router::new()
        .nest(
            "/api",
            Router::new()
                .nest(
                    "/cargo",
                    Router::new()
                        .route("/metadata", post(send_cargo_metadata).get(get_cargo_ids))
                        .route("/image", post(send_cargo_image)),
                )
                .route("/news", get(get_news))
                .route("/sys-temp", get(get_temperature))
                .route("/render/news/{num}", get(redirect::news))
                .route("/render/cctv", get(redirect::cctv))
                .nest_service(
                    "/storage",
                    ServeDir::new(format!("{}/../db/storage", state.config.root_dir)),
                ),
        )
        .route("/ws", any(ws_handler))
        .layer(TraceLayer::new_for_http())
        .route("/zh_tw", get(redirect::app))
        .route("/zh-tw", get(redirect::app))
        .fallback_service(ServeDir::new(format!(
            "{}/../../frontend/build",
            state.config.root_dir
        )))
        .with_state(state)
}
