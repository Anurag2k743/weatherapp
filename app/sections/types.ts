export interface Condition {
  text: string;
  icon: string;
  code: number;
}

export interface CurrentWeather {
  temp_c: number;
  condition: Condition;
  wind_kph: number;
  humidity: number;
  uv: number;
}

export interface Location {
  name: string;
  region: string;
  country: string;
  localtime: string;
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    condition: Condition;
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
  hour: {
    time: string;
    temp_c: number;
    condition: Condition;
  }[];
}

export interface WeatherApiResponse {
  location: Location;
  current: CurrentWeather;
  forecast: {
    forecastday: ForecastDay[];
  };
}
