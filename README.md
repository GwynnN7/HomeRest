# HomeRest

This project consists of two parts, the main **Front-End** application built in _Angular_, and a dummy **Back-End** server made in _Node.js_ that simulates the behaviour of some default devices

## Backend server

To run the back-end server, copy the **.env** file in the **dummy-server** folder and run this command

```bash
cd dummy-server
npm install
npm run start
```
The API will be available at `http://localhost:3000/`

## Frontend application

To run the front-end application, first build the Angular project using this command

```bash
cd home-rest
npm install
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

## Testing devices

Here is the list of all available dummy devices. Some of them are already added in the dashboard of saw@test.com account
```
Devices:
http://localhost:3000/dummy/devices/lamp ~ type:digital
http://localhost:3000/dummy/devices/computer ~ type:digital
http://localhost:3000/dummy/devices/heater ~ type:digital
http://localhost:3000/dummy/devices/fan ~ type:analog

Sensors:
http://localhost:3000/dummy/sensors/temperature ~ type:analog
http://localhost:3000/dummy/sensors/light ~ type:analog
http://localhost:3000/dummy/sensors/humidity ~ type:analog
http://localhost:3000/dummy/sensors/fire ~ type:digital
http://localhost:3000/dummy/sensors/motion ~ type:digital
```

And here is the list of all available real devices. Some of them are already added in the dashboard of saw@real.com account.

Please avoid testing _lamp_, _power_ and _computer_ without me :)
```
Devices:
http://localhost:3000/real/devices/lamp ~ type:digital
http://localhost:3000/real/devices/computer ~ type:digital
http://localhost:3000/real/devices/power ~ type:digital
http://localhost:3000/real/devices/generic ~ type:digital

Sensors:
http://localhost:3000/real/sensors/temperature ~ type:analog
http://localhost:3000/real/sensors/light ~ type:analog
http://localhost:3000/real/sensors/motion ~ type:digital
```