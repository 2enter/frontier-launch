use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Debug, Deserialize)]
pub struct IdOnly {
    pub id: String,
}

#[typeshare]
#[derive(Serialize, Debug)]
pub struct ApiResponse<T> {
    data: Option<T>,
    error: Option<String>,
}

impl<T> ApiResponse<T> {
    pub fn new_success(data: T) -> Self {
        Self {
            data: Some(data),
            error: None,
        }
    }

    pub fn new_error(error: String) -> Self {
        Self {
            data: None,
            error: Some(error),
        }
    }
}
