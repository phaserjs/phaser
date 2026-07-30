# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## New Feature - Spector.js WebGL Debugger

![Spector.js WebGL Debugger](images/spectorjs.png)

The Debug build of Phaser, or a build with the `WEBGL_DEBUG` flag set in the Webpack Config, will now have a version of Spector.js included within it.

Spector.js is a WebGL inspector that allows for live inspection of your WebGL calls. Although it's easy to add the Spector extension to a desktop browsr, by embedding it in Phaser itself we can make it available in mobile browsers too, making it a powerful tool for debugging WebGL games on mobile devices where extensions are not permitted.

See https://github.com/BabylonJS/Spector.js for more details about using the interface.

You can call the following functions from your game code to control Spector:

* The `WebGLRenderer.captureFrame` method will capture the current WebGL frame and send it to the Spector.js tool for inspection.
* The `WebGLRenderer.captureNextFrame` method will capture the next WebGL frame and send it to the Spector.js tool for inspection.
* The `WebGLRenderer.getFps` method will return the current FPS of the WebGL canvas.
* The `WebGLRenderer.log` method adds a command with the name value in the list. This can be filtered in the search.
* The `WebGLRenderer.startCapture` method will start a capture on the Phaser canvas. The capture will stop once it reaches the number of commands specified as a parameter, or after 10 seconds. If quick capture is true, the thumbnails are not captured in order to speed up the capture.
* The `WebGLRenderer.stopCapture` method will stop the current capture and returns the result in JSON. It displays the result if the UI has been displayed. This returns undefined if the capture has not been completed or did not find any commands.

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
