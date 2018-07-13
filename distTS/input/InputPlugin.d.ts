/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Circle: any;
declare var CircleContains: any;
declare var Class: any;
declare var CreateInteractiveObject: (gameObject: any, hitArea: any, hitAreaCallback: any) => {
    gameObject: any;
    enabled: boolean;
    draggable: boolean;
    dropZone: boolean;
    cursor: boolean;
    target: any;
    camera: any;
    hitArea: any;
    hitAreaCallback: any;
    localX: number;
    localY: number;
    dragState: number;
    dragStartX: number;
    dragStartY: number;
    dragX: number;
    dragY: number;
};
declare var CreatePixelPerfectHandler: (textureManager: any, alphaTolerance: any) => (hitArea: any, x: any, y: any, gameObject: any) => boolean;
declare var DistanceBetween: any;
declare var Ellipse: any;
declare var EllipseContains: any;
declare var EventEmitter: any;
declare var GetFastValue: any;
declare var InputPluginCache: any;
declare var IsPlainObject: any;
declare var PluginCache: any;
declare var Rectangle: any;
declare var RectangleContains: any;
declare var Triangle: any;
declare var TriangleContains: any;
/**
 * @classdesc
 * The Input Plugin belongs to a Scene and handles all input related events and operations for it.
 *
 * You can access it from within a Scene using `this.input`.
 *
 * It emits events directly. For example, you can do:
 *
 * ```javascript
 * this.input.on('pointerdown', callback, context);
 * ```
 *
 * To listen for a pointer down event anywhere on the game canvas.
 *
 * Game Objects can be enabled for input by calling their `setInteractive` method. After which they
 * will directly emit input events:
 *
 * ```javascript
 * var sprite = this.add.sprite(x, y, texture);
 * sprite.setInteractive();
 * sprite.on('pointerdown', callback, context);
 * ```
 *
 * Please see the Input examples and tutorials for more information.
 *
 * @class InputPlugin
 * @extends Phaser.Events.EventEmitter
 * @memberOf Phaser.Input
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that this Input Plugin is responsible for.
 */
declare var InputPlugin: any;
