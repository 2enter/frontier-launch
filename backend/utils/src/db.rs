use futures::stream::TryStreamExt;
use sqlx::postgres::PgPoolCopyExt;
use sqlx::types::chrono;
use sqlx::PgPool;
use std::error::Error;
use tokio::io::AsyncWriteExt;

pub async fn db_backup(pool: &PgPool) -> Result<(), Box<dyn Error>> {
    let now = chrono::Utc::now().format("%Y-%m-%d_%H-%M-%S").to_string();

    for table in ["cargo", "news"] {
        let query = format!("COPY (SELECT * from {table}) TO STDOUT WITH CSV HEADER DELIMITER ','");

        tokio::fs::create_dir_all(format!("../db/backups/{now}")).await?;

        let mut file = tokio::fs::File::create(format!("../db/backups/{now}/{table}.csv")).await?;

        let mut result = pool.copy_out_raw(&query).await?;

        while let Some(chunk) = result.try_next().await? {
            file.write_all(&chunk).await?;
        }
    }

    println!("{now} ==> database backup complete");
    Ok(())
}
