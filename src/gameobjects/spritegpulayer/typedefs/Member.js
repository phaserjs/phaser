/**
 * @typedef {object} Phaser.Types.GameObjects.SpriteGPULayer.Member
 * @since 4.0.0
 *
 * @property {number|Phaser.Types.GameObjects.SpriteGPULayer.MemberAnimation} x - The x position of the member.
 * @property {number|Phaser.Types.GameObjects.SpriteGPULayer.MemberAnimation} y - The y position of the member.
 * @property {number|Phaser.Types.GameObjects.SpriteGPULayer.MemberAnimation} rotation - The rotation of the member.
 * @property {number|Phaser.Types.GameObjects.SpriteGPULayer.MemberAnimation} scaleX - The x scale of the member.
 * @property {number|Phaser.Types.GameObjects.SpriteGPULayer.MemberAnimation} scaleY - The y scale of the member.
 * @property {number} originX - The X pivot of the frame. Default 0.5, in the range 0 to 1 across the frame. If the frame has a custom pivot, it will offset this value.
 * @property {number} originY - The Y pivot of the frame. Default 0.5, in the range 0 to 1 across the frame. If the frame has a custom pivot, it will offset this value.
 * @property {boolean} tintFill - Whether the member should be filled with the tint color. If false, the member texture will be multiplied by the tint. If true, the member will use the texture alpha and the tint color.
 * @property {number} creationTime - The time the member was created. This is measured from the initialization of `layer.timeElapsed`. Use this to control members added after the layer was created.
 * @property {number} scrollFactorX - The horizontal camera scroll factor of the member.
 * @property {number} scrollFactorY - The vertical camera scroll factor y of the member.
 * @property {string|number|{name: string}} frame - The frame of the member. You can pass a frame name, the index of the frame in its texture, or a `Phaser.Types.Textures.Frame` object. The frame must exist in the texture the member is using.
 * @property {string|number} [animation] - The animation to use. If not set, the member will use `frame` as a static texture.
 * @property {number|Phaser.Types.GameObjects.SpriteGPULayer.MemberAnimation} tintBlend - The tint blend mode of the member. 0 is no tint (equivalent to white), 1 is full tint. Use this to animate tint values, which are otherwise too complex to animate.
 * @property {number} tintBottomLeft - The bottom-left tint color of the member, as a 24-bit RGB value.
 * @property {number} tintTopLeft - The top-left tint color of the member, as a 24-bit RGB value.
 * @property {number} tintBottomRight - The bottom-right tint color of the member, as a 24-bit RGB value.
 * @property {number} tintTopRight - The top-right tint color of the member, as a 24-bit RGB value.
 * @property {number} alphaBottomLeft - The bottom-left alpha value of the member, in the range 0-1.
 * @property {number} alphaTopLeft - The top-left alpha value of the member, in the range 0-1.
 * @property {number} alphaBottomRight - The bottom-right alpha value of the member, in the range 0-1.
 * @property {number} alphaTopRight - The top-right alpha value of the member, in the range 0-1.
 * @property {number|Phaser.Types.GameObjects.SpriteGPULayer.MemberAnimation} alpha - The alpha value of the member, in the range 0-1. This multiplies all four corner alpha values, and can be animated.
 */
