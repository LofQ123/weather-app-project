export function changeCity(newCity) {
  const AppData = JSON.parse(localStorage.getItem("WeatherAppData"));
  AppData.city = newCity;
  localStorage.setItem("WeatherAppData", JSON.stringify(AppData));
}

export function switchUnits() {
  const AppData = JSON.parse(localStorage.getItem("WeatherAppData"));
  AppData.units === "metric"
    ? (AppData.units = "us")
    : (AppData.units = "metric");
  localStorage.setItem("WeatherAppData", JSON.stringify(AppData));
}

export function switchLanguage() {
  const AppData = JSON.parse(localStorage.getItem("WeatherAppData"));
  AppData.lang === "en"
    ? (AppData.lang = "ru")
    : (AppData.lang = "en");
  localStorage.setItem("WeatherAppData", JSON.stringify(AppData));
}

export function readCity() {
  const AppData = JSON.parse(localStorage.getItem("WeatherAppData"));
  if (AppData && AppData.city) {
    return AppData.city;
  } else return "Moscow";
}

export function readUnits() {
  const AppData = JSON.parse(localStorage.getItem("WeatherAppData"));
  if (AppData.units) {
    return AppData.units;
  } else return "metric";
}

export function readLanguage() {
  const AppData = JSON.parse(localStorage.getItem("WeatherAppData"));
  if (AppData.lang) {
    return AppData.lang;
  } else return "en";
}

export async function fetchWeather() {
  const city = readCity();
  const units = readUnits();
  const lang = readLanguage();
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${units}&lang=${lang}&key=DHQPRB627SSZ44YEKGR282XDB&contentType=json`,
      {
        method: "GET",
        headers: {},
      },
    );

    return response.json();
  } catch {
    console.log("Something went wrong");
  }
}

async function handleEmptyStorage() {
  if (!localStorage.WeatherAppData) {
    console.log("setting default");
    const defaultData = {};
    defaultData.city = "Moscow";
    defaultData.units = "metric";
    defaultData.lang = "en";
    localStorage.setItem("WeatherAppData", JSON.stringify(defaultData));
    defaultData.local = await defaultFetch();
    defaultData.local.fetched = getCurrentDateAndTime();
    defaultData.local.units = readUnits();
    localStorage.setItem("WeatherAppData", JSON.stringify(defaultData));
  } else console.log("no need to reset");
}

export async function defaultFetch() {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Moscow?unitGroup=metric&key=DHQPRB627SSZ44YEKGR282XDB&contentType=json`,
      {
        method: "GET",
        headers: {},
      },
    );
    return response.json();
  } catch {
    console.log("Something went wrong");
  }
}

function getCurrentDate() {
  const currentdate = new Date();
  let dateFormatted =
    currentdate.getFullYear() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getDate();
  return dateFormatted;
}

function getCurrentDateAndTime() {
  const currentdate = new Date();
  let datetime =
    currentdate.getFullYear() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getDate() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes().toString().padStart(2, "0") +
    ":" +
    currentdate.getSeconds().toString().padStart(2, "0");
  return datetime;
}

export async function getData() {
  await handleEmptyStorage();

  const AppData = JSON.parse(localStorage.getItem("WeatherAppData"));
  const LocalData = AppData.local;
  const currentDate = getCurrentDate();
  const city = readCity();

  if (LocalData.address !== city || arguments[0] === "refresh") {
    console.log("fetching new data - case 1");
    const newData = await fetchWeather();
    newData.fetched = getCurrentDateAndTime();
    newData.units = readUnits();
    AppData.local = newData;
    localStorage.setItem("WeatherAppData", JSON.stringify(AppData));
    return newData;
  } else if (LocalData.days[0].datetime !== currentDate) {
    console.log("fetching new data - case 2");
    console.log(
      `Local data = ${LocalData.days[0].datetime} and currentDate = ${currentDate}`,
    );
    const newData = await fetchWeather();
    newData.fetched = getCurrentDateAndTime();
    newData.units = readUnits();
    AppData.local = newData;
    localStorage.setItem("WeatherAppData", JSON.stringify(AppData));
    return newData;
  } else {
    console.log("using local data");
    return LocalData;
  }
}

export function getWindDirection(day) {
  const language = readLanguage();
  const val = day.winddir;
  let direction;

  if (language === "en") {
    if ((val > 340 && val <= 360) || (val >= 0 && val <= 11)) {
      direction = "N";
    } else if (val > 11 && val <= 34) {
      direction = "N-NE";
    } else if (val > 34 && val <= 56) {
      direction = "NE";
    } else if (val > 56 && val <= 79) {
      direction = "E-NE";
    } else if (val > 79 && val <= 101) {
      direction = "E";
    } else if (val > 101 && val <= 124) {
      direction = "E-SE";
    } else if (val > 124 && val <= 146) {
      direction = "SE";
    } else if (val > 146 && val <= 169) {
      direction = "S-SE";
    } else if (val > 169 && val <= 191) {
      direction = "S";
    } else if (val > 191 && val <= 214) {
      direction = "S-SW";
    } else if (val > 214 && val <= 236) {
      direction = "SW";
    } else if (val > 236 && val <= 259) {
      direction = "W-SW";
    } else if (val > 259 && val <= 281) {
      direction = "W";
    } else if (val > 281 && val <= 304) {
      direction = "W-NW";
    } else if (val > 304 && val <= 326) {
      direction = "NW";
    } else if (val > 326 && val <= 340) {
      direction = "N-NW";
    }
  } else {
    if ((val > 340 && val <= 360) || (val >= 0 && val <= 11)) {
      direction = "С";
    } else if (val > 11 && val <= 34) {
      direction = "С-СВ";
    } else if (val > 34 && val <= 56) {
      direction = "СВ";
    } else if (val > 56 && val <= 79) {
      direction = "В-СВ";
    } else if (val > 79 && val <= 101) {
      direction = "В";
    } else if (val > 101 && val <= 124) {
      direction = "В-ЮВ";
    } else if (val > 124 && val <= 146) {
      direction = "ЮВ";
    } else if (val > 146 && val <= 169) {
      direction = "Ю-ЮВ";
    } else if (val > 169 && val <= 191) {
      direction = "Ю";
    } else if (val > 191 && val <= 214) {
      direction = "Ю-ЮЗ";
    } else if (val > 214 && val <= 236) {
      direction = "ЮЗ";
    } else if (val > 236 && val <= 259) {
      direction = "З-ЮЗ";
    } else if (val > 259 && val <= 281) {
      direction = "З";
    } else if (val > 281 && val <= 304) {
      direction = "З-СЗ";
    } else if (val > 304 && val <= 326) {
      direction = "СЗ";
    } else if (val > 326 && val <= 340) {
      direction = "С-СЗ";
    }
  }

  return direction;
}

export function getWindSpeed(data) {
  let speed = data.currentConditions.windspeed;
  let displayedUnits = readUnits();
  let dataUnits = data.units;
  if (dataUnits === "metric") {speed = ((speed * 1000) / 3600).toFixed(1)}

  if (checkNeedToConvert(dataUnits, displayedUnits)) {
    return convertWindSpeed(speed, dataUnits);
  } else return speed;
}

export function getCurrentTemp(data) {
  let temp = data.currentConditions.temp;
  let displayedUnits = readUnits();
  let dataUnits = data.units;

  if (checkNeedToConvert(dataUnits, displayedUnits)) {
    return convertTemp(temp, dataUnits);
  } else return temp;
}

export function getMinTemp(data, day = 0) {
  let temp = data.days[day].tempmin;
  let displayedUnits = readUnits();
  let dataUnits = data.units;

  if (checkNeedToConvert(dataUnits, displayedUnits)) {
    return convertTemp(temp, dataUnits);
  } else return temp;
}

export function getCurrentFeelsLike(data) {
  let temp = data.currentConditions.feelslike;
  let displayedUnits = readUnits();
  let dataUnits = data.units;

  if (checkNeedToConvert(dataUnits, displayedUnits)) {
    return convertTemp(temp, dataUnits);
  } else return temp;
}
export function getHumidity(day) {
  let humidity = day.humidity;
  return humidity;
}

export function getPressure(data) {
  let pressure = data.currentConditions.pressure;
  let displayedUnits = readUnits();
  let dataUnits = data.units;

  if (checkNeedToConvert(dataUnits, displayedUnits)) {
    return convertPressure(pressure, dataUnits);
  } else return pressure;
}

function checkNeedToConvert(dataUnits, displayedUnits) {
  if (dataUnits !== displayedUnits) {
    return true;
  } else return false;
}

function convertTemp(temp, from) {
  if (from === "metric") {
    return (temp * 1.8 + 32).toFixed(1);
  } else {
    return ((temp - 32) / 1.8).toFixed(1);
  }
}

function convertPressure(pressure, from) {
  if (from === "metric") {
    return (pressure / 0.75).toFixed(1);
  } else {
    return (pressure * 0.75).toFixed(1);
  }
}

function convertWindSpeed(speed, from) {
  if (from === "metric") {
    return (speed * 2.23694).toFixed(1);
  } else {
    return (speed * 0.44704).toFixed(1);
  }
}

export function getTempUnit() {
  const units = readUnits();
  let unit;
  units === "metric" ? unit = "°С" : unit = "°F";
  return unit;
}

export function getSpeedUnit() {
  const lang = readLanguage();
  const units = readUnits();
  let unit;

  if (lang === "ru") {
    units === "metric" ? unit = "м/с" : unit = "миль/ч";
  } else units === "metric" ? unit = "m/s" : unit = "mph";
  return unit;
}

export function getPressureUnit() {
  const lang = readLanguage();
  const units = readUnits();
  let unit;

  if (lang === "ru") {
    units === "metric" ? unit = "мм рт. ст." : unit = "мбар";
  } else units === "metric" ? unit = "mmHg" : unit = "mbar";
  return unit;
}