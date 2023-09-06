WashU Racing TelemetryWeb
======================

This is, at the moment, a demonstration of sending multiple series of data over Socket.io from a server to a client and plotting that data in real-time.

The goal of this project is to build a WebApplication which will serve data retrieved from our car to anyone who visits the site. This WebApp will be hosted on a Raspberry Pi 3 and connected to our car over XBee radio.
As our use-case for this requires that we be able to run it from the pits, where internet access is not available, TelemetryWeb is entirely locally-hosted (despite the name's suggestion).

The ultimate goal of this project is to build a browser-based dashboard for telemetry data with various graphs depending on the metric being displayed. As of now, the program has been tested up to 11 data series.

<p align="center">
  <img src="readme-media/TelemetryWeb-Screenshot.png?raw=true" alt="Screenshot"/>
</p>

This project is loosely based on Frank Hassanabad's [socket.io Flot Chart Example](https://github.com/FrankHassanabad/socket.io-flot-example).

# Installation
```
git clone https://github.com/WURacing/TelemetryWeb.git
cd TelemetryWeb/
npm install
node app.js
```

Then open up a web browser to
```
http://localhost:5000/
```
