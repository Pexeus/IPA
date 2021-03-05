# Path: /ai/dispatcher.py
# Autors: Liam Benedetti
# Description: Dispatches the Events from counter.py over the Network

# Imports
import time
import requests
import json
import base64
import cv2
from datetime import datetime

# Global Variables
webserver = ""
protocol = ""
dispatchCooldown = 0
# (not a permanent solution) Webserver API Key
API_KEY = "yN6Bzj}bCDs_Tw2&9z!/6#}@5W$A;9]ny;,>a'Z5"

# Initializing th dispatcher with the IP of the Webserver, as well as the protocol (http/https)
def initializeDispatcher(ip, proc):
    global webserver
    global protocol

    protocol = proc
    webserver = ip

    print("[INFO] Dispatcher configuration: IP:", ip, "Protocol:", proc)

# takes the Frame in BGR, compresses it as a jpg and encodes it to base64
# the base64 string then gets sent to the Webserver
def dispatchFrame(camName, frame):
    global dispatchCooldown

    # if disptachCooldown is 0, try to send, otherwise wait for the cooldown
    # this prevents the program from waiting for the 250ms timeot everytime a new frame is loaded.
    if dispatchCooldown == 0:
        global webserver
        global protocol
        global API_KEY
        
        # compress/encode using jpg
        retval, buffer = cv2.imencode('.jpg', frame)
        # ecoding jpg buffer to base64
        base64Data = base64.b64encode(buffer)

        # setting target URL an headers
        url = protocol + "://" + webserver + ":80/api/video/"
        headers = {
            'content-type': 'application/json',
            # auth header
            "Auth": API_KEY
        }
        
        # try to send the Frame to the Webserver.
        # if the timeout expires, trigger a cooldown.
        try:
            response = requests.post(url, headers=headers, json={"cam": camName, "data": base64Data}, timeout=0.25)
        except:
            dispatchCooldown = 120
            print("[frameDispatcher] cant reach webserver, retrying in", dispatchCooldown, "frames")
    else:
        dispatchCooldown = dispatchCooldown - 1

# take the event (enter/exit) as well as the origin and send it to the Webserver
def dispatchEvent(event, camName):
    global webserver
    global protocol
    global API_KEY

    # create the JSON dataset
    data = {
        "event": event,
        "time": int(datetime.now().timestamp() * 1000),
        "location": camName,
    }

    # set target URL and Headers
    url = protocol + "://" + webserver + ":80/api/traffic/register"
    print(url)
    headers = {
        'content-type': 'application/json',
        "Auth": API_KEY
    }

    # try to send the event to the webserver
    # if the timeout expires, inform the admin over the command prompt
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data), timeout=0.25)
        print("[eventDispatcher] dispatched event:", event)
    except:
        print("[eventDispatcher] cant reach webserver")
