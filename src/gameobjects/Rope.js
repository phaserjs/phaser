/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd, Richard Davey
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Rope is a display object that has a repeating texture.
*
* The texture can be scrolled and scaled and will automatically wrap on the edges as it does so.
*
* Please note that Ropes, as with normal Sprites, have no input handler or physics bodies by default. Both need enabling.
* Example usage: https://github.com/codevinsky/phaser-rope-demo/blob/master/dist/demo.js
*
* @class Phaser.Rope
* @constructor
* @extends PIXI.Rope
* -- Google Closure Compiler and future jsdoc can use @implements instead of @extends
* @extends Phaser.GameObject.CoreMixin
* @extends Phaser.GameObject.CullingMixin
* @extends Phaser.GameObject.TextureMixin
* @extends Phaser.GameObject.InputMixin
* @extends Phaser.GameObject.EventsMixin
* @extends Phaser.GameObject.PhysicsMixin
* @extends Phaser.GameObject.LifeMixin
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in world space) to position the Rope at.
* @param {number} y - The y coordinate (in world space) to position the Rope at.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Rope during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Rope is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
* @param {Array} points - An array of {Phaser.Point}.
*/
Phaser.Rope = function (game, x, y, key, frame, points) {

    this.points = [];
    this.points = points;
    this._hasUpdateAnimation = false;
    this._updateAnimationCallback = null;
    x = x || 0;
    y = y || 0;
    key = key || null;
    frame = frame || null;

    PIXI.Rope.call(this, key, this.points);

    Phaser.GameObject.init.call(this, game);

    /**
    * @property {Phaser.Point} _scroll - Internal cache var.
    * @private
    */
    this._scroll = new Phaser.Point();

    this.position.set(x, y);
    this.world.setTo(x, y);

    this.loadTexture(key, frame);

};

Phaser.Rope.prototype = Object.create(PIXI.Rope.prototype);
Phaser.Rope.prototype.constructor = Phaser.Rope;
    
/**
* @property {number} type - The const type of this object.
* @readonly
* @default
*/
Phaser.Rope.prototype.type = Phaser.ROPE;

Phaser.GameObject.mix(Phaser.Rope.prototype, Phaser.GameObject.Traits.SPRITE_LIKE);

/**
* Automatically called by World.preUpdate.
*
* @method Phaser.Rope#preUpdate
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype.preUpdateImpl = function() {

    if (this._scroll.x !== 0)
    {
        this.tilePosition.x += this._scroll.x * this.game.time.physicsElapsed;
    }

    if (this._scroll.y !== 0)
    {
        this.tilePosition.y += this._scroll.y * this.game.time.physicsElapsed;
    }

};

/**
* Override and use this function in your own custom objects to handle any update requirements you may have.
*
* @method Phaser.Rope#update
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype.update = function() {

    if (this._hasUpdateAnimation)
    {
        this.updateAnimation.call(this);
    }

};

/**
* Play an animation based on the given key. The animation should previously have been added via sprite.animations.add()
* If the requested animation is already playing this request will be ignored. If you need to reset an already running animation do so directly on the Animation object itself.
*
* @method Phaser.Rope#play
* @memberof Phaser.Rope
* @param {string} name - The name of the animation to be played, e.g. "fire", "walk", "jump".
* @param {number} [frameRate=null] - The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
* @param {boolean} [loop=false] - Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
* @param {boolean} [killOnComplete=false] - If set to true when the animation completes (only happens if loop=false) the parent Sprite will be killed.
* @return {Phaser.Animation} A reference to playing Animation instance.
*/
Phaser.Rope.prototype.play = function (name, frameRate, loop, killOnComplete) {

    return this.animations.play(name, frameRate, loop, killOnComplete);

};

/**
* A Rope will call it's updateAnimation function on each update loop if it has one
*
* @name Phaser.Rope#updateAnimation
* @property {function} updateAnimation - Set to a function if you'd like the rope to animate during the update phase. Set to false or null to remove it.
*/
Object.defineProperty(Phaser.Rope.prototype, "updateAnimation", {

    get: function () {

        return this._updateAnimation;

    },

    set: function (value) {

        if(value && typeof value === 'function')
        {
            this._hasUpdateAnimation = true;
            this._updateAnimation = value;
        }
        else
        {
            this._hasUpdateAnimation = false;
            this._updateAnimation = null;
        }

    }

});

/**
* The segments that make up the rope body as an array of Phaser.Rectangles
*
* @name Phaser.Rope#segments
* @property {array} updateAnimation - Returns an array of Phaser.Rectangles that represent the segments of the given rope
*/
Object.defineProperty(Phaser.Rope.prototype, "segments", {

    get: function() {
        var segments = [];
        var index, x1, y1, x2, y2, width, height, rect;
        for(var i = 0; i < this.points.length; i++) {
            index = i * 4;
            x1 = this.verticies[index];
            y1 = this.verticies[index + 1];
            x2 = this.verticies[index + 4];
            y2 = this.verticies[index + 3];
            width = Phaser.Math.difference(x1,x2);
            height = Phaser.Math.difference(y1,y2);
            x1 += this.world.x;
            y1 += this.world.y;
            rect = new Phaser.Rectangle(x1,y1, width, height);
            segments.push(rect);
        }
        return segments;
    }

});
