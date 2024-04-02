# @Author: Evrard Vincent
# @Date:   2023-02-18 23:34:50
# @Last Modified by:   vincent evrard
# @Last Modified time: 2024-04-02 19:34:57

if [ $EUID != 0 ]; then
	echo "create MFT directory"
	mkdir -p ~/Documents/MFT;

	echo "copy configuration files"
	cp $(pwd)/config/conf.json ~/Documents/MFT/conf.json;
	cp $(pwd)/config/base.mfs ~/Documents/MFT/base.mfs;

	npm run build;

	sudo "$0" "$@"
	exit $?
fi

ln -s $(pwd)/release/index.js $(pwd)/release/MFT;
sudo chmod 755 $(pwd)/release/MFT;
ln -s $(pwd)/release/MFT /usr/local/bin/MFT;
# ln -s $(pwd)/scripts/mac-device-connect-daemon/xpc_set_event_stream_handler /usr/local/bin/xpc_set_event_stream_handler;
# sudo ln -s $(pwd)/scripts/mac-device-connect-daemon/com.cyclone.plist /Library/LaunchDaemons/com.cyclone.plist;
# sudo chown root:wheel /Library/LaunchDaemons/com.cyclone.plist;
# launchctl load /Library/LaunchDaemons/com.cyclone.plist;