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
  getPressureUnit,
  getNext12HoursData,
  getUpcomingDaysData,
  getCity,
} from "./data";
import { icons } from "./icons";
import "./translation";
import { translation_en, translation_ru } from "./translation";

export async function displayData(a) {
  const data = await getData(a);
  document
    .getElementById("searchField")
    .setAttribute("placeholder", getTextContent("searchField"));
  displayMainCard(data);
  displayUpcomingHoursCard(data);
  displayUpcomingDaysCard(data);
  setUnitSwitch();
  setLanguageSwitch();
  setTimeout(logLocalData(), 1000);
}

function displayMainCard(data) {
  const current = data.currentConditions;
  const lastTimeUpdated = document.getElementById("lastTimeUpdated"),
    currentCity = document.getElementById("currentCity"),
    currentTemp = document.getElementById("currentTemp"),
    currentIcon = document.getElementById("currentIcon"),
    currentFeelsLike = document.getElementById("currentFeelsLike"),
    currentConditions = document.getElementById("currentConditions"),
    currentWind = document.getElementById("currentWind"),
    currentWinddir = document.getElementById("currentWinddir"),
    currentHumidity = document.getElementById("currentHumidity"),
    currentPressure = document.getElementById("currentPressure");

  currentCity.innerText = `${getCity(data)}`;
  currentTemp.innerText = `${getCurrentTemp(data)} ${getTempUnit()}`;
  changeIcon(currentIcon, current.icon);
  currentFeelsLike.innerText = `${getTextContent("currentFeelsLike")} ${getCurrentFeelsLike(data)} ${getTempUnit()}`;
  currentConditions.innerText = data.currentConditions.conditions;
  currentWind.innerText = `${getTextContent("currentWind")}: ${getWindSpeed(data)} ${getSpeedUnit()}`;
  currentWinddir.innerText = `${getWindDirection(current)}`
  rotateMainWinddirArrow(current);
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
  language === "en"
    ? (translationFile = translation_en)
    : (translationFile = translation_ru);
  return translationFile[id];
}

function rotateMainWinddirArrow(data) {
  const arrow = document.getElementById("winddirArrow");
  const direction = data.winddir;
  arrow.style.transform = `rotate(${direction}deg) scaleY(2)`;
}

function displayUpcomingHoursCard(data) {
  const cardData = getNext12HoursData(data);
  const titleElement = document.getElementById("upcomingHoursCardTitle");
  titleElement.innerText = getTextContent("upcomingHoursCardTitle");

  for (let i = 0; i < 12; i++) {
    const timeElement = document.getElementById(`HC${i + 1}-time`);
    const tempElement = document.getElementById(`HC${i + 1}-temp`);
    const probElement = document.getElementById(`HC${i + 1}-prob`);
    const iconElement = document.getElementById(`HC${i + 1}-icon`);

    timeElement.innerText = cardData[i].hour;
    tempElement.innerText = `${cardData[i].temp}  ${getTempUnit()}`;
    probElement.innerText = (cardData[i].precipprob >= 30) ? `${Math.round(cardData[i].precipprob.toFixed(0) / 10) * 10}%` : '';
    changeIcon(iconElement, cardData[i].icon)
  }
}

function displayUpcomingDaysCard(data) {
  const cardData = getUpcomingDaysData(data);
  const titleElement = document.getElementById("upcomingDaysCardTitle");
  titleElement.innerText = getTextContent("upcomingDaysCardTitle");

  for (let i = 0; i < 12; i++) {
    const weekdayElement = document.getElementById(`DC${i + 1}-weekday`)
    const dateElement = document.getElementById(`DC${i + 1}-date`);
    const probElement = document.getElementById(`DC${i + 1}-prob`);
    const iconElement = document.getElementById(`DC${i + 1}-icon`);
    const tempmaxElement = document.getElementById(`DC${i + 1}-tempmax`);
    const tempminElement = document.getElementById(`DC${i + 1}-tempmin`);

    weekdayElement.innerText = cardData[i].weekday
    dateElement.innerText = cardData[i].date;
    probElement.innerText = (cardData[i].precipprob >= 30) ? `${Math.round(cardData[i].precipprob.toFixed(0) / 10) * 10}%` : '';
    changeIcon(iconElement, cardData[i].icon);
    tempmaxElement.innerText = `${cardData[i].tempmax} ${getTempUnit()}`;
    tempminElement.innerText = `${cardData[i].tempmin} ${getTempUnit()}`;
  }

  console.log(cardData)
}