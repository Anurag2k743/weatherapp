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

  const HeroSection: React.FC<{ current: CurrentWeather; location: Location; onSearch: (loc: string) => void }> = ({ current, location, onSearch }) => {
    const [searchInput, setSearchInput] = useState(location.name);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(searchInput);
    };

    return (
      <div className="relative text-white bg-gradient-to-b from-[#0a0c2c] to-[#11143f] rounded-3xl py-16 px-6 shadow-xl ">
        <h2 className="text-3xl sm:text-5xl font-bold text-center">Discover the weather in every city you go</h2>

        <form onSubmit={handleSubmit} className="mt-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full py-3 pl-5 pr-10 rounded-full bg-white text-gray-700 text-lg shadow focus:outline-none"
              placeholder="Search for a city"
            />
            <button type="submit">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </button>
          </div>
        </form>

        <div className="flex justify-center gap-4 mt-10">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl w-32 h-44 text-center shadow-md">
            <p className="text-2xl font-semibold">{Math.round(current.temp_c - 4)}°</p>
            <img src={current.condition.icon} alt="weather" className="mx-auto" />
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl w-36 h-52 text-center shadow-lg scale-110">
            <p className="text-4xl font-bold">{Math.round(current.temp_c)}°</p>
            <p className="text-sm mt-1">{location.name}, {location.country}</p>
            <img src={current.condition.icon} alt="weather" className="mx-auto mt-2" />
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl w-32 h-44 text-center shadow-md">
            <p className="text-2xl font-semibold">{Math.round(current.temp_c + 3)}°</p>
            <img src={current.condition.icon} alt="weather" className="mx-auto" />
          </div>
        </div>
      </div>
    );
  };

  const DetailsCard: React.FC<{ current: CurrentWeather; astro: Astro }> = ({ current, astro }) => (
    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white flex items-center justify-around h-full">
      <div className="text-center space-y-4">
        <div className="flex items-center gap-3"><Droplet size={28} /><div><p className="text-sm">Humidity</p><p className="font-bold text-lg">{current.humidity}%</p></div></div>
        <div className="flex items-center gap-3"><Sun size={28} /><div><p className="text-sm">UV Index</p><p className="font-bold text-lg">{current.uv} of 10</p></div></div>
      </div>
      <div className="h-24 border-l border-white/30"></div>
      <div className="text-center space-y-4">
        <div className="flex items-center gap-3"><Sunset size={28} /><div><p className="text-sm">Sunset</p><p className="font-bold text-lg">{astro.sunset}</p></div></div>
        <div className="flex items-center gap-3"><Sunrise size={28} /><div><p className="text-sm">Sunrise</p><p className="font-bold text-lg">{astro.sunrise}</p></div></div>
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
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', hour12: true })}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval={2}
            />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} labelStyle={{ fontWeight: 'bold' }} />
            <Area type="monotone" dataKey="temp_c" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <hr className="my-6 border-gray-200" />
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2 text-center">
        {weekly.map((day) => (
          <div key={day.date} className="flex flex-col items-center p-3 bg-white/20 text-gray-800 rounded-lg hover:bg-gray-100 transition">
            <p className="text-xs font-semibold">{new Date(day.date).toLocaleDateString([], { weekday: 'short' }).toUpperCase()}</p>
            <img src={day.day.condition.icon} alt={day.day.condition.text} className="my-1" />
            <p className="font-bold">{Math.round(day.day.avgtemp_c)}°</p>
          </div>
        ))}
      </div>
    </div>
  );

  export default function Home() {
    const [location, setLocation] = useState<string>("Dharamshala Himachal Pradesh");
    const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const fetchWeather = async (loc: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=eb01aecc5f13404785f73316253107&q=${location}&days=7&aqi=no&alerts=no`);
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

    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans bg-gradient-to-br from-sky-100 to-blue-100">
        <div className="max-w-7xl mx-auto">
          <main>
            {loading && <div className="text-center p-10"><p className="text-gray-600">Loading weather data...</p></div>}
            {error && <div className="text-center p-10"><p className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</p></div>}

            {weather && (
              <>
                <HeroSection current={weather.current} location={weather.location} onSearch={fetchWeather} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <div className="col-span-1 space-y-6">
                    <DetailsCard current={weather.current} astro={weather.forecast.forecastday[0].astro} />
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
    );
  }
