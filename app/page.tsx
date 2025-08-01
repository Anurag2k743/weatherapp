"use client";
import React, { useEffect, useState } from "react";
import { WeatherApiResponse, Location, CurrentWeather, ForecastDay } from './sections/types';
import Hero from "./sections/Hero";

const API_KEY = "eb01aecc5f13404785f73316253107";

export default function HomePage() {
    const [location, setLocation] = useState<Location | undefined>();
    const [current, setCurrent] = useState<CurrentWeather | undefined>();
    const [forecast, setForecast] = useState<ForecastDay[]>([]);

    const fetchWeather = async (loc: string) => {
        try {
            const res = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${loc}&days=7&aqi=no&alerts=no`
            );
            const data = await res.json();
            setLocation(data.location);
            setCurrent(data.current);
            setForecast(data.forecast.forecastday);
        } catch (error) {
            console.error("Failed to fetch weather:", error);
        }
    };

    useEffect(() => {
        fetchWeather("Shahpur"); 
    }, []);

    return (
        <Hero
            onSearch={fetchWeather}
            location={location}
            current={current}
            forecast={forecast}
        />
    );
}


