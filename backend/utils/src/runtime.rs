use async_std::task::sleep;
use std::time::Duration;

pub async fn rand_sleep(max_ms: u32) {
    sleep(Duration::from_millis(
        (rand::random::<f32>() * max_ms as f32) as u64,
    ))
    .await;
}
