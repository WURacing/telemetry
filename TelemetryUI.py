# -*- coding: utf-8 -*-

#######################################################################################################

#	WURacing wireless data transfer interface
#	Written by Thomas Kelly, Michael Greer, Erika Roedl, Alastair Hicklin-Coorey, and Evan Simkowitz
# 	January 30, 2016

#	Made to work with XBee Wireless Radios and Arduino Mega

#######################################################################################################


import serial 
import sys							#Imports the serial library
import matplotlib
import re
matplotlib.use('qt4agg')				#Changes Graphics Backend
import matplotlib.pyplot as plt 		#Graphing Library
#from matplotlib.lines import Line2D
#from matplotlib.patches import Rectangle
import time
import datetime
import os

import Tkinter
from Tkinter import *

valArrays = []			#initialize arrays to hold collected values
for x in range (0, 6):
	valArrays.append([])

timeArray = []		#Stores corresponding time values

plt.ion() 			#Allows live plotting

#array100 = []		#Dictates x-axis length on graph

count = 0 			#increments each loop to build referenceArray

argc = len(sys.argv) - 1
argv = []			#an array for commandline arguments

if argc == 0:		#sets defaults in the event of no commandline arguments
	argv.append(sys.argv[0])
	argv.append("0")
	argv.append("1")
	argv.append("2")
	argv.append("3")
	argc = 4
else:
	argv = sys.argv


colorArr = ["blue", "green", "red", "brown", "orange", "magenta", "black"]		#just an array of color codes (please tell me someone knows a better way to do this)

prefixes = ["Engine Speed", "Engine Load", "Engine Coolant Temp", "Vehicle Speed", "Gear Calculated", "Battery Volts"]
suffixes = ["rpm", "%", "°C", "mph", "", "V"]

yLims = [(0, 12000), (0, 100), (0, 100), (0, 90), (0, 10), (0, 13)]

number_regex = re.compile(r"\d+\.?\d*")


def inArgs(num):	#a method to test if a specified number is in the arguments passed from the command line
	for x in range (1, argc + 1):
		if num == int(argv[x]):
			return True
	return False

def getRowsCols(num):	#factors the desired number of plots so they can be displayed in rows and columns
	result = []
	fact1 = 1
	fact2 = num
	diff = sys.maxint
	for x in range (1, (num / 2) + 1):
		if (x * (num / x) == num):
			if (abs(x - (num / x)) < diff):
				diff = abs(x - (num / x))
				fact1 = x
				fact2 = num / x
	if (fact1 > fact2):
		result = [fact1, fact2]
	else:
		result = [fact2, fact1]

	return result

rowscols = getRowsCols(argc)	#get the number of rows and columns

f, axarr = plt.subplots(rowscols[0] , rowscols[1], sharex = True, sharey = False) 	#Initializes Plot
f.canvas.draw()												#
plt.show(block = False)


root = Tk()

labelStrings = []
for i in range (0,6):
	labelStrings.append(StringVar())


radioData = serial.Serial('/dev/ttyUSB1',9600)		#IMPORTANT: change this to your computer's incoming serial port

directory = os.getcwd()		#get name of current directory and create subdirectory "logs" to store csv files
if os.name == "posix":
	directory += "/logs/"	#append subdirectory depending on operating system
if os.name == "nt":
	directory += "\\logs\\"
file_name = "POTDATA " + datetime.datetime.today().strftime('%m-%d-%Y') + " " + datetime.datetime.now().strftime('%H:%M:%S') + ".csv"      #creates filename as a string including today's date
if not os.path.exists(directory):
    os.makedirs(directory)

#mostRecentVals = []

def readData():
	with open(directory + file_name, 'a') as csvfile:
		while (radioData.inWaiting()==0): 		#Wait here for data
			pass 								#Do Nothing
		radioString=radioData.readline() 		#Reads incoming data
		#print radioString
		if (radioString == '' or radioString == '\n'):					#Makes sure incoming data isn't an empty string
			#print "String was Empty"
			pass
		else:
			#print "String was NOT empty"
			newArray = radioString.split(',') 
			print newArray							
			if len(newArray)==7:										
				for x in range (0 , 6):
					match = number_regex.match(newArray[x])
					if match is not None:
						valArrays[x].append(float(match.group(0)))				#append new data to val arrays
					labelStrings[x].set(prefixes[x] + ": " + newArray[x] + suffixes[x])
					#mostRecentVals = newArray
				timeArray.append(int(newArray[6]))
				csvfile.write(str(newArray[0])+","+str(newArray[6])) 	#Writes value array to a csv file


			if len(timeArray)>200:				#Sets max array length to 200
				for x in range (0 , 6):
					valArrays[x].pop(0)			
				timeArray.pop(0)


			if (len(timeArray) > 0):
				if rowscols[0] == 1 and rowscols[1] == 1:
					axarr.set_xlim(timeArray[0], timeArray[len(timeArray) - 1])
				elif rowscols[1] == 1:
					axarr[0].set_xlim(timeArray[0], timeArray[len(timeArray) - 1])
				else:
					axarr[0][0].set_xlim(timeArray[0], timeArray[len(timeArray) - 1])


			x = 0								#count of graphs that have been plotted
			for i in range (0, 6):				#loops through and prints specified graphs
				if inArgs(i):					#makes sure graph was specified
					if (rowscols[0] == 1 and rowscols[1] == 1):
						line, = axarr.plot(timeArray, valArrays[i], colorArr[i])
						axarr.draw_artist(axarr.patch)									
						axarr.draw_artist(line)										
						axarr.set_ylim(yLims[i][0], yLims[i][1])
						#if (len(mostRecentVals) > 0):
							#axarr[x].text(0.5, 0.5, "Hello, World!", horizontalalignment='right', verticalalignment='bottom', transform=axarr[x].transAxes)
							#print str(mostRecentVals[i])										#
						for spine in axarr.spines.values(): axarr.draw_artist(spine)
						x += 1
					elif (rowscols[1] == 1):
						line, = axarr[x].plot(timeArray, valArrays[i], colorArr[i])
						axarr[x].draw_artist(axarr[x].patch)									
						axarr[x].draw_artist(line)										
						axarr[x].set_ylim(yLims[i][0], yLims[i][1])
						#if (len(mostRecentVals) > 0):
							#axarr[x].text(0.5, 0.5, "Hello, World!", horizontalalignment='right', verticalalignment='bottom', transform=axarr[x].transAxes)
							#print str(mostRecentVals[i])										#
						for spine in axarr[x].spines.values(): axarr[x].draw_artist(spine)
						x += 1
					else:
						row = int (x / rowscols[1])
						col = x % rowscols[1]
						line, = axarr[row][col].plot(timeArray, valArrays[i], colorArr[i])
						axarr[row][col].draw_artist(axarr[row][col].patch)									
						axarr[row][col].draw_artist(line)										
						axarr[row][col].set_ylim(yLims[i][0], yLims[i][1])
						#if (len(mostRecentVals) > 0):
							#axarr[x].text(0.5, 0.5, "Hello, World!", horizontalalignment='right', verticalalignment='bottom', transform=axarr[x].transAxes)
							#print str(mostRecentVals[i])										#
						for spine in axarr[row][col].spines.values(): axarr[row][col].draw_artist(spine)
						x += 1
				else:
					pass

			f.canvas.update()											#Updates Graph
			f.canvas.flush_events()

	root.after(5, readData)


labels = []
for i in range (0, 6):
	labels.append(Label(root, textvariable=labelStrings[i], fg=colorArr[i]).grid(row = (i + 1), column = 0))

button1 = Button(root, text = "Go!", command=readData).grid(row=0, column=0)
try:											#try/except will exit while loop if ctrl-C is used
	root.mainloop()
except KeyboardInterrupt:												#Allows csv file to save before quit
	pass