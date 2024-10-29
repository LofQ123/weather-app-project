import { data, currentDay } from ".";
import { city, changeCity } from ".";

import {
    getWindDirection,
    getWindSpeed,
    getCurrentTemp,
    getCurrentFeelsLike,
    getHumidity,
    getPressure,
    getData,
  } from "./data";

export function displayData() {
  displayMainCard();
}

function displayMainCard() {
    const lastTimeUpdated = document.getElementById("lastTimeUpdated"),
      currentCity = document.getElementById("currentCity"),
      currentTemp = document.getElementById("currentTemp"),
      currentFeelsLike = document.getElementById("currentFeelsLike"),
      currentConditions = document.getElementById("currentConditions"),
      currentWind = document.getElementById("currentWind"),
      currentHumidity = document.getElementById("currentHumidity"),
      currentPressure = document.getElementById("currentPressure")
  
  
    lastTimeUpdated.innerText = `Updated: ${data.fetched}`  
    currentCity.innerText = data.resolvedAddress;
    currentTemp.innerText = `${getCurrentTemp(currentDay)}`;
    currentFeelsLike.innerText = `Feels like: ${getCurrentFeelsLike(currentDay)}`;
    currentConditions.innerText = data.currentConditions.conditions;
    currentWind.innerText = `Wind: ${getWindSpeed(currentDay)} ${getWindDirection(currentDay)}`;
    currentHumidity.innerText = `Humidity: ${getHumidity(currentDay)}%`;
    currentPressure.innerText = `Pressure: ${getPressure(currentDay)}`
}

export function addEventListeners() {
    const searchBtn = document.getElementById("searchBtn");

    searchBtn.addEventListener("click", handleSearch)
}

function handleSearch() {
    let searchField = document.getElementById("searchField");
    let searchedCity = searchField.value;
    changeCity(searchedCity);
    console.log(city);
}