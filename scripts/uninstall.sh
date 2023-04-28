# @Author: Evrard Vincent
# @Date:   2023-02-18 23:43:39
# @Last Modified by:   vincent evrard
# @Last Modified time: 2023-04-25 20:23:12


if [ $EUID != 0 ]; then
	sudo "$0" "$@"
	exit $?
fi


launchctl unload /Library/LaunchDaemons/com.cyclone.plist
sudo rm /usr/local/bin/cyclone;
sudo rm /usr/local/bin/xpc_set_event_stream_handler
sudo rm /Library/LaunchDaemons/com.cyclone.plist
killall "cyclone";