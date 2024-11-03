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
  AppData.lang === "en" ? (AppData.lang = "ru") : (AppData.lang = "en");
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

export function getCurrentDateAndTime() {
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

function getCurrentHour() {
  let currentDate = new Date();
  return currentDate.getHours();
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
  const displayedUnits = readUnits();
  const dataUnits = data.units;
  if (dataUnits === "metric") {
    speed = ((speed * 1000) / 3600).toFixed(1);
  }

  if (checkNeedToConvert(dataUnits, displayedUnits)) {
    return convertWindSpeed(speed, dataUnits);
  } else return speed;
}

export function getCurrentTemp(data) {
  const temp = data.currentConditions.temp;
  const displayedUnits = readUnits();
  const dataUnits = data.units;

  if (checkNeedToConvert(dataUnits, displayedUnits)) {
    return convertTemp(temp, dataUnits);
  } else return temp;
}

export function getMinTemp(data, day = 0) {
  const temp = data.days[day].tempmin;
  const displayedUnits = readUnits();
  const dataUnits = data.units;

  if (checkNeedToConvert(dataUnits, displayedUnits)) {
    return convertTemp(temp, dataUnits);
  } else return temp;
}

export function getCurrentFeelsLike(data) {
  const temp = data.currentConditions.feelslike;
  const displayedUnits = readUnits();
  const dataUnits = data.units;

  if (checkNeedToConvert(dataUnits, displayedUnits)) {
    return convertTemp(temp, dataUnits);
  } else return temp;
}
export function getHumidity(day) {
  const humidity = day.humidity;
  return humidity;
}

export function getPressure(data) {
  const pressure = data.currentConditions.pressure;
  const displayedUnits = readUnits();
  const dataUnits = data.units;

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
  units === "metric" ? (unit = "°С") : (unit = "°F");
  return unit;
}

export function getSpeedUnit() {
  const lang = readLanguage();
  const units = readUnits();
  let unit;

  if (lang === "ru") {
    units === "metric" ? (unit = "м/с") : (unit = "миль/ч");
  } else units === "metric" ? (unit = "m/s") : (unit = "mph");
  return unit;
}

export function getPressureUnit() {
  const lang = readLanguage();
  const units = readUnits();
  let unit;

  if (lang === "ru") {
    units === "metric" ? (unit = "мм рт. ст.") : (unit = "мбар");
  } else units === "metric" ? (unit = "mmHg") : (unit = "mbar");
  return unit;
}

export function getNext12HoursData(data) {
  const displayedUnits = readUnits();
  const dataUnits = data.units;
  const next12HoursData = [];
  const currentHour = getCurrentHour();
  let day = 0;
  let hour = currentHour;

  for (let i = 0; i < 12; i++) {
    const hourData = {};
    hourData.hour = data.days[day].hours[hour].datetime.slice(0, -3);
    hourData.precipprob = data.days[day].hours[hour].precipprob;
    hourData.icon = data.days[day].hours[hour].icon;
    
    const temp = data.days[day].hours[hour].temp;
    if (checkNeedToConvert(dataUnits, displayedUnits)) {
      hourData.temp = convertTemp(temp, dataUnits);
    } else hourData.temp = temp;

    next12HoursData.push(hourData);

    if (hour !== 23) {
      hour++;
    } else {
      day++;
      hour = 0;
    }
  }

  return next12HoursData;
}

export function getUpcomingDaysData(data) {
  const displayedUnits = readUnits();
  const dataUnits = data.units;
  const upcomingDaysData = [];

  const _getDay = (i) => {
    const language = readLanguage();
    const langArg = language === 'en' ? 'en-US' : 'ru-RU';
    const today = language === 'en' ? 'Today' : 'Сегодня';
    
    const date = new Date();
    date.setDate(date.getDate() + i);
    const options_week = { weekday: 'short' };
    const options_date = { month: 'short', day: '2-digit' }
    const day_week = date.toLocaleString(langArg, options_week);
    const day_date = date.toLocaleString(langArg, options_date);

    if (i === 0) {
      return [today, ""];
    } else return [day_week.charAt(0).toUpperCase() + day_week.slice(1), day_date]
  }

  const _getMinTemp = (i) => {
    const tempmin = data.days[i].tempmin
    if (checkNeedToConvert(dataUnits, displayedUnits)) {
      return convertTemp(tempmin, dataUnits);
    } else return tempmin;
  }

  const _getMaxTemp = (i) => {
    const tempmax = data.days[i].tempmax
    if (checkNeedToConvert(dataUnits, displayedUnits)) {
      return convertTemp(tempmax, dataUnits);
    } else return tempmax;
  }

  for (let i = 0; i < 12; i++) {
    const dayData = {};
    [dayData.weekday, dayData.date] = _getDay(i);
    dayData.precipprob = data.days[i].precipprob;
    dayData.icon = data.days[i].icon;
    dayData.tempmin = _getMinTemp(i);
    dayData.tempmax = _getMaxTemp(i);
    upcomingDaysData.push(dayData);
  }

  return upcomingDaysData;
}

export function getCity(data) {
  let city = data.resolvedAddress;
  if (city === "Сімферополь, Україна") {
    city = "Симферополь, Республика Крым, Россия";
  } else if (city === "Алупка, Ялта, Україна") {
    city = "Алупка, Республика Крым, Россия";
  } else if (city === "Алушта, Україна") {
    city = "Алушта, Республика Крым, Россия";
  } else if (city === "Армянськ, Україна") {
    city = "Армянск, Республика Крым, Россия";
  } else if (city === "Бахчисарай, Бахчисарайський район, Україна") {
    city = "Бахчисарай, Республика Крым, Россия";
  } else if (city === "Білогірськ, Білогірський район, Україна") {
    city = "Белогорск, Республика Крым, Россия";
  } else if (city === "Джанкой, Україна") {
    city = "Джанкой, Республика Крым, Россия";
  } else if (city === "Євпаторія, Україна") {
    city = "Евпатория, Республика Крым, Россия";
  } else if (city === "Керч, Україна") {
    city = "Керч, Республика Крым, Россия";
  } else if (city === "Яни-Капу, Україна") {
    city = "Красноперекопск, Республика Крым, Россия";
  } else if (city === "Саки, Україна") {
    city = "Саки, Республика Крым, Россия";
  } else if (city === "Старий Крим, Іслямтерецький район, Україна") {
    city = "Старый Крым, Республика Крым, Россия";
  } else if (city === "Судак, Україна") {
    city = "Судак, Республика Крым, Россия";
  } else if (city === "Феодосія, Україна") {
    city = "Феодосия, Республика Крым, Россия";
  } else if (city === "Ялта, Україна") {
    city = "Ялта, Республика Крым, Россия";
  }
  return city;
};
