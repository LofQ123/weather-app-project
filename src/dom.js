import { changeCity, readLanguage } from "./data";
import {
  getWindDirection,
  getWindSpeed,
  getCurrentTemp,
  getCurrentFeelsLike,
  getHumidity,
  getPressure,
  getData,
  switchUnits,
  switchLanguage,
  readUnits,
  getTempUnit,
  getSpeedUnit,
  getPressureUnit
} from "./data";
import { icons } from "./icons";
import "./translation"
import { translation_en, translation_ru } from "./translation";

export function displayData(a) {
  document.getElementById("searchField").setAttribute("placeholder", getTextContent("searchField"));
  displayMainCard(a);
  setUnitSwitch();
  setLanguageSwitch();
  setTimeout(logLocalData(), 1000);
}

async function displayMainCard(a) {
  const data = await getData(a);
  const current = data.currentConditions;
  const lastTimeUpdated = document.getElementById("lastTimeUpdated"),
    currentCity = document.getElementById("currentCity"),
    currentTemp = document.getElementById("currentTemp"),
    currentIcon = document.getElementById("currentIcon"),
    currentFeelsLike = document.getElementById("currentFeelsLike"),
    currentConditions = document.getElementById("currentConditions"),
    currentWind = document.getElementById("currentWind"),
    currentHumidity = document.getElementById("currentHumidity"),
    currentPressure = document.getElementById("currentPressure");

  currentCity.innerText = data.resolvedAddress;
  currentTemp.innerText = `${getCurrentTemp(data)} ${getTempUnit()}`;
  changeIcon(currentIcon, current.icon);
  currentFeelsLike.innerText = `${getTextContent("currentFeelsLike")} ${getCurrentFeelsLike(data)} ${getTempUnit()}`;
  currentConditions.innerText = data.currentConditions.conditions;
  currentWind.innerText = `${getTextContent("currentWind")}: ${getWindSpeed(data)} ${getSpeedUnit()} ${getWindDirection(current)}`;
  currentHumidity.innerText = `${getTextContent("currentHumidity")}: ${getHumidity(current)}%`;
  currentPressure.innerText = `${getTextContent("currentPressure")}: ${getPressure(data)} ${getPressureUnit()}`;
  lastTimeUpdated.innerText = `${getTextContent("lastTimeUpdated")}: ${data.fetched}`;
}

export function addEventListeners() {
  const searchBtn = document.getElementById("searchBtn");
  const unitSwitch = document.getElementById("unitSwitch");
  const refreshBtn = document.getElementById("refreshBtn");
  const searchField = document.getElementById("searchField");
  const languageSwitch = document.getElementById("languageSwitch");

  searchBtn.addEventListener("click", handleSearch);
  searchField.addEventListener(
    "keypress",
    (e) => e.key === "Enter" && handleSearch(),
  );
  unitSwitch.addEventListener("click", handleSwitchUnits);
  refreshBtn.addEventListener("click", handleRefresh);
  languageSwitch.addEventListener("click", handleSwitchLanguage);
}

function handleSearch() {
  let searchField = document.getElementById("searchField");
  let searchedCity = searchField.value;
  changeCity(searchedCity);
  displayData();
}

function handleSwitchUnits() {
  switchUnits();
  displayData();
}

function handleSwitchLanguage() {
    switchLanguage();
    displayData("refresh");
}

function handleRefresh() {
  rotateRefreshBtn();
  displayData("refresh");
}

function rotateRefreshBtn() {
  const refreshBtn = document.getElementById("refreshBtn");
  refreshBtn.classList.add("rotating");
  setTimeout(() => refreshBtn.classList.remove("rotating"), 1000);
}

function logLocalData() {
  const AppData = JSON.parse(localStorage.getItem("WeatherAppData"));
  const LocalData = AppData.local;
  console.log(LocalData);
}

function setUnitSwitch() {
  const unitSwitch = document.getElementById("unitSwitch");
  let currentUnit = readUnits();
  if (currentUnit === "metric") {
    unitSwitch.checked = false;
  } else unitSwitch.checked = true;
}

function setLanguageSwitch() {
    const languageSwitch = document.getElementById("languageSwitch");
    let currentLanguage = readLanguage();
    if (currentLanguage === "ru") {
        languageSwitch.checked = true;
    } else languageSwitch.checked = false;
  }

function changeIcon(element, icon) {
  const newIcon = icons[icon];
  element.innerHTML = newIcon;
}

function getTextContent(id) {
    const language = readLanguage();
    let translationFile;
    language === "en" ? translationFile = translation_en : translationFile = translation_ru;
    return translationFile[id];
}