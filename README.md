# PanSuperbike

Sample bike store inventory system. Features include:
- Create an item
- View list of items includes brand, image, model and current in-stock count.
- Edit an item from the inline list view or on the edit form.
- View map of warehouse and the count of items in that warehouse location
- Create and edit a warehouse with geocoding system
- Display statistics of total in-stock, arriving, back order and the total count
- Pie chart of available colours
- Display stock history in a line chart for Shimano and Peloton. Pulling real-time data from Alphavantage API.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.4.

## Development server

1. Run `npm install` to install all dependencies
2. Place `environment.development.ts` and `environment.ts` in `src/environments/`. The content should include the following,
```
export const environment = {
  // Firebase
  firebase: {
    projectId: 'xxxxxx',
    appId: 'xxxxxxxxxxxxxxxxxxxxx',
    storageBucket: 'xxxxxxx.appspot.com',
    locationId: 'us-west1',
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
    authDomain: 'xxxxxxxx.firebaseapp.com',
    messagingSenderId: 'xxxxxxxxxxxxxx',
    measurementId: 'G-xxxxxxxxxx',
  },
  // Alphavantage
  alphaToken: 'XXXXXXXXXXXX',  // api key
  alphaBaseUrl: 'https://www.alphavantage.co/', //base url

  // Maps
  mapBoxToken: 'pk.xxxxxxxxxxxxxxxxxxx',
  defaultLocation: [-123.12597549571147, 49.24887863487956], // Default location to Vancouver
};
```
3. Run `ng serve` for a dev server.
4. Navigate to `http://localhost:4200/`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deploy to Firebase

Run `firebase deploy`

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Future Backlog
- Dark theme
- Responsive design/implementation
- Unit test
- Integration test and calculate code coverage
- TS Lint
- Localization
- Improve error handling
- Image size and file type validation
