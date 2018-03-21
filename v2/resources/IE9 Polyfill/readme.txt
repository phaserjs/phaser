There are 2 polyfills in this folder:

ArrayBuffer and DataView support for IE9, required by P2 Physics.

You do not need this polyfill unless:

1) You are using P2 Physics in Phaser AND
2) You need to support IE9 specifically

Base64 Encoding and Decoding (adds window.atob and window.btoa support)

You only need this polyfill if you wish to load Base64 encoded Tile Map data in IE9, as exported by Tiled 0.13.0+


Ensure any polyfills are required before the Phaser library.
