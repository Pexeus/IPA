# Imports
import time
import requests
import json
import base64
import cv2
from datetime import datetime

# Globale Variablen
webserver = ""
protocol = ""
dispatchCooldown = 0
#  Dies ist eine vorübergehnde Lösung!
API_KEY = "yN6Bzj}bCDs_Tw2&9z!/6#}@5W$A;9]ny;,>a'Z5"

# Initialisierung des Dispatchers, ip wird für alle requestst festgelegt
# hier wird auch das Protokoll HTTP/HTTPS für alle requests festgelegt
def initializeDispatcher(ip, proc):
    global webserver
    global protocol

    protocol = proc
    webserver = ip

    print("[INFO] Dispatcher configuration: IP:", ip, "Protocol:", proc)

def dispatchFrame(camName, frame):
    global dispatchCooldown

    # Ist der dispatchCooldown 0, versuche zu senden, sonst warte und zähle cooldown -1
    if dispatchCooldown == 0:
        global webserver
        global protocol
        global API_KEY
        
        # Frame als jpg encoden
        retval, buffer = cv2.imencode('.jpg', frame)
        # Als jpeg encodedten buffer in base64 encoden
        base64Data = base64.b64encode(buffer)

        # ZielURL und headers festlegen
        url = protocol + "://" + webserver + ":80/api/video/"
        headers = {
            'content-type': 'application/json',
            "Auth": API_KEY
        }
        
        # Versuche den Frame an den Webserver zu senden (try).
        # Ist der Webserver nicht erreichtbar (except), warte 240 Frames lang (ca 8 sekunden) und versuche es erneut
        try:
            response = requests.post(url, headers=headers, json={"cam": camName, "data": base64Data}, timeout=0.25)
        except:
            dispatchCooldown = 120
            print("[frameDispatcher] cant reach webserver, retrying in", dispatchCooldown, "frames")
    else:
        dispatchCooldown = dispatchCooldown - 1

def dispatchEvent(event, camName):
    global webserver
    global protocol
    global API_KEY

    # Objekt, dass versendet werden soll definieren
    data = {
        "event": event,
        "time": int(datetime.now().timestamp() * 1000),
        "location": camName,
    }

    # ZielURL und headers festlegen
    url = protocol + "://" + webserver + ":80/api/traffic/register"
    print(url)
    headers = {
        'content-type': 'application/json',
        "Auth": API_KEY
    }

    # Versuche das Event an den Webserver zu senden (try).
    # be fehlschlag, melde dies über die Kommandozeile
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data), timeout=0.25)
        print("[eventDispatcher] dispatched event:", event)
    except:
        print("[eventDispatcher] cant reach webserver")
