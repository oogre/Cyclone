# @Author: Evrard Vincent
# @Date:   2023-02-18 23:43:39
# @Last Modified by:   vincent evrard
# @Last Modified time: 2023-02-18 23:58:22


if [ $EUID != 0 ]; then
	sudo "$0" "$@"
	exit $?
fi

killall "Midi_Fighter_Twister";
launchctl unload /Library/LaunchDaemons/com.midiFighterTwister.plist
sudo rm /usr/local/bin/TWISTER;
sudo rm /usr/local/bin/xpc_set_event_stream_handler
sudo rm /Library/LaunchDaemons/com.midiFighterTwister.plist
