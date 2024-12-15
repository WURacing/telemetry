// import { defineStore } from 'pinia';
// import { ref } from 'vue';
// import { io, Socket } from "socket.io-client";
//
//
// export const useCANDataStore = defineStore('canData', {
//     state: () => ({
//         latAcc: [] as number[],
//         longAcc: [] as number[],
//         engineRPM: [] as number[],
//         time: [] as number[],
//         gpsXPos: [] as number[],
//         gpsYPos: [] as number[],
//         airSpeed: [] as number[],
//         brakePressure: [] as number[],
//         throttlePosition: [] as number[],
//         oilPressure: [] as number[],
//         oilTemp: [] as number[],
//         socket: null as Socket | null, // Add socket instance to the store
//         isConnected: false, // Track socket connection status
//     }),
//     actions: {
//         initializeSocket() {
//             if (!this.socket) {
//                 this.socket = io("http://localhost:5000"); // Replace with actual server
//                 this.socket.on("connect", () => {
//                     console.log("Connected to Socket.IO server");
//                     this.isConnected = true;
//                 });
//
//                 this.socket.on("disconnect", () => {
//                     console.log("Disconnected from Socket.IO server");
//                     this.isConnected = false;
//                 });
//
//
//                 this.socket.on("can_data", (data: any) => {
//                     this.addDataPoint(data);
//                 });
//             }
//
//         },
//         disconnectSocket() {
//             if (this.socket) {
//                 this.socket.disconnect();
//                 this.socket = null;
//                 this.isConnected = false;
//             }
//         },
//
//
//
//         addDataPoint(data: any) {  // Type the incoming data as needed
//             // Assuming data structure from backend matches the store properties:
//             this.time.push(parseFloat(data.time)); // Ensure type correctness if necessary
//
//             this.latAcc.push(parseFloat(data.LatAcc)); // Add or adjust other data points as needed.
//             this.longAcc.push(parseFloat(data.LongAcc));
//             this.engineRPM.push(parseFloat(data.EngineRPM));
//             this.gpsXPos.push(parseFloat(data.GPSXPos));
//             this.gpsYPos.push(parseFloat(data.GPSYPos));
//             this.airSpeed.push(parseFloat(data.AirSpeed));
//             this.brakePressure.push(parseFloat(data.BrakePressure));
//             this.throttlePosition.push(parseFloat(data.ThrottlePosition));
//             this.oilPressure.push(parseFloat(data.OilPressure));
//             this.oilTemp.push(parseFloat(data.OilTemp));
//             // ...add other data points as needed
//
//         },
//
//
//         clearData() {   // Clear all arrays
//             this.latAcc = [];
//             this.longAcc = [];
//             this.engineRPM = [];
//             this.gpsXPos = [];
//             this.gpsYPos = [];
//             this.airSpeed = [];
//             this.brakePressure = [];
//             this.throttlePosition = [];
//             this.oilPressure = [];
//             this.oilTemp = [];
//             // ... clear all other arrays
//         },
//
//         // ... other actions if needed (e.g., for starting/stopping sessions)
//
//
//     },
//     getters: {
//         //Keep getters if needed
//         getLatAcc: (state) => state.latAcc,
//         getLongAcc: (state) => state.latAcc,
//         getEngineRPM: (state) => state.latAcc,
//
//         //.. other getters
//     }
// });
