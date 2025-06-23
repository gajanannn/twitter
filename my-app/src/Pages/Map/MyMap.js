import React from "react";
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../pages.css";

const containerStyle = {
  width: "100%",
  height: "100%",
};

async function weather(location) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=96f3f19d93434dcae6dc663f7ec8db88`
  );
  const data = await response.json();
  return data;
}

function MyMap() {
  const [location, setLocation] = useState(null);
  const [data, setdata] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(loc);
        setLocation(loc);
        weather(loc).then((data) => {
          console.log("Weather Data:", data);
          setdata(data);
        });
      },
      (error) => {
        console.error("Error getting location", error);
        setLocation({ lat: 19.076, lng: 72.8777 });
      }
    );
  }, []);

  return (
    <div className="fullscreen-map">
      <LoadScript googleMapsApiKey="AIzaSyCLJ-ZdDXhFFKQftEToIma3TsJfXdcbbMw">
        {location && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={10}
          >
            <Marker position={location} />
          </GoogleMap>
        )}
      </LoadScript>

      {data && (
        <div className="weather-tile">
          <h3>{data.weather[0].main}</h3>
          <p>{data.weather[0].description}</p>
          <p>Temp: {Math.round(data.main.temp - 273.15)}°C</p>
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}
    </div>
  );
}
export default MyMap;
