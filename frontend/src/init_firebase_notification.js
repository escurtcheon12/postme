import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnsd-g0vA1WcZe3dR30dEv7zvTS1XgLkg",
  authDomain: "final-project-pos.firebaseapp.com",
  projectId: "final-project-pos",
  storageBucket: "final-project-pos.appspot.com",
  messagingSenderId: "16247965628",
  appId: "1:16247965628:web:1fbbc1a9a1370c00428db9",
  measurementId: "G-6CBHR6HQH1",
};

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    console.log("permission", permission);
    if (permission === "granted") {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey:
          "BO-vVJx6VmHww-6umCwJqpn7pdc_Q7TvnqJkLIoD5b9lg-a9BA-Au8CDAvXEwFhspcB06VV737axlDY76Ma9iw4",
      }).then((token) => {
        if (token) {
          console.log("token firebase", token);
        } else {
          console.log("wrong");
        }
      });

      console.log("Notification permission granted.");
    } else {
      console.log("Dont have permission");
    }
  });
}

requestPermission();
