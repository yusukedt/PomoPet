// Import logEvent from Firebase Analytics
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

// Example of logging an event when the user logs in
function handleLoginSuccess() {
  logEvent(analytics, 'login', {
    method: 'email', // or another method like 'google' or 'facebook'
  });
}
