// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGmdnWtMJiv3vYTobFMwSydehimzC_1w0",
  authDomain: "rn-better.firebaseapp.com",
  projectId: "rn-better",
  storageBucket: "rn-better.appspot.com",
  messagingSenderId: "345970809004",
  appId: "1:345970809004:web:fbc1cfd20a0433d6a8a709",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Export the initialized app and auth
export { app, auth };
