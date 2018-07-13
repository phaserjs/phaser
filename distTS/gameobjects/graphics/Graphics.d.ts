/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Camera: any;
declare var Class: any;
declare var Commands: any;
declare var Components: any;
declare var Ellipse: any;
declare var GameObject: any;
declare var GetFastValue: any;
declare var GetValue: any;
declare var MATH_CONST: any;
declare var Render: any;
/**
 * Graphics line style (or stroke style) settings.
 *
 * @typedef {object} GraphicsLineStyle
 *
 * @property {number} [width] - The stroke width.
 * @property {number} [color] - The stroke color.
 * @property {number} [alpha] - The stroke alpha.
 */
/**
 * Graphics fill style settings.
 *
 * @typedef {object} GraphicsFillStyle
 *
 * @property {number} [color] - The fill color.
 * @property {number} [alpha] - The fill alpha.
 */
/**
 * Graphics style settings.
 *
 * @typedef {object} GraphicsStyles
 *
 * @property {GraphicsLineStyle} [lineStyle] - The style applied to shape outlines.
 * @property {GraphicsFillStyle} [fillStyle] - The style applied to shape areas.
 */
/**
 * Options for the Graphics game Object.
 *
 * @typedef {object} GraphicsOptions
 * @extends GraphicsStyles
 *
 * @property {number} [x] - The x coordinate of the Graphics.
 * @property {number} [y] - The y coordinate of the Graphics.
 */
/**
 * @classdesc
 * A Graphics object is a way to draw primitive shapes to you game. Primitives include forms of geometry, such as
 * Rectangles, Circles, and Polygons. They also include lines, arcs and curves. When you initially create a Graphics
 * object it will be empty.
 *
 * To draw to it you must first specify a line style or fill style (or both), draw shapes using paths, and finally
 * fill or stroke them. For example:
 *
 * ```javascript
 * graphics.lineStyle(5, 0xFF00FF, 1.0);
 * graphics.beginPath();
 * graphics.moveTo(100, 100);
 * graphics.lineTo(200, 200);
 * graphics.closePath();
 * graphics.strokePath();
 * ```
 *
 * There are also many helpful methods that draw and fill/stroke common shapes for you.
 *
 * ```javascript
 * graphics.lineStyle(5, 0xFF00FF, 1.0);
 * graphics.fillStyle(0xFFFFFF, 1.0);
 * graphics.fillRect(50, 50, 400, 200);
 * graphics.strokeRect(50, 50, 400, 200);
 * ```
 *
 * When a Graphics object is rendered it will render differently based on if the game is running under Canvas or WebGL.
 * Under Canvas it will use the HTML Canvas context drawing operations to draw the path.
 * Under WebGL the graphics data is decomposed into polygons. Both of these are expensive processes, especially with
 * complex shapes.
 *
 * If your Graphics object doesn't change much (or at all) once you've drawn your shape to it, then you will help
 * performance by calling {@link Phaser.GameObjects.Graphics#generateTexture}. This will 'bake' the Graphics object into
 * a Texture, and return it. You can then use this Texture for Sprites or other display objects. If your Graphics object
 * updates frequently then you should avoid doing this, as it will constantly generate new textures, which will consume
 * memory.
 *
 * As you can tell, Graphics objects are a bit of a trade-off. While they are extremely useful, you need to be careful
 * in their complexity and quantity of them in your game.
 *
 * @class Graphics
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Graphics object belongs.
 * @param {GraphicsOptions} [options] - Options that set the position and default style of this Graphics object.
 */
declare var Graphics: any;
