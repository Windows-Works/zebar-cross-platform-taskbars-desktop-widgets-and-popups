use serde::Deserialize;

use crate::impl_interval_config;

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WeatherProviderConfig {
  pub refresh_interval: u64,
  pub latitude: f32,
  pub longitude: f32,
}

impl_interval_config!(WeatherProviderConfig);
