# Pfad: /ai/dispatcher.py
# Autoren: Liam Benedetti
# Beschreibung: Initiiert imageZMQ auf dem Port 5555 und gibt die empfangenen Videodaten an counter.py weiter

# imports zum empfangen des streams
import imagezmq

#ZMQ Socket Server starten
def initiateZMQ():
    imageHub = imagezmq.ImageHub()
    return imageHub

# Empfange einen Frame über ZMQ und gebe diesen als BGR Buffer zurück
# auch der "Ursprung" des Frames (wird vom raspberry mitgesendet) wird empfangen und zurückgegeben
def recvZMQ(ZMQ):
    (camName, frame) = ZMQ.recv_image()
    ZMQ.send_reply(b'OK')

    return (camName, frame)

# Das Socket, auf dem ZMQ auf Daten wartet, wird geschlossen. So werden keine Ports blockiert.
def closeZMQ(ZMQ):
    print("[INFO] closing imageZMQ")
    ZMQ.close()