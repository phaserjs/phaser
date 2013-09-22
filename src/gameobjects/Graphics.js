Phaser.Graphics = function (game, x, y) {

    PIXI.Graphics.call(this);

	Phaser.Sprite.call(this, game, x, y);

    this.type = Phaser.GRAPHICS;

};

Phaser.Graphics.prototype = Object.create(PIXI.Graphics.prototype);
Phaser.Graphics.prototype.constructor = Phaser.Graphics;
Phaser.Graphics.prototype = Phaser.Utils.extend(true, Phaser.Graphics.prototype, Phaser.Sprite.prototype);

//  Add our own custom methods

Object.defineProperty(Phaser.Graphics.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});
