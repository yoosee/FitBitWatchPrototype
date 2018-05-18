import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me } from "companion";

import Weather from '../common/weather/companion';

let weather = new Weather;

let SETTINGS_KEY_TEMP_UNIT = "temperatureUnit";
let SETTINGS_KEY_WEATHER_ENABLED = "weatherEnabled";
let SETTINGS_KEY_COLOR_THEME = "colorTheme";

// Settings have been changed
settingsStorage.onchange = function(evt) {
  sendValue(evt.key, evt.newValue);
}

// Settings were changed while the companion was not running
if (me.launchReasons.settingsChanged) {
  // Send the value of the setting
  sendValue(SETTINGS_KEY_TEMP_UNIT, settingsStorage.getItem(SETTINGS_KEY_TEMP_UNIT));
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}
function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}