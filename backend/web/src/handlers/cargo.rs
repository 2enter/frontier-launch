use crate::handlers::ws::ws_broadcast;
use crate::state::AppState;
use axum::extract::{Json, Multipart, State};
use axum::http::StatusCode;
use model::cargo::*;
use model::enums::CargoType;
use model::util::ApiResponse;
use model::ws_msg::WSMsg;
use std::str;
use utils::texture::generate_texture;
use uuid::Uuid;

pub async fn get_cargoes(State(app_state): State<AppState>) -> Json<ApiResponse<Vec<Cargo>>> {
    ApiResponse::new_success(Cargo::get_20(&app_state.pool).await).into()
}

pub async fn get_today_cargoes(State(app_state): State<AppState>) -> Json<ApiResponse<Vec<Cargo>>> {
    ApiResponse::new_success(Cargo::get_today(&app_state.pool).await).into()
}

pub async fn send_cargo_metadata(
    State(app_state): State<AppState>,
    Json(input): Json<CargoInput>,
) -> Json<ApiResponse<Cargo>> {
    let result = Cargo::create(&app_state.pool, input).await;
    ApiResponse::new_success(result).into()
}

pub async fn send_cargo_image(
    State(app_state): State<AppState>,
    mut multipart: Multipart,
) -> Json<ApiResponse<String>> {
    let mut id = None;
    let mut cargo_type: Option<CargoType> = None;
    let mut bytes = None;

    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();
        let data = field.bytes().await.unwrap();

        if name == "id" {
            let id_str = str::from_utf8(data.as_ref()).unwrap();
            if Uuid::parse_str(id_str).is_ok() {
                id = Some(id_str.to_string());
            }
        } else if name == "file" {
            bytes = Some(data);
        } else if name == "type" {
            cargo_type = Some(str::from_utf8(data.as_ref()).unwrap().into())
        }
    }

    match (id, bytes, cargo_type) {
        (Some(id), Some(bytes), Some(cargo_type)) => {
            generate_texture(&id, &bytes);
            ws_broadcast(
                WSMsg::cargo(cargo_type, id.clone()),
                &app_state.ws_sender.clone(),
            );
            ApiResponse::new_success(id).into()
        }
        _ => ApiResponse::new_error(StatusCode::BAD_REQUEST).into(),
    }
}
