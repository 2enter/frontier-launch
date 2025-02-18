use crate::state::AppState;
use axum::extract::State;
use axum::Json;
use model::news::News;
use model::util::ApiResponse;

pub async fn get_news(State(app_state): State<AppState>) -> Json<ApiResponse<Vec<String>>> {
    ApiResponse::new_success(News::get_10(&app_state.pool).await).into()
}
