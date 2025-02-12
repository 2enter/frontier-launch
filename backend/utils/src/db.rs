use futures::stream::TryStreamExt;
use sqlx::postgres::PgPoolCopyExt;
use sqlx::types::chrono;
use sqlx::PgPool;
use std::error::Error;
use std::path::Path;
use tokio::io::AsyncWriteExt;

pub async fn db_backup(pool: &PgPool, tables: Vec<&str>, path: &str) -> Result<(), Box<dyn Error>> {
    let now = chrono::Utc::now().format("%Y-%m-%d_%H-%M-%S").to_string();

    for table in tables {
        let query = format!("COPY (SELECT * from {table}) TO STDOUT WITH CSV HEADER DELIMITER ','");
        let dir = Path::new(path).join(&now);

        tokio::fs::create_dir_all(&dir).await?;

        let mut file = tokio::fs::File::create(&dir.join(format!("{table}.csv"))).await?;

        let mut result = pool.copy_out_raw(&query).await?;

        while let Some(chunk) = result.try_next().await? {
            file.write_all(&chunk).await?;
        }
    }

    println!("{now} ==> database backup complete");
    Ok(())
}
