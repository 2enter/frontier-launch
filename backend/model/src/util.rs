use http::StatusCode;
use regex::Regex;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Debug, Deserialize)]
pub struct IdOnly {
    pub id: String,
}

#[derive(Serialize, Debug)]
pub struct ApiResponse<T> {
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

    pub fn new_with_details(code: StatusCode, details: String, hint: Option<String>) -> Self {
        Self {
            code: code.as_u16(),
            message: gen_message(code),
            details: Some(details),
            hint,
        }
    }
}

impl<T> ApiResponse<T> {
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
