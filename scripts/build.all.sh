# @Author: Evrard Vincent
# @Date:   2023-02-15 14:03:27
# @Last Modified by:   vincent evrard
# @Last Modified time: 2023-02-22 14:55:22



npx babel --verbose --out-dir ./release/ ./src/

rm ./release/cyclone
ln -s ./index.js ./release/cyclone
chmod +x ./release/index.js