/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
*
* @class Phaser.TilemapLayer
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {Phaser.Tilemap} tilemap - The tilemap to which this layer belongs.
* @param {integer} index - The index of the TileLayer to render within the Tilemap.
* @param {integer} width - Width of the renderable area of the layer (in pixels).
* @param {integer} height - Height of the renderable area of the layer (in pixels).
*/
Phaser.TilemapView = function (game, tilemap, index, width, height) {

    /**
    * A reference to the Phaser.Game instance.
    * 
    * @property {Phaser.Game} game
    */
    this.game = game;

    /**
    * A custom view.
    * 
    * @property {Phaser.Point} view
    */
    this.view = null;

    /**
    * An Array of any linked layers.
    * 
    * @property {Array} linkedLayers
    * @private
    */
    this.linkedLayers = [];
    
    /**
    * The Tilemap to which this layer is bound.
    * @property {Phaser.Tilemap} map
    * @protected
    * @readonly
    */
    this.map = tilemap;

    /**
    * The index of this layer within the Tilemap.
    * @property {number} index
    * @protected
    * @readonly
    */
    this.index = index;

    /**
    * The layer object within the Tilemap that this layer represents.
    * @property {object} layer
    * @protected
    * @readonly
    */
    this.layer = tilemap.layers[index];

    /**
    * The const type of this object.
    * @property {number} type
    * @readonly
    * @protected
    * @default Phaser.TILEMAPLAYER
    */
    this.type = Phaser.TILEMAPLAYER;

    /**
    * @property {number} physicsType - The const physics body type of this object.
    * @readonly
    */
    this.physicsType = Phaser.TILEMAPLAYER;

    /**
    * @property {boolean} exists - Controls if the core game loop and physics update this game object or not.
    */
    this.exists = true;

    /**
    * Speed at which this layer scrolls horizontally, relative to the camera (e.g. scrollFactorX of 0.5 scrolls half as quickly as the 'normal' camera-locked layers do).
    * @property {number} scrollFactorX
    * @public
    * @default
    */
    this.scrollFactor = new Phaser.Point(1, 1);

    /**
    * When ray-casting against tiles this is the number of steps it will jump. For larger tile sizes you can increase this to improve performance.
    * @property {integer} rayStepRate
    * @default
    */
    this.rayStepRate = 4;

    /**
    * If true tiles will be force rendered, even if such is not believed to be required.
    * @property {boolean} dirty
    * @protected
    */
    this.dirty = true;

    /**
    * @property {array} _results - Internal var.
    * @private
    */
    this._results = [];

};

Phaser.TilemapView.prototype.constructor = Phaser.TilemapView;

Phaser.TilemapView.prototype = {

    preUpdate: function () {

    },

    postUpdate: function () {

    },

    render: function () {

    },

    resize: function () {

    },

    resizeWorld: function () {

    },

    destroy: function () {

    }

};

