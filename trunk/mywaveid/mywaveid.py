"""mywaveid

When added to a wave, will append a blip with the waveid
and url for that wave. Handy for linking, both from and
to GWave


"""	

__author__ = 'wavesdev+mywaveid@gmail.com (Charles Deschenes)'

from waveapi import events
from waveapi import model
from waveapi import robot
import waveapi.document as doc

v='0.011'

def OnRobotAdded(properties, context):
	"""Invoked when the robot has been added."""	
	
	blip = context.GetRootWavelet().CreateBlip()
	waveId = blip.GetWaveId()
	waveletId = blip.GetWaveletId()
	thisWaveUrl = 'https://wave.google.com/wave/?#restored:wave:' + waveId.replace('!w+', '!w%252B')
	blip.GetDocument().SetText("\n\nThis wave's ID:\n"+waveId+"\nThis wave's URL:\n"+thisWaveUrl+"\n(Brought to you by your friendly mywaveid@appspot.com frugal robot!)")
	
	contents = blip.GetDocument().GetText()
	
	r = doc.Range()
	r.start = contents.find("ID:") + 4
	r.end = contents.find("This wave's URL:") - 1
	blip.GetDocument().SetAnnotation(r, "style/fontWeight", "bold")
	blip.GetDocument().SetAnnotation(r, "style/fontSize", "1.15em")
	blip.GetDocument().SetAnnotation(r, "style/backgroundColor", "rgb(228, 243, 244)")

	r.start = contents.find("URL:") + 5
	r.end = contents.find("(Brought") - 1
	blip.GetDocument().SetAnnotation(r, "style/fontWeight", "bold")
	blip.GetDocument().SetAnnotation(r, "style/fontSize", "1.15em")
	blip.GetDocument().SetAnnotation(r, "style/backgroundColor", "rgb(228, 243, 244)")

	r.start = contents.find("(Brought")
	r.end = contents.find(")")
	blip.GetDocument().SetAnnotation(r, "style/fontStyle", "italic")
	blip.GetDocument().SetAnnotation(r, "style/fontSize", "0.85em")


if __name__ == '__main__':
	myRobot = robot.Robot('mywaveid', 
	profile_url='http://mywaveid.appspot.com/',
	image_url='http://mywaveid.appspot.com/assets/icon.gif',
	version=v)
	myRobot.RegisterHandler(events.WAVELET_SELF_ADDED, OnRobotAdded)
	myRobot.Run()