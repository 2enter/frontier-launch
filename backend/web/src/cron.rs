use crate::state::AppState;
use crate::weather::is_raining;
use crate::webdriver::get_webdriver;
use crate::ws_broadcast;
use model::cargo::Cargo;
use model::news::News;
use model::ws_msg::*;
use tokio_cron_scheduler::{Job, JobScheduler, JobSchedulerError};

pub async fn run(app_state: AppState) -> Result<(), JobSchedulerError> {
    let sched = JobScheduler::new().await?;

    // send weather message
    let send_weather = Job::new_async("every 10 minutes", {
        let app_state = app_state.clone();
        move |_, _| {
            let sender = app_state.ws_sender.clone();
            Box::pin(async move {
                let raining = is_raining().await.unwrap_or(false);
                let msg = WSMsg::weather(raining);
                ws_broadcast(msg, &sender);
            })
        }
    })?;

    // send launch message
    let launch_rocket = Job::new_async("every 10 minutes", {
        let app_state = app_state.clone();
        move |_, _| {
            let sender = app_state.ws_sender.clone();
            let pool = app_state.pool.clone();
            println!("{} Launching rocket", chrono::Local::now());
            Box::pin(async move {
                let amount = Cargo::launch(&pool).await;
                let msg = WSMsg::launch(amount);
                ws_broadcast(msg, &sender);
            })
        }
    })?;

    // ship unshipped cargoes
    let ship_cargoes = Job::new_async("every 60 seconds", {
        let app_state = app_state.clone();
        move |_, _| {
            let pool = app_state.pool.clone();
            Box::pin(async move {
                Cargo::deliver(&pool).await;
            })
        }
    })?;

    // fetch remote news
    let fetch_remote_news = Job::new_async("every 60 minutes", {
        let app_state = app_state.clone();

        move |_, _| {
            let pool = app_state.pool.clone();
            Box::pin(async move {
                let webdriver = get_webdriver(app_state.config.wd_port).await;
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

    // add jobs to scheduler
    sched.add(send_weather).await?;
    sched.add(launch_rocket).await?;
    sched.add(ship_cargoes).await?;
    sched.add(fetch_remote_news).await?;

    // start scheduler
    sched.start().await?;
    Ok(())
}
