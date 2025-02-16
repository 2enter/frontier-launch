use std::env;

pub fn get_env(key: &str) -> String {
    env::var(key).unwrap_or_else(|e| {
        dotenvy::var(key).expect(format!("Error while finding env var `{key}`: {:?}", e).as_str())
    })
}
