/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var Components: any;
declare var CONST: {
    VERSION: string;
    BlendModes: any;
    ScaleModes: any;
    AUTO: number;
    CANVAS: number;
    WEBGL: number;
    HEADLESS: number;
    FOREVER: number;
    NONE: number;
    UP: number;
    DOWN: number;
    LEFT: number;
    RIGHT: number;
};
declare var GameObject: any;
declare var StaticTilemapLayerRender: any;
declare var TilemapComponents: any;
declare var Utils: any;
/**
 * @classdesc
 * A StaticTilemapLayer is a game object that renders LayerData from a Tilemap. A
 * StaticTilemapLayer can only render tiles from a single tileset.
 *
 * A StaticTilemapLayer is optimized for speed over flexibility. You cannot apply per-tile
 * effects like tint or alpha. You cannot change the tiles in a StaticTilemapLayer. Use this
 * over a DynamicTilemapLayer when you don't need either of those features.
 *
 * @class StaticTilemapLayer
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {Phaser.Tilemaps.Tilemap} tilemap - The Tilemap this layer is a part of.
 * @param {integer} layerIndex - The index of the LayerData associated with this layer.
 * @param {Phaser.Tilemaps.Tileset} tileset - The tileset used to render the tiles in this layer.
 * @param {number} [x=0] - The world x position where the top left of this layer will be placed.
 * @param {number} [y=0] - The world y position where the top left of this layer will be placed.
 */
declare var StaticTilemapLayer: any;
