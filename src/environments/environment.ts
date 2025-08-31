// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBvNOrZ344Of3PA8OaK4q9YPjYyfoyt-D0",
    authDomain: "retailoffweb.firebaseapp.com",
    databaseURL: "https://retailoffweb-default-rtdb.firebaseio.com",
    projectId: "retailoffweb",
    storageBucket: "retailoffweb.appspot.com", // corregido
    messagingSenderId: "923723068281",
    appId: "1:923723068281:web:9bf3b3e75452c5477475a8",
    measurementId: "G-B7SP9EZ5L5"
  },
  mapboxToken: 'pk.eyJ1IjoiZXN0eGJ2biIsImEiOiJjbWV5b3oweWUxbGFyMnJvYXU3cTVlaWxlIn0._Q39NyiwrEprwLJGNVy3WA' // reemplaza por tu token Mapbox
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
