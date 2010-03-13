"""mywaveid

When added to a wave, will append a blip with the waveid
and url for that wave. Handy for linking, both from and
to GWave


"""	

__author__ = 'wavesdev+mywaveid@gmail.com (Charles Deschenes)'

from waveapi import events
from waveapi import robot
from waveapi import appengine_robot_runner
from waveapi import wavelet
#import logging

v='live-7'

def OnRobotAdded(event, wavelet):
	"""Invoked when the robot has been added."""	

	waveId = wavelet.wave_id
	waveletId = wavelet.wavelet_id
	if waveId.find('wavesandbox.com') != -1:
		xthisWaveUrl = 'https://wave.google.com/a/wavesandbox.com/?#restored:wave:'
		voicyWaveID = 'wavesandbox.com!w+ToI964n0A'
	else:
		xthisWaveUrl = 'https://wave.google.com/wave/?#restored:wave:'
		voicyWaveID = 'googlewave.com!w+hsKZwB2sI'
		
	thisWaveUrl = xthisWaveUrl + waveId.replace('!w+', '!w%252B')
	thisBlip = wavelet.reply("\n\nThis wave's ID:\n"+waveId+"\nThis wave's URL:\n"+thisWaveUrl+"\nBrought to you by your friendly mywaveid@appspot.com frugal robot!\n-- now updated to V2 of the robot API --\nHey, why not check out my little friend, Voicy?")
	
 	rStart = thisBlip.text.find("ID:") + 4
 	rEnd = thisBlip.text.find("This wave's URL:") - 1
 	thisBlip.range(rStart, rEnd).annotate("style/fontWeight", "bold")
 	thisBlip.range(rStart, rEnd).annotate("style/fontSize", "1.15em")
 	thisBlip.range(rStart, rEnd).annotate("style/backgroundColor", "rgb(228, 243, 244)")
 	thisBlip.range(rStart, rEnd).annotate("link/manual", "")

 	rStart = thisBlip.text.find("URL:") + 5
 	rEnd = thisBlip.text.find("Brought") - 1
 	thisBlip.range(rStart, rEnd).annotate("style/fontWeight", "bold")
 	thisBlip.range(rStart, rEnd).annotate("style/fontSize", "1.15em")
 	thisBlip.range(rStart, rEnd).annotate("style/backgroundColor", "rgb(228, 243, 244)")
 	thisBlip.range(rStart, rEnd).annotate("link/manual", "")

 	rStart = thisBlip.text.find("Brought")
 	rEnd = thisBlip.text.find("Voicy") + 6
 	thisBlip.range(rStart, rEnd).annotate("style/fontStyle", "italic")
 	thisBlip.range(rStart, rEnd).annotate("style/fontSize", "0.85em")

 	rStart = thisBlip.text.find("Voicy")
 	rEnd = rStart + 5
 	thisBlip.range(rStart, rEnd).annotate("link/wave", voicyWaveID)

if __name__ == '__main__':
	myRobot = robot.Robot('mywaveid', profile_url='http://mywaveid.appspot.com/', image_url='http://mywaveid.appspot.com/assets/icon.gif')
	myRobot.register_handler(events.WaveletSelfAdded, OnRobotAdded)
	appengine_robot_runner.run(myRobot)