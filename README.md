# WashU Racing Telemetry System
Welcome to the WashU Racing live telemetry website. 
Inside you'll find the different telemetry views, as well as the graphs within them.

<img width="1910" alt="Screenshot 2024-12-22 at 3 07 05 AM" src="https://github.com/user-attachments/assets/fa0c2559-98aa-4f01-b717-e99933807479" />

## Live Telemetry -Quick Start Guide
(As of 12/22/2024) Live telemetry is currently only available via local hosting. While this may change in the future, here's how to use the live telemetry interface on your local machine!
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

Note: For live data transfer, ensure that _both_ Backend.py and GetDataFromCar.py are running. When analyzing old data, this isn't necessary.

## Analyzing Old Data
(As of 12/22/2024)
You may have noticed that there is an option to upload a file into the telemetry interface. This website
has the ability to analyze old .csv files from Race Studio (found in Box). In the future, this will likely be hosted online, but for now you have to download the telemetry files to your local machine, and follow the quick start guide above.


Before Uploading a .csv file, make sure to remove every line above the headers (every line that's not Time, LatAcc, etc.)


## Standards

- All code should follow the [Google style guide](https://google.github.io/styleguide/)
- Repository should follow gitflow branching strategy
- More info can be found [here](https://docs.google.com/document/d/1ARGR6GPORXKE09iwE0viAhfVXgTAP3NhcMlSWubIhwk/edit?usp=sharing)
