import clock from "clock";
import document from "document";
import { today } from "user-activity";
import { units, locale, preferences } from "user-settings";
import * as messaging from "messaging";
import { display } from "display";
import * as util from "../common/utils";
import Weather from "../common/weather/weather";
import { HeartRateSensor } from "heart-rate";

const healthIcons = {
  Steps: "stat_steps_open_32px.png",
  Calories: "stat_cals_open_32px.png",
  Distance: "stat_dist_open_32px.png",
  Elevation: "stat_floors_open_32px.png",
  Minutes: "stat_am_open_32px.png",
  HeartRate: "stat_hr_open_32px.png",  
};

//console.log("Temperature Unit (Sys): " + units.temperature); // "C" or "F" ("metric"/"us")
//console.log("Locale (Sys): " + locale.language);

let weather = new Weather();
messaging.peerSocket.onopen = () => {
  weather.fetch();
}

setInterval(weather.fetch, 30*1000*60);

let settings = {
  displayAutoOff: true,
  temperatureUnit: "C", 
  weatherEnabled: true,
  healthStatus: "Steps",
};

settings.temperatureUnit = units.temperature; // temperature unit came from FitBit App settings via user-settings.units

messaging.peerSocket.onmessage = (evt) => {
  console.log("messages: " + JSON.stringify(evt));
  weather.update(evt.data);
  if(evt.data.key === "alwaysOn" && evt.data.value === true) { 
    display.autoOff = false;    
  } else {
    display.autoOff = true;
  }
  if(evt.data.key === "healthStatus") {
    let s = settings.healthStatus = evt.data.value.values[0].name; // pull down configuration string
    if(healthStatusSettingValid(s)){ settings.healthStatus = s; };
  }
  console.log("Health Status set to: " + settings.healthStatus);
}

// Update the clock every second
clock.granularity = "seconds";

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");

let dateStr = document.getElementById("dateStr");

let weatherConditions = document.getElementById("weatherConditions");
let weatherTemperature = document.getElementById("weatherTemperature");

let healthStatusText = document.getElementById("healthStatusText");
let healthStatusIcon = document.getElementById("healthStatusIcon");

const healthStatusSettingValid = (v) => {
  if(v==="Steps" || v==="Calories" || v==="Minutes" || v==="Distance" || v==="Elevation" || v==="HeartRate") {
    return true;
  }   
  return false;
};

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

const dateText = (d) => {
  return ["SUN","MON","TUE","WED","THU","FRI","SAT"][d.getDay()] + "  " + d.getDate();
};

let hrm = new HeartRateSensor();
hrm.onreading = function() {
//  console.log("Current heart rate: " + hrm.heartRate);
  hrm.stop();
}

const healthStatus = (v) => {    
  let s = "0";
  switch(v) {    
    case "Steps":
      s = (today.local.steps || "0");
      break;
    case "Calories":
      s = (today.local.calories || "0");
      break;
    case "Minutes":
      s = (today.local.activeMinutes || "0");
      break;
    case "Distance":
      s = (today.local.distance || "0");
      break;
    case "Elevation":
      s = (today.local.elevationGain || "0");
      break;
    case "HeartRate":
      hrm.start();
      s = (hrm.heartRate || "0");
      break;
    default:
      break;
  }
  //console.log("healthStatus: " + v + " => " + s);
  return s;
};

const updateClock = () => {
  let n = new Date();
  let hours = n.getHours() % 12;
  let mins = n.getMinutes();
  let secs = n.getSeconds();
  
  // Weather text update
  if(weather.is_success === true) {
    const WEATHER_COND_MAX_LENGTH = 12;
    weatherConditions.text  = util.truncateText(weather.conditions, WEATHER_COND_MAX_LENGTH);
    weatherTemperature.text = settings.temperatureUnit === "C" ? 
      Math.round(weather.temperature) + "°C" :
      Math.round(weather.temperature * 9.0 / 5.0 + 32) + "°F";
  }
  
  // Health Status text update
  healthStatusIcon.href = 'images/' + healthIcons[settings.healthStatus];
  healthStatusText.text = util.monoDigits(healthStatus(settings.healthStatus));
   
  // Day of Week and Date text update
  if(dateStr.text === '-' || secs === 0) {  // '-' is default value in index.gui
    dateStr.text = dateText(n);
  }
  
  // Clock hands update
  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);  
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
  
}

// update the clock every tick event
clock.ontick = () => updateClock();

