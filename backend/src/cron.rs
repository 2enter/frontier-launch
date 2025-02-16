use crate::state::AppState;
use crate::weather::is_raining;
use crate::webdriver::get_webdriver;
use crate::ws_broadcast;
use model::cargo::Cargo;
use model::news::News;
use model::ws_msg::*;
use tokio_cron_scheduler::{Job, JobScheduler, JobSchedulerError};
use tracing::info;
use utils::db::db_backup;
use utils::runtime::rand_sleep;

pub async fn init(app_state: AppState) -> Result<(), JobSchedulerError> {
    let send_weather = Job::new_async("every 5 minutes", {
        let app_state = app_state.clone();
        move |_, _| {
            let sender = app_state.ws_sender.clone();
            Box::pin(async move {
                rand_sleep(30000).await;
                info!("Sending weather");
                let raining = is_raining().await.unwrap_or(false);
                let msg = WSMsg::weather(raining);
                ws_broadcast(msg, &sender);
            })
        }
    })?;

    let launch_rocket = Job::new_async("every 10 minutes", {
        let app_state = app_state.clone();
        move |_, _| {
            let sender = app_state.ws_sender.clone();
            let pool = app_state.pool.clone();
            Box::pin(async move {
                info!("Launching rocket");
                let amount = Cargo::launch(&pool).await;
                let msg = WSMsg::launch(amount);
                ws_broadcast(msg, &sender);
            })
        }
    })?;

    let ship_cargoes = Job::new_async("every 60 seconds", {
        let app_state = app_state.clone();
        move |_, _| {
            let pool = app_state.pool.clone();
            Box::pin(async move {
                info!("Delivering cargoes");
                Cargo::deliver(&pool).await;
            })
        }
    })?;

    let fetch_remote_news = Job::new_async("every 4 hours", {
        let app_state = app_state.clone();

        move |_, _| {
            let pool = app_state.pool.clone();
            Box::pin(async move {
                let webdriver = get_webdriver(app_state.config.wd_port).await;
                rand_sleep(3000).await;
                info!("Fetching remote news");
                if let Ok(driver) = webdriver {
                    if News::fetch_remote(&pool, &driver).await.is_err() {
                        println!("Failed to fetch remote news");
                    };
                    if driver.quit().await.is_err() {};
                } else {
                    println!("Failed to get webdriver");
                }
            })
        }
    })?;

    let backup_database = Job::new_async("every 8 hours", {
        let app_state = app_state.clone();
        move |_, _| {
            let pool = app_state.pool.clone();
            Box::pin(async move {
                info!("Backing up database");
                if let Err(error) = db_backup(&pool, vec!["news", "cargo"], "../db/backups").await {
                    println!("Failed to backup database: {error}");
                }
            })
        }
    })?;

    // create scheduler
    let sched = JobScheduler::new().await?;

    // add jobs to scheduler
    sched.add(send_weather).await?;
    sched.add(launch_rocket).await?;
    sched.add(ship_cargoes).await?;
    sched.add(fetch_remote_news).await?;
    sched.add(backup_database).await?;

    // start scheduler
    sched.start().await?;
    Ok(())
}
