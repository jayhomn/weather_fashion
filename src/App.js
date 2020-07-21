import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [location, setLocation] = useState("");

  useEffect(() => {
    let input = document.getElementById("pac-input");

    input.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("submit-btn").click();
      }
    });
  });

  return (
    <div className="main-div">
      <h1>Enter Your Location</h1>
      <form
        onSubmit={(event) => {
          let div = document.getElementsByClassName("main-div");
          div.classList.add("div-move-up");
        }}
      >
        <input
          id="pac-input"
          className="search-bar"
          type="text"
          value={location}
          onChange={(event) => {
            setLocation(event.target.value);
          }}
        />
        <input id="submit-btn" className="submit-btn" type="submit" />
      </form>
    </div>
  );
}

export default App;
