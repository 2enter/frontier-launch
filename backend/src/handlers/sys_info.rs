use axum::Json;
use model::util::ApiResponse;
use sysinfo::System;

pub async fn get_temperature() -> Json<ApiResponse<String>> {
    let mut sys = System::new_all();

    sys.refresh_all();
    sys.refresh_cpu_usage();

    let total = sys.total_memory();
    let used = sys.used_memory();
    let load = sys.global_cpu_usage();

    let temp = (used as f32 * load) / (total as f32 * 10.0);

    ApiResponse::new_success(format!("{:.1}", temp)).into()
}
