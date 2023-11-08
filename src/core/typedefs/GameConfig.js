/**
 * @typedef {object} Phaser.Types.Core.GameConfig
 * @since 3.0.0
 *
 * @property {(number|string)} [width=1024] - The width of the game, in game pixels.
 * @property {(number|string)} [height=768] - The height of the game, in game pixels.
 * @property {number} [zoom=1] - Simple scale applied to the game canvas. 2 is double size, 0.5 is half size, etc.
 * @property {number} [type=CONST.AUTO] - Which renderer to use. Phaser.AUTO, Phaser.CANVAS, Phaser.HEADLESS, or Phaser.WEBGL. AUTO picks WEBGL if available, otherwise CANVAS.
 * @property {(number|boolean)} [stableSort=-1] - `true` or `1` = Use the built-in StableSort (needed for older browsers), `false` or `0` = Rely on ES2019 Array.sort being stable (modern browsers only), or `-1` = Try and determine this automatically based on browser inspection (not guaranteed to work, errs on side of caution).
 * @property {(HTMLElement|string)} [parent=undefined] - The DOM element that will contain the game canvas, or its `id`. If undefined, or if the named element doesn't exist, the game canvas is appended to the document body. If `null` no parent will be used and you are responsible for adding the canvas to the dom.
 * @property {HTMLCanvasElement} [canvas=null] - Provide your own Canvas element for Phaser to use instead of creating one.
 * @property {string} [canvasStyle=null] - CSS styles to apply to the game canvas instead of Phasers default styles.
 * @property {boolean}[customEnvironment=false] - Is Phaser running under a custom (non-native web) environment? If so, set this to `true` to skip internal Feature detection. If `true` the `renderType` cannot be left as `AUTO`.
 * @property {CanvasRenderingContext2D} [context] - Provide your own Canvas Context for Phaser to use, instead of creating one.
 * @property {(Phaser.Types.Scenes.SceneType|Phaser.Types.Scenes.SceneType[])} [scene=null] - A scene or scenes to add to the game. If several are given, the first is started; the remainder are started only if they have `{ active: true }`. See the `sceneConfig` argument in `Phaser.Scenes.SceneManager#add`.
 * @property {string[]} [seed] - Seed for the random number generator.
 * @property {string} [title=''] - The title of the game. Shown in the browser console.
 * @property {string} [url='https://phaser.io'] - The URL of the game. Shown in the browser console.
 * @property {string} [version=''] - The version of the game. Shown in the browser console.
 * @property {boolean} [autoFocus=true] - Automatically call window.focus() when the game boots. Usually necessary to capture input events if the game is in a separate frame.
 * @property {(boolean|Phaser.Types.Core.InputConfig)} [input] - Input configuration, or `false` to disable all game input.
 * @property {boolean} [disableContextMenu=false] - Disable the browser's default 'contextmenu' event (usually triggered by a right-button mouse click).
 * @property {(boolean|Phaser.Types.Core.BannerConfig)} [banner=false] - Configuration for the banner printed in the browser console when the game starts.
 * @property {Phaser.Types.Core.DOMContainerConfig} [dom] - The DOM Container configuration object.
 * @property {Phaser.Types.Core.FPSConfig} [fps] - Game loop configuration.
 * @property {Phaser.Types.Core.RenderConfig} [render] - Game renderer configuration.
 * @property {Phaser.Types.Core.CallbacksConfig} [callbacks] - Optional callbacks to run before or after game boot.
 * @property {Phaser.Types.Core.LoaderConfig} [loader] - Loader configuration.
 * @property {Phaser.Types.Core.ImagesConfig} [images] - Images configuration.
 * @property {Phaser.Types.Core.PhysicsConfig} [physics] - Physics configuration.
 * @property {Phaser.Types.Core.PluginObject|Phaser.Types.Core.PluginObjectItem[]} [plugins] - Plugins to install.
 * @property {Phaser.Types.Core.ScaleConfig} [scale] - The Scale Manager configuration.
 * @property {Phaser.Types.Core.AudioConfig} [audio] - The Audio Configuration object.
 * @property {Phaser.Types.Core.PipelineConfig} [pipeline] - A WebGL Pipeline configuration object. Can also be part of the `RenderConfig`.
 * @property {(string|number)} [backgroundColor=0x000000] - The background color of the game canvas. The default is black.
 * @property {boolean} [antialias=true] - When set to `true`, WebGL uses linear interpolation to draw scaled or rotated textures, giving a smooth appearance. When set to `false`, WebGL uses nearest-neighbor interpolation, giving a crisper appearance. `false` also disables antialiasing of the game canvas itself, if the browser supports it, when the game canvas is scaled.
 * @property {boolean} [antialiasGL=true] - Sets the `antialias` property when the WebGL context is created. Setting this value does not impact any subsequent textures that are created, or the canvas style attributes.
 * @property {boolean} [desynchronized=false] - When set to `true` it will create a desynchronized context for both 2D and WebGL. See https://developers.google.com/web/updates/2019/05/desynchronized for details.
 * @property {boolean} [pixelArt=false] - Sets `antialias` to false and `roundPixels` to true. This is the best setting for pixel-art games.
 * @property {boolean} [roundPixels=false] - Draw texture-based Game Objects at only whole-integer positions. Game Objects without textures, like Graphics, ignore this property.
 * @property {boolean} [transparent=false] - Whether the game canvas will be transparent. Boolean that indicates if the canvas contains an alpha channel. If set to false, the browser now knows that the backdrop is always opaque, which can speed up drawing of transparent content and images.
 * @property {boolean} [clearBeforeRender=true] - Whether the game canvas will be cleared between each rendering frame.
 * @property {boolean} [preserveDrawingBuffer=false] - If the value is true the WebGL buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
 * @property {boolean} [premultipliedAlpha=true] - In WebGL mode, the drawing buffer contains colors with pre-multiplied alpha.
 * @property {boolean} [failIfMajorPerformanceCaveat=false] - Let the browser abort creating a WebGL context if it judges performance would be unacceptable.
 * @property {string} [powerPreference='default'] - "high-performance", "low-power" or "default". A hint to the browser on how much device power the game might use.
 * @property {number} [batchSize=4096] - The default WebGL batch size. Represents the number of _quads_ that can be added to a single batch.
 * @property {number} [maxLights=10] - The maximum number of lights allowed to be visible within range of a single Camera in the LightManager.
 * @property {number} [maxTextures=-1] - When in WebGL mode, this sets the maximum number of GPU Textures to use. The default, -1, will use all available units. The WebGL1 spec says all browsers should provide a minimum of 8.
 * @property {string} [mipmapFilter='LINEAR'] - The mipmap magFilter to be used when creating WebGL textures.
 * @property {boolean} [autoMobilePipeline=true] - Automatically enable the Mobile Pipeline if iOS or Android detected?
 * @property {string} [defaultPipeline='MultiPipeline'] - The WebGL Pipeline that Game Objects will use by default. Set to 'MultiPipeline' as standard.
 * @property {boolean} [expandParent=true] - Is the Scale Manager allowed to adjust the CSS height property of the parent and/or document body to be 100%?
 * @property {Phaser.Scale.ScaleModeType} [mode=Phaser.Scale.ScaleModes.NONE] - The scale mode.
 * @property {WidthHeight} [min] - The minimum width and height the canvas can be scaled down to.
 * @property {WidthHeight} [max] - The maximum width the canvas can be scaled up to.
 * @property {boolean} [autoRound=false] - Automatically round the display and style sizes of the canvas. This can help with performance in lower-powered devices.
 * @property {Phaser.Scale.CenterType} [autoCenter=Phaser.Scale.Center.NO_CENTER] - Automatically center the canvas within the parent?
 * @property {number} [resizeInterval=500] - How many ms should elapse before checking if the browser size has changed?
 * @property {?(HTMLElement|string)} [fullscreenTarget] - The DOM element that will be sent into full screen mode, or its `id`. If undefined Phaser will create its own div and insert the canvas into it when entering fullscreen mode.
 * @property {boolean} [disablePreFX=false] - Disables the automatic creation of the Pre FX Pipelines. If disabled, you cannot use the built-in Pre FX on Game Objects.
 * @property {boolean} [disablePostFX=false] - Disables the automatic creation of the Post FX Pipelines. If disabled, you cannot use the built-in Post FX on Game Objects.
 */
