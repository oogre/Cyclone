# @Author: Evrard Vincent
# @Date:   2023-02-18 23:34:50
# @Last Modified by:   vincent evrard
# @Last Modified time: 2023-02-22 15:35:13

if [ $EUID != 0 ]; then
	echo "create cyclone directory"
	mkdir -p ~/Documents/cyclone;

	echo "copy configuration files"
	cp $(pwd)/config/conf.json ~/Documents/cyclone/conf.json;
	cp $(pwd)/config/base.mfs ~/Documents/cyclone/base.mfs;

	npm run build;

	sudo "$0" "$@"
	exit $?
fi

ln -s $(pwd)/release/index.js $(pwd)/release/cyclone;
sudo chmod 755 $(pwd)/release/cyclone;
ln -s $(pwd)/release/cyclone /usr/local/bin/cyclone;
ln -s $(pwd)/scripts/mac-device-connect-daemon/xpc_set_event_stream_handler /usr/local/bin/xpc_set_event_stream_handler;
sudo ln -s $(pwd)/scripts/mac-device-connect-daemon/com.cyclone.plist /Library/LaunchDaemons/com.cyclone.plist;
sudo chown root:wheel /Library/LaunchDaemons/com.cyclone.plist;
launchctl load /Library/LaunchDaemons/com.cyclone.plist;