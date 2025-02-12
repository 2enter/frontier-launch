use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Serialize, Deserialize, Debug, sqlx::Type)]
#[serde(rename_all = "lowercase")]
#[sqlx(rename_all = "lowercase", type_name = "cargo_type")]
pub enum CargoType {
    Water,
    Spring,
    Stair,
    Star,
    Cake,
    Diamond,
}

impl From<&str> for CargoType {
    fn from(value: &str) -> CargoType {
        match value {
            "water" => CargoType::Water,
            "spring" => CargoType::Spring,
            "stair" => CargoType::Stair,
            "star" => CargoType::Star,
            "cake" => CargoType::Cake,
            "diamond" => CargoType::Diamond,
            _ => CargoType::Water,
        }
    }
}

#[typeshare]
#[derive(Serialize, Deserialize, Debug, sqlx::Type)]
#[serde(rename_all = "lowercase")]
#[sqlx(rename_all = "lowercase", type_name = "cargo_status")]
pub enum CargoStatus {
    Shipping,
    Delivered,
    Launched,
}
