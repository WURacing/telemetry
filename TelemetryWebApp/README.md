# WashU Racing Telemetry System
Welcome to the WashU Racing live telemetry website. 
Inside you'll find the different telemetry views, as well as the graphs within them.

<img width="1874" alt="Screenshot 2024-12-07 at 12 19 24 PM" src="https://github.com/user-attachments/assets/aa53862d-0035-4198-9a74-da177b05f3d3" />

## Quick Start Guide
Install the TelemetryWebApp folder on your local machine
In your terminal, run:
```sh
cd PATH-TO-frontend-web-telemetry
npm install
npm run dev
```
Open a new terminal instance and run:
```sh
cd PATH-TO-telemetryBackend
npm install
npm run dev
```

Congrats! Telemetry should now be running on your local computer. Now, all you have to do is navigate to the localhost
link, plug in the RF receiver 
and hit "Begin Streaming Session".

## Analyzing Old Data
You may have noticed that there is an option to upload a file into the telemetry interface. This website
has the ability to analyze old .csv files from Race Studio (found in Box).

Before Uploading a .csv file, make sure to remove every line above the headers (Time, LatAcc, etc.)
