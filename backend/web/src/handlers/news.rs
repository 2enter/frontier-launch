use crate::state::AppState;
use axum::extract::State;
use axum::Json;
use model::news::News;

pub async fn get_news(State(app_state): State<AppState>) -> Json<Vec<String>> {
    Json(News::get_10(&app_state.pool).await)
}
