use crate::config::Config;
use axum_server::tls_rustls::RustlsConfig;
use std::path::PathBuf;

pub fn init() {
    rustls::crypto::ring::default_provider()
        .install_default()
        .expect("no crypto provider");
}

pub async fn get_config(config: &Config) -> RustlsConfig {
    RustlsConfig::from_pem_file(
        PathBuf::from(&config.root_dir)
            .join("backend")
            .join("cert")
            .join("cert.pem"),
        PathBuf::from(&config.root_dir)
            .join("backend")
            .join("cert")
            .join("key.pem"),
    )
    .await
    .unwrap()
}
