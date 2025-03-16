#!/bin/bash

# Directories for synchronization
SOURCE_DIR="$HOME/source_directory"
DEST_DIR="$HOME/destination_directory"

# File synchronization
rsync -av --delete "$SOURCE_DIR/" "$DEST_DIR/"
