"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { CurrentWeather, Location, ForecastDay } from "./types";

interface HeroProps {
    onSearch: (loc: string) => void;
    location?: Location;
    current?: CurrentWeather;
    forecast?: ForecastDay[];
}

const bgImages = [
    "/weather1.jpeg",
    "/weather2.jpeg",
    "/weather3.jpeg",
    "/weather3.jpeg",
   
];

const Hero: React.FC<HeroProps> = ({ onSearch, location, current, forecast = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [input, setInput] = useState(location?.name || "");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input.trim());
            setInput(""); // ✅ Clear input field after search
        }
    };

    return (
        <div
            className="w-full relative min-h-screen overflow-y-auto flex flex-col justify-center items-center text-center bg-center bg-cover transition-all duration-1000"
            style={{ backgroundImage: `url(${bgImages[currentIndex]})` }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-40 z-10 transition-all duration-500" />
            <div className="w-full z-20 px-4 py-12 sm:py-20">
                <h1 className="text-white text-3xl sm:text-6xl font-bold mb-12 sm:mb-16 w-full md:max-w-3xl mx-auto">
                    Discover the Weather in every city you go
                </h1>

                <form onSubmit={handleSearch} className="max-w-lg mx-auto relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="py-3 pl-6 pr-12 w-full rounded-full bg-white text-black outline-none shadow-md text-sm sm:text-base"
                        placeholder="Search for a City"
                    />
                    <button type="submit">
                        <Search
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={22}
                        />
                    </button>
                </form>

                {current && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full max-w-6xl mx-auto px-4">

                        {/* Card 1 - Weather Summary */}
                        <div className="bg-white/10 backdrop-blur-md shadow-lg border border-white/20 rounded-xl text-white p-6">
                            <div className="flex justify-between flex-wrap gap-y-4">
                                <div>
                                    <p>💧 Humidity</p>
                                    <h2 className="text-xl font-semibold">{current.humidity}%</h2>
                                </div>
                                <div>
                                    <p>🌇 Sunset</p>
                                    <h2 className="text-xl font-semibold">{location?.localtime.split(" ")[1]}</h2>
                                </div>
                                <div>
                                    <p>🌞 UV Index</p>
                                    <h2 className="text-xl font-semibold">{current.uv} of 10</h2>
                                </div>
                                <div>
                                    <p>🌅 Sunrise</p>
                                    <h2 className="text-xl font-semibold">--:-- AM</h2>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 - Live Weather Report */}
                        <div className="bg-white/10 backdrop-blur-md shadow-lg border border-white/20 rounded-xl text-white p-6 flex flex-col items-center justify-center text-center">
                            <p className="text-sm">{location?.name}, {location?.country}</p>
                            <h1 className="text-4xl sm:text-5xl font-bold mt-2">{Math.round(current.temp_c)}°C</h1>
                            <img
                                src={current.condition.icon}
                                alt={current.condition.text}
                                className="w-20 h-20 mx-auto my-2"
                            />
                            <p className="text-lg font-medium">{current.condition.text}</p>
                        </div>

                        {/* Card 3 - Weekly Forecast */}
                        <div className="bg-white/10 backdrop-blur-md shadow-lg border border-white/20 rounded-xl text-white p-6">
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 text-center text-sm">
                                {forecast.map((f) => (
                                    <div key={f.date} className="flex flex-col items-center">
                                        <span>{new Date(f.date).toLocaleDateString("en-US", { weekday: "short" })}</span>
                                        <img src={f.day.condition.icon} alt={f.day.condition.text} className="w-8 h-8" />
                                        <span>{Math.round(f.day.avgtemp_c)}°</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Hero;
