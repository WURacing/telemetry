# DBC File
This file contains all the data that we are currently retrieving from the car.

VERSION "WUFR 25.1.0"

BO_ 18 FSBAnlg3: 8 FSB
 SG_ FAnlg8 : 0|16@1+ (0.001,0) [0|5] "V" DAQ
 SG_ BrkPrsF : 16|16@1+ (0.25,-125.0) [-125|1125] "Psi" DAQ
 SG_ FAnlg10 : 32|16@1+ (0.001,0) [0|5] "V" DAQ
 SG_ SteeringPot : 48|16@1+ (0.83044,-315.013) [-90|90] "deg" DAQ

BO_ 19 FSBAnlg4: 8 FSB
 SG_ FAnlg12 : 0|16@1+ (0.001,0) [0|5] "V" DAQ
 SG_ BrakeTempFR : 16|16@1+ (1.656,-968) [-148|1652] "F" DAQ
 SG_ FAnlg14 : 32|16@1+ (0.001,0) [0|5] "V" DAQ
 SG_ BrakeTempFL : 48|16@1+ (1.656,-968) [-148|1652] "F" DAQ

BO_ 20 FSBAnlg5: 8 FSB
 SG_ FAnlg16 : 0|16@1+ (0.001,0) [0|5] "V" DAQ
 SG_ FAnlg17 : 16|16@1+ (0.001,0) [0|5] "V" DAQ
 SG_ FAnlg18 : 32|16@1+ (0.001,0) [0|5] "V" DAQ
 SG_ Pitot : 48|16@1+ (0.00326,-1.63) [0|13.04] "mbar" DAQ

BO_ 21 FSBAnlg6: 8 FSB
 SG_ FAccX : 0|16@1- (0.01,0) [-3276|3276] "m/s^2" DAQ
 SG_ FAccY : 16|16@1- (0.01,0) [-3276|3276] "m/s^2" DAQ
 SG_ FAccZ : 32|16@1- (0.01,0) [-3276|3276] "m/s^2" DAQ
 SG_ FGyroX : 48|16@1- (0.01,0) [-3276|3276] "deg/s^2" DAQ

BO_ 22 FSBAnlg7: 8 FSB
 SG_ FGyroY : 0|16@1- (0.01,0) [-3276|3276] "deg/s^2" DAQ
 SG_ FGyroZ : 16|16@1- (0.01,0) [-3276|3276] "deg/s^2" DAQ
 SG_ FMagX : 32|16@1- (0.01,0) [-3276|3276] "#" DAQ
 SG_ FMagY : 48|16@1- (0.01,0) [-3276|3276] "#" DAQ

BO_ 32 RSBAnlg1: 8 RSB
 SG_ ShockPotRL : 0|16@1+ (0.013986,-0.0112) [0|50] "mm" DAQ
 SG_ BrakeTempRL : 16|16@1+ (1.656,-968) [-148|1652] "F" DAQ
 SG_ FAnlg2 : 32|16@1+ (0.001,0) [0|5] "V" DAQ
 SG_ FAnlg3 : 48|16@1+ (0.001,0) [0|5] "V" DAQ

BO_ 35 RSBAnlg4: 8 RSB
 SG_ RAnlg12 : 0|16@1+ (0.001,0) [0|5] "V" DAQ
 SG_ BrakeTempRR : 16|16@1+ (1.656,-968) [-148|1652] "F" DAQ
 SG_ BrkPrsR : 32|16@1+ (0.25,-125.0) [-125|1125] "Psi" DAQ
 SG_ RAnlg15 : 48|16@1+ (0.001,0) [0|5] "V" DAQ

BO_ 37 RSBAnlg6: 8 RSB
 SG_ RAccX : 0|16@1- (0.01,0) [-3276|3276] "m/s^2" DAQ
 SG_ RAccY : 16|16@1- (0.01,0) [-3276|3276] "m/s^2" DAQ
 SG_ RAccZ : 32|16@1- (0.01,0) [-3276|3276] "m/s^2" DAQ
 SG_ RGyroX : 48|16@1- (0.01,0) [-3276|3276] "deg/s^2" DAQ

BO_ 38 RSBAnlg7: 8 RSB
 SG_ RGyroY : 0|16@1- (0.01,0) [-3276|3276] "deg/s^2" DAQ
 SG_ RGyroZ : 16|16@1- (0.01,0) [-3276|3276] "deg/s^2" DAQ
 SG_ RMagX : 32|16@1- (0.01,0) [-3276|3276] "#" DAQ
 SG_ RMagY : 48|16@1- (0.01,0) [-3276|3276] "#" DAQ

BO_ 49 CTRLBrd: 5 CTRLB
 SG_ ClutchPosition : 0|8@1+ (1,0) [0|255] "Deg" DAQ
 SG_ ClutchL : 8|16@1+ (0.00024414,0) [0|1] "" DAQ
 SG_ ClutchR : 24|16@1+ (0.00024414,0) [0|1] "" DAQ
