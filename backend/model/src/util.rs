use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Debug, Deserialize)]
pub struct IdOnly {
    pub id: String,
}
