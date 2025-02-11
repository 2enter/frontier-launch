use crate::state::AppState;
use axum::extract::{Json, Multipart, State};
use axum::response::IntoResponse;
use image::{GenericImageView, ImageBuffer, ImageFormat, Rgb};
use model::cargo::*;
use serde_json::{json, Value};
use sqlx::query_as;
use std::str;
use uuid::Uuid;

const BG_COLOR: Rgb<u8> = Rgb([200, 138, 200]);

pub async fn get_cargo_ids(State(app_state): State<AppState>) -> Json<Vec<String>> {
    let result = Cargo::get_20(&app_state.pool).await;
    Json(result.iter().map(|c| c.id.to_string()).collect())
}

pub async fn send_cargo_metadata(
    State(app_state): State<AppState>,
    Json(input): Json<CargoInput>,
) -> impl IntoResponse {
    let CargoInput { r#type, paint_time } = input;
    let result: Cargo =
        query_as("INSERT INTO cargo (type, paint_time) VALUES ($1, $2) RETURNING *;")
            .bind(r#type)
            .bind(paint_time)
            .fetch_one(&app_state.pool)
            .await
            .unwrap();
    let response = serde_json::to_value(&result).unwrap();
    Json(response)
}

pub async fn send_cargo_image(mut multipart: Multipart) -> impl IntoResponse {
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
            let mut img = image::load_from_memory(&bytes).unwrap();

            img.save(format!("../db/storage/paint/{id}.png")).unwrap();

            let (w, h) = img.dimensions();
            img = img.crop(0, (h - w) / 2, w, w);

            let mut bg = ImageBuffer::from_pixel(w, w, BG_COLOR);

            let img = img.to_rgba8();

            for y in 0..w {
                for x in 0..w {
                    let pixel = img.get_pixel(x, y);
                    let bg_pixel = bg.get_pixel_mut(x, y);

                    let alpha = pixel[3] as f32 / 255.0;
                    for i in 0..3 {
                        bg_pixel[i] =
                            ((1.0 - alpha) * bg_pixel[i] as f32 + alpha * pixel[i] as f32) as u8;
                    }
                }
            }

            bg.save_with_format(format!("../db/storage/texture/{id}.jpg"), ImageFormat::Jpeg)
                .expect("Failed to save texture image");

            Json(json!({"status": "ok"}))
        }
        _ => Json(json!({"status": "error"})),
    }
}
