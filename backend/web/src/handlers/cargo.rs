use crate::state::AppState;
use axum::extract::{Json, Multipart, State};
use axum::response::IntoResponse;
use model::cargo::*;
use reqwest::StatusCode;
use std::str;
use utils::texture::generate_texture;
use uuid::Uuid;

pub async fn get_cargo_ids(State(app_state): State<AppState>) -> Json<Vec<String>> {
    let result = Cargo::get_20(&app_state.pool).await;
    Json(result.iter().map(|c| c.id.to_string()).collect())
}

pub async fn send_cargo_metadata(
    State(app_state): State<AppState>,
    Json(input): Json<CargoInput>,
) -> impl IntoResponse {
    let result = Cargo::create(&app_state.pool, input).await;
    let response = serde_json::to_value(&result).unwrap();
    Json(response)
}

pub async fn send_cargo_image(mut multipart: Multipart) -> Result<String, StatusCode> {
    let mut id = None;
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
        }
    }

    match (id, bytes) {
        (Some(id), Some(bytes)) => {
            generate_texture(&id, &bytes);
            Ok(id)
        }
        _ => Err(StatusCode::BAD_REQUEST),
    }
}
