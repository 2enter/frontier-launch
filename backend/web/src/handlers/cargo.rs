use crate::state::AppState;
use axum::extract::{Json, Multipart, State};
use model::cargo::*;
use model::util::ApiResponse;
use std::str;
use utils::texture::generate_texture;
use uuid::Uuid;

pub async fn get_cargo_ids(State(app_state): State<AppState>) -> Json<Vec<String>> {
    let result = Cargo::get_20(&app_state.pool).await;
    result
        .iter()
        .map(|c| c.id.to_string())
        .collect::<Vec<_>>()
        .into()
}

pub async fn send_cargo_metadata(
    State(app_state): State<AppState>,
    Json(input): Json<CargoInput>,
) -> Json<ApiResponse<Cargo>> {
    let result = Cargo::create(&app_state.pool, input).await;
    ApiResponse::new_success(result).into()
}

pub async fn send_cargo_image(mut multipart: Multipart) -> Json<ApiResponse<String>> {
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
            ApiResponse::new_success(id).into()
        }
        _ => ApiResponse::new_error("nope".to_string()).into(),
    }
}
