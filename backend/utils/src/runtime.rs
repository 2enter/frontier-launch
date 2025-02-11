use async_std::task::sleep;
use std::time::Duration;

pub async fn rand_sleep(max: u32) {
    sleep(Duration::from_millis(
        (rand::random::<f32>() * max as f32) as u64,
    ))
    .await;
}
