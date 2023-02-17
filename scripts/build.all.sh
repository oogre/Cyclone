# @Author: Evrard Vincent
# @Date:   2023-02-15 14:03:27
# @Last Modified by:   ogre
# @Last Modified time: 2023-02-15 14:05:07



npx babel --verbose --out-dir ./release/ ./src/

rm ./release/TWISTER
ln -s ./index.js ./release/TWISTER
chmod +x ./release/index.js