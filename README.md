
# IPA 2020
## Projektbeschrieb
Der Kandidat entwickelt ein videobasiertes Personenzählsystem welches für Zutrittsbeschränkungen bei Räumen oder Verkaufsläden verwendet werden kann. Als Kamera wird ein Raspberry Pi mit einem Camera Board verwendet. Der Videostream wird an einen Server weitergeleitet, welcher das Videomaterial auswertet und die gewonnenen Ergebnisse wie Quelle, Anzahl Eintritte und Anzahl Austritte an eine Webapplikation weiterleitet. Diese Node.js basierte Webapplikation speichert die Daten in einer MySQL-Datenbank und zeigt sie auf einer mit Vue.js erstellen Benutzeroberfläche an. Die Benutzeroberfläche bietet mindestens folgende Funktionen:

- Zutrittsampel (rot/grün)

- Aus dem Videostream gewonnene Echtzeitdaten

- Den Videostream selbst zu Kontroll- und Testzwecken

- Statistische Daten oder Auswertungen

- Konfiguration der Applikation, z.B. maximale Anzahl Besucher, Ladenfläche, Personen pro m^2, etc.

## Ordnerstruktur


| Verzeichnis            | Info                         |
| ------------------ | ---------------------------- |
| ai         | Code für AI Server (Ubuntu 20.04)              |
| cam       | Code für Raspberry Pi 3B, mit PiCam NoirV2 Cameara Modul            |
| web| Code für NodeJS Webserver,             |
