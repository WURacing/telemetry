WashU Racing TelemetryWeb
======================

This is, at the moment, a demonstration of sending multiple series of data over Socket.io from a server to a client and plotting that data in real-time.

The goal of this project is to build a WebApplication which will serve data retrieved from our car to anyone who visits the site. This WebApp will be hosted on a Raspberry Pi 3 and connected to our car over XBee radio.
As our use-case for this requires that we be able to run it from the pits, where internet access is not available, our solution absolutely had to be locally hosted. This ended up being more of a challenge than expected as many of the more refined solutions we found turned out to outsource various functionality to the cloud. Additionally, while there are plenty of great examples of streaming one data series, these examples did not scale nicely to multiple series.

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
