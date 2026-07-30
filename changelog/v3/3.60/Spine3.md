# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Spine 3 Bug Fixes

* Using `drawDebug` on a Spine Game Object to view its skeleton would cause the next object in the display list to be skipped for rendering, if it wasn't a Spine Game Object too. This is because the Spine 3 skeleton debug draw ends the spine batch but the Scene Renderer wasn't rebound. Fix #6380 (thanks @spayton)
* The Spine Plugin `add` and `make` functions didn't clear and rebind the WebGL pipeline. This could cause two different visual issues: The first is that a Phaser Game Object (such as a Sprite) could be seen to change its texture to display the Spine atlas texture instead for a single frame, and then on the next pass revert back to normal again. The second issue is that if the Spine skeleton wasn't added to the display list, but just created (via `addToScene: false`) then the Sprite would take on the texture frame entirely from that point on. Fix #6362 (thanks @frissonlabs)
* Previously, it wasn't possible for multiple Spine Atlases to use PNGs with the exact same filename, even if they were in different folders. The `SpineFile` loader has now been updated so that the always-unique Spine key is pre-pended to the filename, for example if the key was `bonus` and the PNG in the atlas was `coin.png` then the final key (as stored in the Texture Manager) is now `bonus:coin.png`. The `SpinePlugin.getAtlasCanvas` and `getAtlasWebGL` methods have been updated to reflect this change. Fix #6022 (thanks @orjandh)
* If a `SpineContainer` had a mask applied to it and the next immediate item on the display list was another Spine object (outside of the Container) then it would fail to rebind the WebGL pipeline, causing the mask to break. It will now rebind the renderer at the end of the SpineContainer batch, no matter what, if it has a mask. Fix #5627 (thanks @FloodGames)
* The Spine Plugin would not work with multiple instances of the same game on a single page. It now stores its renderer reference outside of the plugin, enabling this. Fix #5765 (thanks @xiamidaxia)
* Child Spine objects inside Containers wouldn't correctly inherit the parent Containers alpha. Fix #5853 (thanks @spayton)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
