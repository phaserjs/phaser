Phaser.Graphics = function (game, x, y) {

    PIXI.Graphics.call(this);

	Phaser.Sprite.call(this, game, x, y);

    this.type = Phaser.GRAPHICS;

};

Phaser.Graphics.prototype = Object.create( PIXI.Graphics.prototype );
Phaser.Graphics.prototype.constructor = Phaser.Graphics;

Phaser.Graphics.prototype = Phaser.Utils.extend(true, Phaser.Graphics.prototype, Phaser.Sprite.prototype);

//  Add our own custom methods

/**
 * Automatically called by World.update
 */
Phaser.Graphics.prototype.OLDupdate = function() {

    // if (!this.exists)
    // {
    //     return;
    // }

    // this._cache.dirty = false;

    // this._cache.x = this.x - (this.game.world.camera.x * this.scrollFactor.x);
    // this._cache.y = this.y - (this.game.world.camera.y * this.scrollFactor.y);

    // if (this.position.x != this._cache.x || this.position.y != this._cache.y)
    // {
    //     this.position.x = this._cache.x;
    //     this.position.y = this._cache.y;
    //     this._cache.dirty = true;
    // }

}

/*
Object.defineProperty(Phaser.Graphics.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

Object.defineProperty(Phaser.Graphics.prototype, 'x', {

    get: function() {
        return this.position.x;
    },

    set: function(value) {
        this.position.x = value;
    }

});

Object.defineProperty(Phaser.Graphics.prototype, 'y', {

    get: function() {
        return this.position.y;
    },

    set: function(value) {
        this.position.y = value;
    }

});

*/
