
"use client";

import React, { useEffect, useState } from "react";
import { Droplet, Sun, Sunrise, Sunset, Search, Menu } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';


interface Condition {
  text: string;
  icon: string;
  code: number;
}

interface CurrentWeather {
  temp_c: number;
  condition: Condition;
  wind_kph: number;
  humidity: number;
  uv: number;
}

interface Location {
  name: string;
  region: string;
  country: string;
  localtime: string;
}

interface Astro {
  sunrise: string;
  sunset: string;
}

interface Day {
  avgtemp_c: number;
  condition: Condition;
}

interface Hour {
  time_epoch: number;
  time: string;
  temp_c: number;
  condition: Condition;
}

interface ForecastDay {
  date: string;
  day: Day;
  astro: Astro;
  hour: Hour[];
}

interface WeatherApiResponse {
  location: Location;
  current: CurrentWeather;
  forecast: {
    forecastday: ForecastDay[];
  };
}



const HeroCard: React.FC<{ current: CurrentWeather; location: Location }> = ({ current, location }) => (

  <div className="relative w-full p-6 sm:p-8 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg text-white">
    <div className="absolute inset-0 opacity-30">
      <div className="absolute bottom-0 left-0 w-full h-3/4 bg-blue-800/50 rounded-t-full -translate-x-1/4 translate-y-1/4"></div>
      <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-cyan-700/50 rounded-t-full translate-x-1/4 translate-y-1/4"></div>
    </div>
    <div className="absolute top-10 right-20 w-24 h-24 bg-white/20 rounded-full"></div>

    <div className="relative z-10 flex flex-wrap justify-between items-start gap-4">
      <div>
        <img src={current.condition.icon.replace('64x64', '128x128')} alt={current.condition.text} className="-ml-4 w-32 h-32" />
        <p className="text-7xl font-bold -mt-4">{Math.round(current.temp_c)}°</p>
        <p className="text-xl">{location.name}, {location.country}</p>
      </div>
      <div className="text-right mt-2">
        <p className="text-5xl font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
        <p className="text-lg">{current.condition.text}, {new Date().toLocaleDateString([], { weekday: 'long' })}</p>
      </div>
    </div>
  </div>
);

const DetailsCard: React.FC<{ current: CurrentWeather; astro: Astro }> = ({ current, astro }) => (

  <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-around h-full">
    <div className="text-center space-y-4">
      <div className="flex items-center gap-3"><Droplet className="text-blue-500" size={28} /><div><p className="text-gray-500 text-sm">Humidity</p><p className="font-bold text-lg">{current.humidity}%</p></div></div>
      <div className="flex items-center gap-3"><Sun className="text-yellow-500" size={28} /><div><p className="text-gray-500 text-sm">UV Index</p><p className="font-bold text-lg">{current.uv} of 10</p></div></div>
    </div>
    <div className="h-24 border-l border-gray-200"></div>
    <div className="text-center space-y-4">
      <div className="flex items-center gap-3"><Sunset className="text-orange-500" size={28} /><div><p className="text-gray-500 text-sm">Sunset</p><p className="font-bold text-lg">{astro.sunset}</p></div></div>
      <div className="flex items-center gap-3"><Sunrise className="text-amber-500" size={28} /><div><p className="text-gray-500 text-sm">Sunrise</p><p className="font-bold text-lg">{astro.sunrise}</p></div></div>
    </div>
  </div>

);

const ForecastCard: React.FC<{ hourly: Hour[]; weekly: ForecastDay[] }> = ({ hourly, weekly }) => (

  <div className="bg-white p-6 rounded-2xl shadow-md col-span-1 lg:col-span-2">
    <div className="flex gap-6 text-gray-500 mb-4">
      <button className="font-bold text-blue-500 border-b-2 border-blue-500 pb-1">Temperature</button>
      <button className="hover:text-blue-500">Precipitation</button>
      <button className="hover:text-blue-500">Wind</button>
    </div>
    <div style={{ width: '100%', height: 150 }}>
      <ResponsiveContainer>
        <AreaChart data={hourly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs><linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} /></linearGradient></defs>
          <XAxis dataKey="time" tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', hour12: true })} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} interval={2} />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} labelStyle={{ fontWeight: 'bold' }} />
          <Area type="monotone" dataKey="temp_c" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <hr className="my-6 border-gray-200" />
    <div className="grid grid-cols-4 md:grid-cols-7 gap-2 text-center">
      {weekly.map((day) => (
        <div key={day.date} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <p className="text-sm font-semibold text-gray-600">{new Date(day.date).toLocaleDateString([], { weekday: 'short' }).toUpperCase()}</p>
          <img src={day.day.condition.icon} alt={day.day.condition.text} className="my-1" />
          <p className="font-bold">{Math.round(day.day.avgtemp_c)}°</p>
        </div>
      ))}
    </div>
  </div>
);




export default function Home() {
  const [location, setLocation] = useState<string>("Dharmshala Himachal Pradesh");
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchWeather = async (loc: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=eb01aecc5f13404785f73316253107&q=${loc}&days=7&aqi=no&alerts=no`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error.message || "Location not found");
      }
      const data: WeatherApiResponse = await res.json();
      setWeather(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchWeather(location);
  }

  return (
    <>
      <header className="flex flex-wrap justify-between items-center mb-8 gap-4 fixed top-0 z-50 p-4 bg-white w-full shadow">
        <h1 className="text-3xl font-bold text-blue-600">Weather Update</h1>
        <form onSubmit={handleSearch} className="flex items-center gap-4">
          <div className="relative">
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter city name" className="bg-white rounded-lg pl-10 pr-4 py-2 w-48 sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button type="submit" className="p-2 bg-white rounded-lg shadow-sm lg:hidden"><Menu size={24} className="text-gray-700" /></button>
        </form>
      </header>

      

      <div className=" min-h-screen p-4 sm:p-6 lg:p-8 font-sans mt-20">
        <div className="max-w-7xl mx-auto">
          <main>
            {loading && <div className="text-center p-10"><p className="text-gray-600">Loading weather data...</p></div>}
            {error && <div className="text-center p-10"><p className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</p></div>}

            {weather && ( // This check is now perfectly type-safe
              <>
                <HeroCard current={weather.current} location={weather.location} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <div className="col-span-1 space-y-6">
                    <DetailsCard current={weather.current} astro={weather.forecast.forecastday[0].astro} />
                    {/* <MonthlyRainfallCard /> */}
                  </div>
                  <div className="lg:col-span-2">
                    <ForecastCard hourly={weather.forecast.forecastday[0].hour} weekly={weather.forecast.forecastday} />
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

    </>
  );
}