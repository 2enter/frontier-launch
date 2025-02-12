use axum::extract::Path;
use axum::response::Redirect;

pub async fn news(Path(num): Path<String>) -> Redirect {
    Redirect::permanent(format!("/render/news/{}", num).as_str())
}

pub async fn app() -> Redirect {
    Redirect::permanent("/app")
}

pub async fn cctv() -> Redirect {
    Redirect::permanent("/render/cctv")
}
