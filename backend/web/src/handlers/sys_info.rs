use sysinfo::System;

pub async fn get_temperature() -> String {
    let mut sys = System::new_all();

    sys.refresh_all();
    sys.refresh_cpu_usage();

    let total = sys.total_memory();
    let used = sys.used_memory();
    let load = sys.global_cpu_usage();

    let temp = (used as f32 * load) / (total as f32 * 10.0);
    format!("{:.1}", temp)
}
