use axum::response::{IntoResponse, Response};
use axum::Json;
use axum_typed_multipart::TypedMultipartError;
use http::StatusCode;
use regex::Regex;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Debug, Deserialize)]
pub struct IdOnly {
    pub id: String,
}

#[derive(Serialize, Debug)]
pub struct ApiResponse<T>
where
    T: Serialize,
{
    data: Option<T>,
    error: Option<ApiError>,
}

#[derive(Serialize, Debug)]
pub struct ApiError {
    pub code: u16,
    pub message: String,
    pub details: Option<String>,
    pub hint: Option<String>,
}

fn gen_message(code: StatusCode) -> String {
    Regex::new(r"\d+")
        .unwrap()
        .replace_all(code.to_string().to_uppercase().as_str(), "")
        .trim()
        .replace(" ", "_")
        .to_string()
}

impl ApiError {
    pub fn new(code: StatusCode) -> Self {
        Self {
            code: code.as_u16(),
            message: gen_message(code),
            details: None,
            hint: None,
        }
    }

    pub fn from_u16(code_number: u16) -> Self {
        let code = StatusCode::from_u16(code_number).unwrap();
        Self::new(code)
    }

    pub fn new_with_details(code: StatusCode, details: String, hint: Option<String>) -> Self {
        Self {
            code: code.as_u16(),
            message: gen_message(code),
            details: Some(details),
            hint,
        }
    }
}

impl<T> ApiResponse<T>
where
    T: Serialize,
{
    pub fn new_success(data: T) -> Self {
        Self {
            data: Some(data),
            error: None,
        }
    }

    pub fn new_error(code: StatusCode) -> Self {
        Self {
            data: None,
            error: Some(ApiError::new(code)),
        }
    }

    pub fn new_error_with_details(code: StatusCode, details: String, hint: Option<String>) -> Self {
        Self {
            data: None,
            error: Some(ApiError::new_with_details(code, details, hint)),
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let status_code = StatusCode::from_u16(self.code).unwrap();
        Json(ApiResponse::<String>::new_error(status_code)).into_response()
    }
}

impl From<TypedMultipartError> for ApiError {
    fn from(err: TypedMultipartError) -> Self {
        ApiError::new_with_details(StatusCode::BAD_REQUEST, err.to_string(), None)
    }
}

impl<T> IntoResponse for ApiResponse<T>
where
    T: Serialize,
{
    fn into_response(self) -> Response {
        Json(self).into_response()
    }
}
