# Path: /cam/stream/streamer.py
# Autors: Liam Benedetti
# Description: Acesses the Camera and streams data to the AI Server


from imutils.video import VideoStream, FileVideoStream
import imagezmq
import zmq
import argparse
import socket
import time
import cv2

# Set start arguments
ap = argparse.ArgumentParser()
ap.add_argument("-s", "--server", required=True,
	help="ip address of the server to which the client will connect")
ap.add_argument("-i", "--input", required=False,
	help="ip address of the server to which the client will connect")
args = vars(ap.parse_args())

# setting the timeout after a connection timeout
restartTimeout = 2

# connect to the remote imageHub and return the sender object
def connect(server_ip):
    # initiating the sender with URL, Port and Protocol
    sender = imagezmq.ImageSender(connect_to="tcp://{}:5555".format(server_ip))
    print("initializing on", server_ip)

    # configuraion the sender
    sender.zmq_socket.setsockopt(zmq.LINGER, 0)
    sender.zmq_socket.setsockopt(zmq.RCVTIMEO, 2000) # maximum time to get a ping back from the server
    sender.zmq_socket.setsockopt(zmq.SNDTIMEO, 2000) # maximum time to send the frame to the server

    return sender

sender = connect(args["server"])

# if there is an input specified, open the video file with the arg["input"] as path.
# if there is no input specified, use live video from /dev/video0
if args["input"] != None:
    print("[INFO] opening video file...")
    vs = FileVideoStream(args["input"]).start()
else:
    vs = VideoStream(usePiCamera=True, resolution=(500, 375)).start()

# get the hostname of the pi. this is mainly designed for multiple rooms
locationName = socket.gethostname()

# letting the camera sensor warm up
time.sleep(2.0)
 
while True:
	# read one frame out of the stream
    frame = vs.read()
    # try to send the frame over the sender object
    # if the timeout expires, an error gets thrown
    try:
        sender.send_image(locationName, frame)
    except:
        # infor the user and wait for the timeout
        print("cant reach server, reconnecting in", restartTimeout, "seconds")
        time.sleep(restartTimeout)
        # reinitialize the sender object. This is crucial to reconnect after being offline
        sender = connect(args["server"])