/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Particle
*
* @classdesc Create a new `Particle` object. Particles are extended Sprites that are emitted by a particle emitter.
*
* @constructor
* @extends Phaser.Sprite
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.Particle = function (game, x, y, key, frame) {

    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.autoScale = false;
    this.scaleData = null;
    this._s = 0;

    this.autoAlpha = false;
    this.alphaData = null;
    this._a = 0;

};

Phaser.Particle.prototype = Object.create(Phaser.Sprite.prototype);
Phaser.Particle.prototype.constructor = Phaser.Particle;

/**
* Override and use this function in your own custom objects to handle any update requirements you may have.
*
* @method Phaser.Particle#update
* @memberof Phaser.Particle
*/
Phaser.Particle.prototype.update = function() {

    if (this.autoScale)
    {
        this._s--;

        if (this._s)
        {
            this.scale.set(this.scaleData[this._s].v);
        }
        else
        {
            this.autoScale = false;
        }
    }

    if (this.autoAlpha)
    {
        this._a--;

        if (this._a)
        {
            this.alpha = this.alphaData[this._a].v;
        }
        else
        {
            this.autoAlpha = false;
        }
    }

};

Phaser.Particle.prototype.onEmit = function() {
};

Phaser.Particle.prototype.setAlphaData = function(data) {

    this.alphaData = data;
    this._a = data.length - 1;
    this.alpha = this.alphaData[this._a].v;
    this.autoAlpha = true;

};

Phaser.Particle.prototype.setScaleData = function(data) {

    this.scaleData = data;
    this._s = data.length - 1;
    this.scale.set(this.scaleData[this._s].v);
    this.autoScale = true;

};

/**
* Resets the Particle. This places the Particle at the given x/y world coordinates and then
* sets alive, exists, visible and renderable all to true. Also resets the outOfBounds state and health values.
* If the Particle has a physics body that too is reset.
*
* @method Phaser.Particle#reset
* @memberof Phaser.Particle
* @param {number} x - The x coordinate (in world space) to position the Particle at.
* @param {number} y - The y coordinate (in world space) to position the Particle at.
* @param {number} [health=1] - The health to give the Particle.
* @return (Phaser.Particle) This instance.
*/
Phaser.Particle.prototype.reset = function(x, y, health) {

    if (typeof health === 'undefined') { health = 1; }

    this.world.setTo(x, y);
    this.position.x = x;
    this.position.y = y;
    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.renderable = true;
    this._outOfBoundsFired = false;

    this.health = health;

    if (this.body)
    {
        this.body.reset(x, y, false, false);
    }

    this._cache[4] = 1;

    this.autoScale = false;
    this.autoAlpha = false;

    return this;

};
