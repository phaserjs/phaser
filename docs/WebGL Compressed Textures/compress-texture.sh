#!/bin/bash

# This script compresses textures using PVRTexToolCLI.
# It takes a filename as an argument and creates compressed textures
# in formats recommended by Phaser 4.
# An optional second argument determines whether to use .exe on Windows systems.

# Usage: ./compress-texture.sh <filename> [use_exe]

# Ensure a filename is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <filename> [use_exe]"
    echo "Please provide a filename to compress."
    exit 1
fi

# Check the second argument.
if [ "$2" == "use_exe" ]; then
    PVRTexToolCLI="PVRTexToolCLI.exe"
    identify="identify.exe"
else
    PVRTexToolCLI="PVRTexToolCLI"
    identify="identify"
fi

# Failure boilerplate.
function fail {
    echo "Compression failed. If you are using Windows, try running with 'use_exe' argument."
    echo "Example: ./compress-texture.sh <filename> use_exe"
    echo "If you are using a POSIX system, ensure that the PVRTexToolCLI is installed and accessible."
    exit 1
}

# Set input path
INPUT="./$1"

# Compress the output file using PVRTexToolCLI
# Strip the extension from the input filename
OUTPUT="${1%.*}"

# Determine input resolution.
INPUT_RESOLUTION=$("$identify" -format "%w,%h" "$INPUT")
INPUT_WIDTH=$("$identify" -format "%w" "$INPUT")
INPUT_HEIGHT=$("$identify" -format "%h" "$INPUT")

# Determine whether resolution is a multiple of 4, and if so, set the output resolution to the next multiple of 4.
if [ "$(echo "$INPUT_WIDTH % 4" | bc)" -eq 0 ] && [ "$(echo "$INPUT_HEIGHT % 4" | bc)" -eq 0 ]; then
    OUTPUT_RESOLUTION=$INPUT_RESOLUTION
else
    OUTPUT_WIDTH=$(echo "(($INPUT_WIDTH + 3) / 4) * 4" | bc)
    OUTPUT_HEIGHT=$(echo "(($INPUT_HEIGHT + 3) / 4) * 4" | bc)
    OUTPUT_RESOLUTION="$OUTPUT_WIDTH,$OUTPUT_HEIGHT"
fi
echo "Input resolution: $INPUT_RESOLUTION"
echo "Output resolution: $OUTPUT_RESOLUTION"

# Explanation of chosen parameters:
# -i: Input file
# -o: Output file
# -p: Premultiply alpha
# -flip y,flag: Flip the image vertically
# -ics lRGB: Input color space is linear RGB
# -f: Format to convert to
# -q: Quality setting
# -potcanvas +: Ensure the output is a power of two canvas, larger if necessary

# Create BC3 (S3TC) compressed texture
# Ensure the output resolution is a multiple of 4.
BC3_OUTPUT="./$OUTPUT-S3TC-BC3-lRGB.pvr"
"$PVRTexToolCLI" -i "$INPUT" -o "$BC3_OUTPUT" -p -flip y,flag -ics lRGB -f BC3 -rcanvas "$OUTPUT_RESOLUTION" || fail

# Create PVRTC compressed texture
# Ensure the output is a power of two canvas, larger if necessary
PVRTC_OUTPUT="./$OUTPUT-PVRTC-4BPP-lRGB.pvr"
"$PVRTexToolCLI" -i "$INPUT" -o "$PVRTC_OUTPUT" -p -flip y,flag -ics lRGB -f PVRTCI_4BPP_RGBA -q pvrtcbest -potcanvas + || fail

# Create ETC2 compressed texture
ETC2_OUTPUT="./$OUTPUT-ETC2-lRGB.pvr"
"$PVRTexToolCLI" -i "$INPUT" -o "$ETC2_OUTPUT" -p -flip y,flag -ics lRGB -f ETC2_RGBA -q etcslow || fail

# Create ASTC compressed texture
ASTC_OUTPUT="./$OUTPUT-ASTC-4x4-lRGB.pvr"
"$PVRTexToolCLI" -i "$INPUT" -o "$ASTC_OUTPUT" -p -flip y,flag -ics lRGB -f ASTC_4x4 -q astcexhaustive || fail
