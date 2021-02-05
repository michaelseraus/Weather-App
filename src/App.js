import React, { useState } from "react";

const api = {
  key: "1a6a35714d0d0ae08e2bd4e60a11f3ca",
  base: "https://api.openweathermap.org"
};

function App() {
  // States
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [background, setBackground] = useState("");

  // Fetch
  async function fetchWeatherAndPictures() {
    const [weatherResponse, picturesResponse] = await Promise.all([
      fetch(`${api.base}/data/2.5/weather?q=${query}&APPID=${api.key}&units=metric`),
      fetch(`https://api.pexels.com/v1/search?query=${query}`, {
        headers: {
          Authorization: "563492ad6f9170000100000150e3a52d7c3b4d6481cca8a46f7f3ee8 "
        }
      })
    ]);
    const weatherData = await weatherResponse.json();
    const picturesData = await picturesResponse.json();

    return {
      weatherData,
      picturesData
    };
  }

  // Handler
  const searchHandler = (evt) => {
    if (evt.key === "Enter") {
      fetchWeatherAndPictures().then(({ weatherData, picturesData }) => {
        setWeather(weatherData);
        setBackground(picturesData.photos[0].src.large);
        setQuery("");
      });
    }
  };

  const dateHandler = (d) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    const day = days[d.getDay() - 1];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      <input
        type="text"
        className="search-bar"
        placeholder="Search..."
        onChange={(event) => setQuery(event.target.value)}
        onKeyPress={searchHandler}
        value={query}
      />
      {typeof weather.main != "undefined" ? (
        <>
          <div className="location">
            <div className="place">
              {weather.name}, {weather.sys.country}
            </div>
            <div className="date">{dateHandler(new Date())}</div>
          </div>

          <div className="weatherInfo">
            <div className="temp">{Math.round(weather.main.temp)}°</div>
            <div className="weather">{weather.weather[0].main}</div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
