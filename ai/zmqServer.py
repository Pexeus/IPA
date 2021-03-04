# imports zum empfangen des streams
import imagezmq

#ZMQ Socket Server starten
def initiateZMQ():
    imageHub = imagezmq.ImageHub()
    return imageHub

def recvZMQ(ZMQ):
    (camName, frame) = ZMQ.recv_image()
    ZMQ.send_reply(b'OK')

    return (camName, frame)

def closeZMQ(ZMQ):
    print("[INFO] closing imageZMQ")
    ZMQ.close()