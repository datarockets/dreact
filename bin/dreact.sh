#!/bin/bash

# We pass local node_modules to resolve react stuff from hidden nextjs
NODE_PATH=$PWD/node_modules node node_modules/dreact/cli/index.js $@
