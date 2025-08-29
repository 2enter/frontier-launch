use crate::config::Config;
use crate::handlers::ws::ws_broadcast;
use crate::state::AppState;
use axum::extract::{Json, State};
use axum_typed_multipart::BaseMultipart;
use model::cargo::*;
use model::util::{ApiError, ApiResponse};
use model::ws_msg::WSMsg;
use utils::texture::generate_texture;

pub async fn get_cargoes(State(app_state): State<AppState>) -> Json<ApiResponse<Vec<Cargo>>> {
    ApiResponse::new_success(Cargo::get_20(&app_state.pool).await).into()
}

pub async fn get_today_cargoes(State(app_state): State<AppState>) -> Json<ApiResponse<Vec<Cargo>>> {
    ApiResponse::new_success(Cargo::get_today(&app_state.pool).await).into()
}

pub async fn send_cargo(
    State(app_state): State<AppState>,
    data: BaseMultipart<CargoRequest, ApiError>,
) -> Json<ApiResponse<Cargo>> {
    let CargoRequest {
        paint_time,
        cargo_type,
        file,
    } = data.data;

    let cargo = Cargo::create(
        &app_state.pool,
        CargoInput {
            paint_time,
            r#type: cargo_type.clone(),
        },
    )
    .await;

    let id = &cargo.id.to_string();

    let path = format!("{}/backend/db/storage", app_state.config.root_dir);
    generate_texture(id, &file, &path);

    let Config { host, port, .. } = app_state.config;

    ws_broadcast(
        WSMsg::cargo(
            cargo_type,
            id,
            &format!("https://{host}:{port}/api/storage/texture/{id}.jpg"),
        ),
        &app_state.ws_sender.clone(),
    );

    ApiResponse::new_success(cargo).into()
}
