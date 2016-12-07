var config = {
  apiKey: "<YOUR-API-KEY>",

  // Only needed if using Firebase Realtime Database (which we will be in this example)
  databaseURL: "https://<YOUR-DATABASE-NAME>.firebaseio.com",

  // Only needed if using Firebase Authentication
  authDomain: "<YOUR-AUTH-DOMAIN>",

  // Only needed if using Firebase Storage
  storageBucket: "<YOUR-STORAGE-BUCKET>.appspot.com"
};

firebase.initializeApp(config);
