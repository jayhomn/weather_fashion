import React, { useState, useEffect } from "react";
import "./App.css";
import { Animated } from "react-animated-css";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import dotenv from "dotenv";

function App() {
  const [location, setLocation] = useState("");
  const [searched, setSearched] = useState(false);
  const [temperature, setTemperature] = useState();
  const [weatherIcon, setWeatherIcon] = useState();
  const [images, setImages] = useState([]);
  const [offset, setOffset] = useState(11);
  const [weatherAfterSearch, setWeatherAfterSearch] = useState("");
  dotenv.config();

  const handleSearch = () => {
    setSearched(true);
    axios(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.weatherApi}`
    )
      .then(function (response) {
        let temp = response.data["main"]["feels_like"];
        let weather = "";
        if (temp > 17) {
          weather = "Summer";
        } else if (temp < 17 && temp > 12) {
          weather = "Fall";
        } else {
          weather = "Winter";
        }
        setWeatherAfterSearch(weather);
        setTemperature(temp);
        setWeatherIcon(
          `https://openweathermap.org/img/wn/${response.data["weather"][0]["icon"]}@2x.png`
        );
        axios(
          `https://www.googleapis.com/customsearch/v1?q=${weather}+outfit+men&num=10&searchType=image&key=${process.env.googleApi}&cx=${process.env.customSearch}`
        )
          .then(function (response) {
            let imageResults = response.data["items"];
            let contextLinks = imageResults.map((currentValue) => {
              return <img src={currentValue["link"]} alt="clothing" />;
            });
            setImages(contextLinks);
          })
          .catch(function (error) {
            alert(error);
          });
      })
      .catch(function (error) {
        alert(error);
      });
  };

  const fetchMoreData = () => {
    axios(
      `https://www.googleapis.com/customsearch/v1?q=${weatherAfterSearch}+outfit+men&num=10&searchType=image&start=${offset}&key=${process.env.googleApi}&cx=${process.env.customSearch}`
    )
      .then(function (response) {
        let imageResults = response.data["items"];
        let contextLinks = imageResults.map((currentValue) => {
          return <img src={currentValue["link"]} alt="clothing" />;
        });
        setImages(images.concat(contextLinks));
        setOffset(offset + 10);
      })
      .catch(function (error) {
        alert(error);
      });
  };

  useEffect(() => {
    let input = document.getElementById("pac-input");

    input.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("submit-btn").click();
      }
    });
  }, []);

  return (
    <div className="main-canvas">
      {!searched && (
        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={!searched}
        >
          <div id="main-div" className="main-div">
            <h1>Enter Your Location</h1>
            <input
              id="pac-input"
              className="search-bar"
              type="text"
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
              }}
            />
            <input
              id="submit-btn"
              className="submit-btn"
              type="button"
              onClick={handleSearch}
            />
          </div>
        </Animated>
      )}
      {searched && (
        <Animated>
          <div className="parent-main-div-searched">
            <div className="main-div-searched">
              <img
                className="weather-icon"
                src={weatherIcon}
                alt="Weather icon"
              />
              <h2>{temperature + "°C"}</h2>
              <input
                id="pac-input"
                className="search-bar-searched"
                type="text"
                placeholder="Enter Your Location"
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                }}
              />
              <input
                id="submit-btn"
                className="submit-btn"
                type="button"
                onClick={handleSearch}
              />
            </div>
            <div className="image-gallery">
              <InfiniteScroll
                dataLength={images.length}
                next={fetchMoreData}
                hasMore={true}
                loader={<h4>Loading...</h4>}
              >
                {images}
              </InfiniteScroll>
            </div>
          </div>
        </Animated>
      )}
    </div>
  );
}

export default App;
