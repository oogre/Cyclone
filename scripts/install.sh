# @Author: Evrard Vincent
# @Date:   2023-02-18 23:34:50
# @Last Modified by:   vincent evrard
# @Last Modified time: 2023-02-19 00:02:35

npm run build;

if [ $EUID != 0 ]; then
	sudo "$0" "$@"
	exit $?
fi


ln -s $(pwd)/release/index.js $(pwd)/release/TWISTER;
sudo chmod 755 $(pwd)/release/TWISTER
ln -s $(pwd)/release/TWISTER /usr/local/bin/TWISTER;
ln -s $(pwd)/scripts/mac-device-connect-daemon/xpc_set_event_stream_handler /usr/local/bin/xpc_set_event_stream_handler
sudo ln -s $(pwd)/scripts/mac-device-connect-daemon/com.midiFighterTwister.plist /Library/LaunchDaemons/com.midiFighterTwister.plist
chown root:wheel /Library/LaunchDaemons/com.midiFighterTwister.plist
launchctl load /Library/LaunchDaemons/com.midiFighterTwister.plist

