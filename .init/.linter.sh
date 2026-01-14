#!/bin/bash
cd /home/kavia/workspace/code-generation/hello-world-location-and-weather-dashboard-228752-228763/hello_frontend
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

