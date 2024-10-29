import "./styles.css";
import {
  getData,
} from "./data";
import { displayData, addEventListeners } from "./dom";

export let city = "Saransk";
export let units = "metric";
export const data = await getData();
export const currentDay = data.days[0];

export function changeCity(newCity) {
    city = newCity;
}



console.log(data);


addEventListeners()
displayData();




