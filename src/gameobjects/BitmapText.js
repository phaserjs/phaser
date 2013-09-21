Phaser.BitmapText = function (game, x, y, text, style) {

    x = x || 0;
    y = y || 0;
    text = text || '';
    style = style || '';

    //  If exists = false then the Sprite isn't updated by the core game loop or physics subsystem at all
    this.exists = true;

    //  This is a handy little var your game can use to determine if a sprite is alive or not, it doesn't effect rendering
    this.alive = true;

    this.group = null;

    this.name = '';

    this.game = game;

    PIXI.BitmapText.call(this, text, style);

    this.type = Phaser.BITMAPTEXT;

    this.position.x = x;
    this.position.y = y;

    //  Replaces the PIXI.Point with a slightly more flexible one
    this.anchor = new Phaser.Point();
    this.scale = new Phaser.Point(1, 1);

    //  Influence of camera movement upon the position
    this.scrollFactor = new Phaser.Point(1, 1);

    //  A mini cache for storing all of the calculated values
    this._cache = { 

        dirty: false,

        //  Transform cache
        a00: 1, a01: 0, a02: x, a10: 0, a11: 1, a12: y, id: 1, 

        //  The previous calculated position inc. camera x/y and scrollFactor
        x: -1, y: -1,

        //  The actual scale values based on the worldTransform
        scaleX: 1, scaleY: 1

    };

    this._cache.x = this.x - (this.game.world.camera.x * this.scrollFactor.x);
    this._cache.y = this.y - (this.game.world.camera.y * this.scrollFactor.y);

    this.renderable = true;

};

Phaser.BitmapText.prototype = Object.create(PIXI.BitmapText.prototype);
// Phaser.BitmapText.prototype = Phaser.Utils.extend(true, PIXI.BitmapText.prototype);
Phaser.BitmapText.prototype.constructor = Phaser.BitmapText;

/**
 * Automatically called by World.update
 */
Phaser.BitmapText.prototype.update = function() {

    if (!this.exists)
    {
        return;
    }

    this._cache.dirty = false;

    this._cache.x = this.x - (this.game.world.camera.x * this.scrollFactor.x);
    this._cache.y = this.y - (this.game.world.camera.y * this.scrollFactor.y);

    if (this.position.x != this._cache.x || this.position.y != this._cache.y)
    {
        this.position.x = this._cache.x;
        this.position.y = this._cache.y;
        this._cache.dirty = true;
    }

    this.pivot.x = this.anchor.x*this.width;
    this.pivot.y = this.anchor.y*this.height;

}

Object.defineProperty(Phaser.BitmapText.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

Object.defineProperty(Phaser.BitmapText.prototype, 'x', {

    get: function() {
        return this.position.x;
    },

    set: function(value) {
        this.position.x = value;
    }

});

Object.defineProperty(Phaser.BitmapText.prototype, 'y', {

    get: function() {
        return this.position.y;
    },

    set: function(value) {
        this.position.y = value;
    }

});
