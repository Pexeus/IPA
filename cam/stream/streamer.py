# imports
from imutils.video import VideoStream, FileVideoStream
import imagezmq
import zmq
import argparse
import socket
import time
import cv2

# startargumente initialisieren
ap = argparse.ArgumentParser()
ap.add_argument("-s", "--server", required=True,
	help="ip address of the server to which the client will connect")
ap.add_argument("-i", "--input", required=False,
	help="ip address of the server to which the client will connect")
args = vars(ap.parse_args())

# timeout nach einem verbindungsabbruch festlegen, bis erneut versucht wird eine verbindung aufzubauen
restartTimeout = 2

# verbindungsaufbau zum ZMQ imageHub Socket Server
def connect(server_ip):
    # Der sender wird mit dem server/port initialisiert
    sender = imagezmq.ImageSender(connect_to="tcp://{}:5555".format(server_ip))
    print("initializing on", server_ip)

    # client konfigurieren
    sender.zmq_socket.setsockopt(zmq.LINGER, 0)
    sender.zmq_socket.setsockopt(zmq.RCVTIMEO, 2000) #maximales zeitbudget zur bestätigung vom server
    sender.zmq_socket.setsockopt(zmq.SNDTIMEO, 2000) #maximales zeitbudget zum senden

    return sender

sender = connect(args["server"])

# wurde ein input mitgegeben, so wird der videostream vom file gelesen, sonst wird direkt von der webcam gelesen
if args["input"] != None:
    print("[INFO] opening video file...")
    vs = FileVideoStream(args["input"]).start()
else:
    vs = VideoStream(usePiCamera=True, resolution=(320, 240)).start()

# Position aus dem hostname des Pis auslesen (für zukünfige implementationen)
locationName = socket.gethostname()

# "warmup" zeit für den Kamerasensor
time.sleep(2.0)
 
while True:
	# einen frame aus dem videostream auslesen
    frame = vs.read()
    # versuche den Frame inner halb des festgelegten timeout zum server zu senden, und die bestätigung zu halten
    # kommt es zu einem error, so wird die verbindung erneut aufgebaut
    try:
        sender.send_image(locationName, frame)
    except:
        print("cant reach server, reconnecting in", restartTimeout, "seconds")
        time.sleep(restartTimeout)
        sender = connect(args["server"])