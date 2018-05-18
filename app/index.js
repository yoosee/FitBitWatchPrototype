import clock from "clock";
import document from "document";
import { today } from "user-activity";
import { preferences } from "user-settings";
import * as messaging from "messaging";
import * as util from "../common/utils";
import Weather from "../common/weather/weather";

let weather = new Weather();

let settings = {
  temperatureUnit: "C",
  weatherEnabled: true
};

messaging.peerSocket.onmessage = (evt) => {
  console.log("messages: " + JSON.stringify(evt));
  weather.update(evt.data);
  if(evt.data.key === "temperatureUnit") settings.temperatureUnit = evt.data.value ? "F" : "C";    
  //if(evt.data.key === "temperatureUnit") settings.temperatureUnit = evt.data.value ? "F" : "C";
  console.log("temperatureUnit: " + settings.temperatureUnit);
}

// Update the clock every second
clock.granularity = "seconds";

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");

let dateStr = document.getElementById("dateStr");

let weatherConditions = document.getElementById("weatherConditions");
let weatherTemperature = document.getElementById("weatherTemperature");

let healthSteps = document.getElementById("healthSteps");

// Returns an angle (0-360) for the current hour in the day, including minutes
const hoursToAngle = (hours, minutes) => {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
};

const minutesToAngle = (minutes) => {
  return (360 / 60) * minutes;
};

const secondsToAngle = (seconds) => {
  return (360 / 60) * seconds;
};

const updateClock = () => {
  let n = new Date();
  let hours = n.getHours() % 12;
  let mins = n.getMinutes();
  let secs = n.getSeconds();
  
  //if ((weather.conditions === undefined && secs ===0 ) || // when weather is not there, or 
  if ((weather.conditions === undefined) || // when weather is not there, or 
      (mins % 30 === 0 && secs === 0)) {    // every 30 minutes
    weather.fetch();
  }

  if(weather.is_success === true) {
    weatherConditions.text  = weather.conditions;
    weatherTemperature.text = settings.temperatureUnit === "C" ? 
      Math.round(weather.temperature) + "°C" :
      Math.round(weather.temperature * 9.0 / 5.0 + 32) + "°F";
  }
  
  healthSteps.text = util.monoDigits( (today.local.steps || "0"));
  
  if(dateStr.text === '-' || secs === 0) {
    dateStr.text = ["SUN","MON","TUE","WED","THU","FRI","SAT"][n.getDay()] + "  " + n.getDate();
  }
  
  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);  
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);  
  
}

// update the clock every tick event
clock.ontick = () => updateClock();

// setInterval(weather.fetch, 30*1000*60);
