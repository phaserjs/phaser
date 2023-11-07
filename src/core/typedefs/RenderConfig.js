/**
 * @typedef {object} Phaser.Types.Core.RenderConfig
 * @since 3.0.0
 *
 * @property {boolean} [antialias=true] - When set to `true`, WebGL uses linear interpolation to draw scaled or rotated textures, giving a smooth appearance. When set to `false`, WebGL uses nearest-neighbor interpolation, giving a crisper appearance. `false` also disables antialiasing of the game canvas itself, if the browser supports it, when the game canvas is scaled.
 * @property {boolean} [antialiasGL=true] - Sets the `antialias` property when the WebGL context is created. Setting this value does not impact any subsequent textures that are created, or the canvas style attributes.
 * @property {boolean} [desynchronized=false] - When set to `true` it will create a desynchronized context for both 2D and WebGL. See https://developers.google.com/web/updates/2019/05/desynchronized for details.
 * @property {boolean} [pixelArt=false] - Sets `antialias` to false and `roundPixels` to true. This is the best setting for pixel-art games.
 * @property {boolean} [roundPixels=true] - Draw texture-based Game Objects at only whole-integer positions. Game Objects without textures, like Graphics, ignore this property.
 * @property {boolean} [transparent=false] - Whether the game canvas will be transparent. Boolean that indicates if the canvas contains an alpha channel. If set to false, the browser now knows that the backdrop is always opaque, which can speed up drawing of transparent content and images.
 * @property {boolean} [clearBeforeRender=true] - Whether the game canvas will be cleared between each rendering frame.
 * @property {boolean} [preserveDrawingBuffer=false] - If the value is true the WebGL buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
 * @property {boolean} [premultipliedAlpha=true] - In WebGL mode, the drawing buffer contains colors with pre-multiplied alpha.
 * @property {boolean} [failIfMajorPerformanceCaveat=false] - Let the browser abort creating a WebGL context if it judges performance would be unacceptable.
 * @property {string} [powerPreference='default'] - "high-performance", "low-power" or "default". A hint to the browser on how much device power the game might use.
 * @property {number} [batchSize=4096] - The default WebGL batch size. Represents the number of _quads_ that can be added to a single batch.
 * @property {number} [maxLights=10] - The maximum number of lights allowed to be visible within range of a single Camera in the LightManager.
 * @property {number} [maxTextures=-1] - When in WebGL mode, this sets the maximum number of GPU Textures to use. The default, -1, will use all available units. The WebGL1 spec says all browsers should provide a minimum of 8.
 * @property {string} [mipmapFilter=''] - The mipmap magFilter to be used when creating WebGL textures. Don't set unless you wish to create mipmaps. Set to one of the following: 'NEAREST', 'LINEAR', 'NEAREST_MIPMAP_NEAREST', 'LINEAR_MIPMAP_NEAREST', 'NEAREST_MIPMAP_LINEAR' or 'LINEAR_MIPMAP_LINEAR'.
 * @property {Phaser.Types.Core.PipelineConfig} [pipeline] - The WebGL Pipeline configuration object.
 * @property {boolean} [autoMobilePipeline=true] - Automatically enable the Mobile Pipeline if iOS or Android detected?
 * @property {string} [defaultPipeline='MultiPipeline'] - The WebGL Pipeline that Game Objects will use by default. Set to 'MultiPipeline' as standard.
 */
