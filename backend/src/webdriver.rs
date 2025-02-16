use thirtyfour::prelude::*;

pub async fn get_webdriver(port: u16) -> Result<WebDriver, WebDriverError> {
    let mut caps = DesiredCapabilities::chrome();
    caps.add_arg("--headless")?;
    WebDriver::new(format!("http://localhost:{port}"), caps).await
}
