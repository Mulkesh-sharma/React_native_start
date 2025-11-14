import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: "156860658060-e9fqfgs8nk48j2notdmqg7i66uq37juh.apps.googleusercontent.com",
  scopes: ["openid", "email", "profile"],  // required for idToken
});
