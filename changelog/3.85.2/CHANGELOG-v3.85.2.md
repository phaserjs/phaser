# Version 3.85.2 - Itsuki - 17th September 2024



## Updates

* `WebGLRenderer.setExtensions` is a new method that queries the GL context to get the list of supported extensions. Which it then sets into the class properties. This method is called internally as part of the `init` and restore process.

## Bug Fixes

* When the WebGL context was restored it would incorrectly try to call `init.setupExtensions()` which didn't exist. It now calls the correct method, `WebGLRenderer.setExtensions`. Fix #6905 (thanks @RedRoosterMobile)