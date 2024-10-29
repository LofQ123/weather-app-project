import { city, units } from ".";

export async function fetchWeather(city, units) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${units}&key=DHQPRB627SSZ44YEKGR282XDB&contentType=json`,
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
  const currentDate = new Date();
  const dateFormatted = currentDate.toISOString().split("T")[0];
  return dateFormatted;
}

function getCurrentDateAndTime() {
    const currentdate = new Date(); 
    let datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    return datetime
}

export async function getData() {
  const localData = JSON.parse(localStorage.getItem("currentWeatherData"));
  const currentDate = getCurrentDate();

  if (localData.address !== city) {
    console.log("fetching new data");
    const newData = await fetchWeather();
    newData.fetched = getCurrentDateAndTime();
    localStorage.setItem("currentWeatherData", JSON.stringify(newData));
    return newData;
  } else if (localData.days[0].datetime !== currentDate) {
    console.log("fetching new data");
    const newData = await fetchWeather();
    newData.fetched = getCurrentDateAndTime();
    localStorage.setItem("currentWeatherData", JSON.stringify(newData));
    return newData;
  } else {
    console.log("using local data");
    return localData;
  }
}

export function getWindDirection(day) {
  let direction;
  const val = day.winddir;

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

  return direction;
}

export function getWindSpeed(day) {
  const windSpeed = day.windspeed;
  let formattedWindSpeed;
  if (units === "metric") {
    formattedWindSpeed = (windSpeed / 3.6).toFixed(1);
    formattedWindSpeed = formattedWindSpeed + ` m/s`;
    return formattedWindSpeed;
  } else if (units === "us") {
    formattedWindSpeed = (windSpeed * 0.6214).toFixed(1);
    formattedWindSpeed = formattedWindSpeed + ` mph`;
    return formattedWindSpeed;
  }
}

export function getCurrentTemp(day) {
  let temp = day.temp;
  units === "metric" ? (temp = temp + " °C") : (temp = temp + " ℉");
  return temp;
}

export function getCurrentFeelsLike(day) {
  let temp = day.feelslike;
  units === "metric" ? (temp = temp + " °C") : (temp = temp + " ℉");
  return temp;
}
export function getHumidity(day) {
  let humidity = day.humidity;
  return humidity;
}

export function getPressure(day) {
  let pressure = day.pressure;
  if (units === "us") {
    pressure = pressure + " mbar";
  } else {
    pressure = (pressure * 0.750064).toFixed(1) + " mmHg";
  }
  return pressure
}
