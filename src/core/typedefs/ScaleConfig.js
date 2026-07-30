/**
 * @typedef {object} Phaser.Types.Core.ScaleConfig
 * @since 3.16.0
 *
 * @property {(number|string)} [width=1024] - The base width of your game. Can be an integer or a string: '100%'. If a string it will only work if you have set a parent element that has a size.
 * @property {(number|string)} [height=768] - The base height of your game. Can be an integer or a string: '100%'. If a string it will only work if you have set a parent element that has a size.
 * @property {(Phaser.Scale.ZoomType|number)} [zoom=1] - The zoom value of the game canvas.
 * @property {?(HTMLElement|string)} [parent] - The DOM element that will contain the game canvas, or its `id`. If undefined, or if the named element doesn't exist, the game canvas is inserted directly into the document body. If `null` no parent will be used and you are responsible for adding the canvas to your environment.
 * @property {boolean} [expandParent=true] - Is the Scale Manager allowed to adjust the CSS height property of the parent and/or document body to be 100%?
 * @property {Phaser.Scale.ScaleModeType} [mode=Phaser.Scale.ScaleModes.NONE] - The scale mode.
 * @property {WidthHeight} [min] - The minimum width and height the canvas can be scaled down to.
 * @property {WidthHeight} [max] - The maximum width the canvas can be scaled up to.
 * @property {WidthHeight} [snap] - Set the snapping values used by the Scale Manager when resizing the canvas. See `ScaleManager.setSnap` for details.
 * @property {boolean} [autoRound=false] - Automatically round the display and style sizes of the canvas. This can help with performance in lower-powered devices.
 * @property {Phaser.Scale.CenterType} [autoCenter=Phaser.Scale.Center.NO_CENTER] - Automatically center the canvas within the parent?
 * @property {number} [resizeInterval=500] - How many ms should elapse before checking if the browser size has changed?
 * @property {?(HTMLElement|string)} [fullscreenTarget] - The DOM element that will be sent into full screen mode, or its `id`. If undefined Phaser will create its own div and insert the canvas into it when entering fullscreen mode.
 */
