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
  const [menChoice, setMenChoice] = useState("choice");
  const [womenChoice, setWomenChoice] = useState("");
  dotenv.config();

  const toggleGenderChoice = () => {
    if (menChoice === "choice") {
      setMenChoice("");
      setWomenChoice("choice");
    } else {
      setMenChoice("choice");
      setWomenChoice("");
    }
  };

  const handleSearch = () => {
    setSearched(true);
    const gender = menChoice === "choice" ? "men" : "women";
    axios(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.REACT_APP_WEATHER_API}`
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
          `https://www.googleapis.com/customsearch/v1?q=${weather}+outfit+${gender}&num=10&searchType=image&key=${process.env.REACT_APP_GOOGLE_API}&cx=${process.env.REACT_APP_CUSTOM_SEARCH}`
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
    const gender = menChoice === "choice" ? "men" : "women";
    axios(
      `https://www.googleapis.com/customsearch/v1?q=${weatherAfterSearch}+outfit+${gender}&num=10&searchType=image&start=${offset}&key=${process.env.REACT_APP_GOOGLE_API}&cx=${process.env.REACT_APP_CUSTOM_SEARCH}`
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
    <div>
      <h2 className="title">Dressi</h2>
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
                class="react-switch-checkbox"
                id="react-switch-new"
                type="checkbox"
              />
              <label
                onClick={toggleGenderChoice}
                class="react-switch-label"
                for="react-switch-new"
                on
              >
                <span className={menChoice}>Men</span>
                <span>|</span>
                <span className={womenChoice}>Women</span>
              </label>
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
    </div>
  );
}

export default App;
