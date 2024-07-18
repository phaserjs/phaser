/**
 * @typedef {object} Phaser.Types.GameObjects.ImageGPULayer.Member
 * @since 3.90.0
 *
 * @property {number|Phaser.Types.GameObjects.ImageGPULayer.MemberAnimation} x - The x position of the member.
 * @property {number|Phaser.Types.GameObjects.ImageGPULayer.MemberAnimation} y - The y position of the member.
 * @property {number|Phaser.Types.GameObjects.ImageGPULayer.MemberAnimation} rotation - The rotation of the member.
 * @property {number|Phaser.Types.GameObjects.ImageGPULayer.MemberAnimation} scaleX - The x scale of the member.
 * @property {number|Phaser.Types.GameObjects.ImageGPULayer.MemberAnimation} scaleY - The y scale of the member.
 * @property {number} originX - The originX of the member (0-1).
 * @property {number} originY - The originY of the member (0-1).
 * @property {boolean} tintFill - Whether the member should be filled with the tint color. If false, the member texture will be multiplied by the tint. If true, the member will use the texture alpha and the tint color.
 * @property {number|Phaser.Types.GameObjects.ImageGPULayer.MemberAnimation} scrollFactorX - The horizontal camera scroll factor of the member.
 * @property {number|Phaser.Types.GameObjects.ImageGPULayer.MemberAnimation} scrollFactorY - The vertical camera scroll factor y of the member.
 * @property {{u0: number, v0: number, u1: number, v1: number}} frame - The frame of the member. You can pass a `Phaser.Types.Textures.Frame` object or an object with `u0`, `v0`, `u1`, and `v1` properties.
 * @property {number|Phaser.Types.GameObjects.ImageGPULayer.MemberAnimation} tintBlend - The tint blend mode of the member. 0 is no tint (equivalent to white), 1 is full tint. Use this to animate tint values, which are otherwise too complex to animate.
 * @property {number} tintBottomLeft - The bottom-left tint color of the member, as a 24-bit RGB value.
 * @property {number} tintTopLeft - The top-left tint color of the member, as a 24-bit RGB value.
 * @property {number} tintBottomRight - The bottom-right tint color of the member, as a 24-bit RGB value.
 * @property {number} tintTopRight - The top-right tint color of the member, as a 24-bit RGB value.
 * @property {number} alphaBottomLeft - The bottom-left alpha value of the member, in the range 0-1.
 * @property {number} alphaTopLeft - The top-left alpha value of the member, in the range 0-1.
 * @property {number} alphaBottomRight - The bottom-right alpha value of the member, in the range 0-1.
 * @property {number} alphaTopRight - The top-right alpha value of the member, in the range 0-1.
 * @property {number|Phaser.Types.GameObjects.ImageGPULayer.MemberAnimation} alpha - The alpha value of the member, in the range 0-1. This multiplies all four corner alpha values, and can be animated.
 */
