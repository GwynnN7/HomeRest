# HomeRest

This project consists of two parts, the main **Front-End** application built in _Angular_, and a dummy **Back-End** server made in _Node.js_ that simulates the behaviour of some default devices

## Backend server

To run the back-end server, copy the **.env** file in the **dummy-server** folder and run this command

```bash
cd dummy-server
npm run start
```
The API will be available at `http://localhost:3000/`

## Frontend application

To run the front-end application, first build the Angular project using this command

```bash
cd home-rest
npm run build
```

## PWA

To test this application as a PWA, the application must be served on an HTTP server using this command

```bash
npm run server
```

Once the application is running, navigate to `http://localhost:8080/` 

Since it uses HTTP protocol, the Service Worker will only be active in `http://localhost:8080/`, and not in `http://{device-ip}:8080/`


## Testing credentials

The first set of credentials uses dummy devices from the dummy-server, while the second set of credentials uses actual devices through my personal API
```
saw@test.com   Saw2025
saw@real.com   Saw2025
```