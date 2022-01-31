#!/bin/bash

set -ex

BASEDIR="$(dirname "$0")"

cd "$BASEDIR"
npm run build
rm -rf new
mv dist new
tar -zcf teslausb-ui.tgz -C . --exclude="*.map" ./new
