# @Author: Evrard Vincent
# @Date:   2023-02-15 14:03:27
# @Last Modified by:   vincent evrard
# @Last Modified time: 2024-03-20 22:08:43



npx babel --verbose --out-dir ./release/ ./src/

rm ./release/MFT
ln -s ./index.js ./release/MFT
chmod +x ./release/index.js