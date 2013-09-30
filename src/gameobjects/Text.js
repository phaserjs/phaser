Phaser.Text = function (game, x, y, text, style) {

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

    this._text = text;
    this._style = style;

    PIXI.Text.call(this, text, style);

    this.type = Phaser.TEXT;

    this.position.x = this.x = x;
    this.position.y = this.y = y;

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

Phaser.Text.prototype = Object.create(PIXI.Text.prototype);
Phaser.Text.prototype.constructor = Phaser.Text;

// Automatically called by World.update
Phaser.Text.prototype.update = function() {

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

}

Object.defineProperty(Phaser.Text.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

Object.defineProperty(Phaser.Text.prototype, 'content', {

    get: function() {
        return this._text;
    },

    set: function(value) {

        //  Let's not update unless needed, this way we can safely update the text in a core loop without constant re-draws
        if (value !== this._text)
        {
            this._text = value;
            this.setText(value);
        }

    }

});

Object.defineProperty(Phaser.Text.prototype, 'font', {

    get: function() {
        return this._style;
    },

    set: function(value) {

        //  Let's not update unless needed, this way we can safely update the text in a core loop without constant re-draws
        if (value !== this._style)
        {
            this._style = value;
            this.setStyle(value);
        }

    }

});
