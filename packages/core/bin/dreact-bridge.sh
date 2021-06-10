#!/bin/bash

set -e

export NODE_PATH=$PWD/node_modules:$PWD/node_modules/dreact/node_modules

command="node node_modules/dreact/bin/dreact.js ${@}"

eval $command
