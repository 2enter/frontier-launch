use crate::enums::CargoType;
use serde_json::json;
use uuid::Uuid;

pub struct WSMsg;

impl WSMsg {
    pub fn cargo(cargo_type: CargoType, id: Uuid, directory: String) -> String {
        let value = json!({
            "type": "cargo",
            "cargo_type": cargo_type,
            "id": id,
            "directory": directory,
        });

        serde_json::to_string(&value).unwrap()
    }

    pub fn launch(cargo_amount: usize) -> String {
        let value = json!({
            "type": "launch",
            "cargo_amount": cargo_amount,
        });

        serde_json::to_string(&value).unwrap()
    }

    pub fn weather(is_raining: bool) -> String {
        let value = json!({
            "type": "weather",
            "raining": is_raining,
        });

        serde_json::to_string(&value).unwrap()
    }

    pub fn population(amount: u32) -> String {
        let value = json!({
            "type": "population",
            "amount": amount,
        });

        serde_json::to_string(&value).unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::Value;

    #[test]
    fn cargo_msg() {
        let result = WSMsg::cargo(
            CargoType::Water,
            Uuid::parse_str("de426c3d-67b4-47c4-8648-8339b0f69c8f").unwrap(),
            "test".into(),
        );
        assert_eq!(
            serde_json::from_str::<Value>(&result).unwrap(),
            serde_json::from_str::<Value>(
                r#"{"type":"cargo","cargo_type":"water","id":"de426c3d-67b4-47c4-8648-8339b0f69c8f","directory":"test"}"#
            ).unwrap()
        );
    }
}
