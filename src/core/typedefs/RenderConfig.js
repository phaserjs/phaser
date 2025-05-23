/**
 * @typedef {object} Phaser.Types.Core.RenderConfig
 * @since 3.0.0
 *
 * @property {boolean} [antialias=true] - When set to `true`, WebGL uses linear interpolation to draw scaled or rotated textures, giving a smooth appearance. When set to `false`, WebGL uses nearest-neighbor interpolation, giving a crisper appearance. `false` also disables antialiasing of the game canvas itself, if the browser supports it, when the game canvas is scaled.
 * @property {boolean} [antialiasGL=true] - Sets the `antialias` property when the WebGL context is created. Setting this value does not impact any subsequent textures that are created, or the canvas style attributes.
 * @property {boolean} [desynchronized=false] - When set to `true` it will create a desynchronized context for both 2D and WebGL. See https://developers.google.com/web/updates/2019/05/desynchronized for details.
 * @property {boolean} [pixelArt=false] - Sets `antialias` to false and `roundPixels` to true. This is the best setting for pixel-art games.
 * @property {boolean} [smoothPixelArt=false] - WebGL only. Sets `antialias` to true and `pixelArt` to false. Texture-based Game Objects use special shader setting that preserve blocky pixels, but smooth the edges between the pixels. This is only visible when objects are scaled up; otherwise, `antialias` is simpler.
 * @property {boolean} [roundPixels=false] - Draw texture-based Game Objects at only whole-integer positions. Game Objects without textures, like Graphics, ignore this property.
 * @property {boolean} [selfShadow=false] - On textured objects with lighting, this enables self-shadowing based on the diffuse map.
 * @property {number} [pathDetailThreshold=1] - Threshold for combining points into a single path in the WebGL renderer for Graphics objects. This can be overridden at the Graphics object level.
 * @property {boolean} [transparent=false] - Whether the game canvas will be transparent. Boolean that indicates if the canvas contains an alpha channel. If set to false, the browser now knows that the backdrop is always opaque, which can speed up drawing of transparent content and images.
 * @property {boolean} [clearBeforeRender=true] - Whether the game canvas will be cleared between each rendering frame.
 * @property {boolean} [preserveDrawingBuffer=false] - If the value is true the WebGL buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
 * @property {boolean} [premultipliedAlpha=true] - In WebGL mode, the drawing buffer contains colors with pre-multiplied alpha.
 * @property {boolean} [skipUnreadyShaders=false] - Avert stuttering during shader compilation, by enabling parallel shader compilation, where supported. Objects which request a shader that is not yet ready will not be drawn. This prevents stutter, but may cause "pop-in" of objects unless you use a pre-touch strategy.
 * @property {boolean} [failIfMajorPerformanceCaveat=false] - Let the browser abort creating a WebGL context if it judges performance would be unacceptable.
 * @property {string} [powerPreference='default'] - "high-performance", "low-power" or "default". A hint to the browser on how much device power the game might use.
 * @property {number} [batchSize=16384] - The default WebGL batch size. Represents the number of _quads_ that can be added to a single batch.
 * @property {number} [maxLights=10] - The maximum number of lights allowed to be visible within range of a single Camera in the LightManager.
 * @property {number} [maxTextures=-1] - When in WebGL mode, this sets the maximum number of GPU Textures to use. The default, -1, will use all available units. The WebGL1 spec says all browsers should provide a minimum of 8.
 * @property {string} [mipmapFilter=''] - The mipmap magFilter to be used when creating WebGL textures. Don't set unless you wish to create mipmaps. Set to one of the following: 'NEAREST', 'LINEAR', 'NEAREST_MIPMAP_NEAREST', 'LINEAR_MIPMAP_NEAREST', 'NEAREST_MIPMAP_LINEAR' or 'LINEAR_MIPMAP_LINEAR'.
 * @property {boolean} [autoMobileTextures=true] - If iOS or Android detected, automatically restrict WebGL to use 1 texture per batch. This can help performance on some devices.
 * @property {Object<Phaser.Types.Core.RenderNodesConfig>} [renderNodes] - A map of custom Render Nodes to be added to the WebGL Renderer. The values will be added to the RenderNodeManager, using the keys as the names.
 */
