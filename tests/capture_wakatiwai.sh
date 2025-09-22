#!/usr/bin/env bash
set -euo pipefail

mkdir -p logs

# 1) Ermittle Interface und Server-IP
SERVER_IP=$(getent ahostsv4 lwm2m.os.1nce.com | awk 'NR==1{print $1}')
IFACE=$(ip route get 8.8.8.8 | awk '/dev/ {print $5; exit}')

echo "Bootstrap server: $SERVER_IP"
echo "Interface:        $IFACE"

# 2) Starte tcpdump für externen Verkehr
sudo tcpdump -i "$IFACE" -w logs/lwm2m-ext.pcapng \
  "udp and host $SERVER_IP and port 5683" &
TCPD_PID=$!
echo "tcpdump gestartet (PID=$TCPD_PID)"

# 3) Finde PID des wakatiwai-Clients (läuft von Node-RED gespawnt)
echo "Warte auf wakatiwai-Prozess..."
while ! APP_PID=$(pgrep -n -f wakatiwai) ; do sleep 1; done
echo "wakatiwai PID=$APP_PID"

# 4) Strace an den Client hängen, read/write aufzeichnen
sudo strace -f -tt -s 0 -xx -e trace=read,write \
  -p "$APP_PID" -o logs/ipc.log &
STR_PID=$!
echo "strace gestartet (PID=$STR_PID)"

echo
echo "=== Capturing läuft ==="
echo "Drücke ENTER zum Beenden..."
read -r _

# 5) Aufräumen
kill $STR_PID 2>/dev/null || true
sudo kill $TCPD_PID 2>/dev/null || true

echo "Fertig. Logs liegen in ./logs:"
ls -lh logs
