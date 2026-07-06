[ -d apps/forge-desktop/build/forge-ide ] && rm -rf apps/forge-desktop/build/forge-ide
mkdir -p apps/forge-desktop/build
NX_DESKTOP_FROM_DIST=true node --max-old-space-size=4096 node_modules/.bin/nx build forge-ide --configuration=desktop
cp -r dist/apps/forge-ide apps/forge-desktop/build/forge-ide