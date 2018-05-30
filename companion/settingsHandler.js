import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me } from "companion";

let SETTINGS_KEY_COLOR_THEME = "colorTheme";
let SETTINGS_KEY_ALWAYS_ON   = "alwaysOn";
let SETTINGS_KEY_HEALTH_STATUS = "healthStatus";

export const initialize = () => {
  settingsStorage.addEventListener("change", evt => {
    if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
  });
};

// Settings were changed while the companion was not running
//if (me.launchReasons.settingsChanged) {
  // Send the value of the setting
//  sendValue(SETTINGS_KEY_ALWAYS_ON, settingsStorage.getItem(SETTINGS_KEY_ALWAYS_ON));
//  sendValue(SETTINGS_HEALTH_STATUS, settingsStorage.getItem(SETTINGS_KEY_HEALTH_STATUS));
//}

const sendValue = (key, val) => {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
};

const sendSettingData = (data) => {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
};