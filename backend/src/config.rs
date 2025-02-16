use project_root::get_project_root;

#[derive(Clone, Debug)]
pub struct Config {
    pub database_url: String,
    pub wd_port: u16,
    pub port: u16,
    pub host: String,
    pub root_dir: String,
}

impl Config {
    pub fn init() -> Self {
        let database_url = dotenvy::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let wd_port = dotenvy::var("WD_PORT").unwrap_or("4000".to_string());
        let port = dotenvy::var("PORT").unwrap_or("3000".to_string());
        let host = dotenvy::var("HOST").unwrap_or("0.0.0.0".to_string());
        let root_dir = get_project_root().unwrap().to_str().unwrap().to_string();

        println!("configuration initialized: {host}:{port}, db: {database_url}, wd: {wd_port}, root: {root_dir}");

        Self {
            database_url,
            port: port.parse().unwrap_or(3000),
            wd_port: wd_port.parse().unwrap_or(4000),
            host,
            root_dir,
        }
    }
}
