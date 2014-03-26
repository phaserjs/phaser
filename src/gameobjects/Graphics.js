/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new `Graphics` object.
*
* @class Phaser.Graphics
* @constructor
*
* @param {Phaser.Game} game Current game instance.
* @param {number} x - X position of the new graphics object.
* @param {number} y - Y position of the new graphics object.
*/
Phaser.Graphics = function (game, x, y) {

    x = x || 0;
    y = y || 0;

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {boolean} exists - If exists = false then the Text isn't updated by the core game loop.
    * @default
    */
    this.exists = true;

    /**
    * @property {string} name - The user defined name given to this object.
    * @default
    */
    this.name = '';

    /**
    * @property {number} type - The const type of this object.
    * @default
    */
    this.type = Phaser.GRAPHICS;

    /**
    * @property {number} z - The z-depth value of this object within its Group (remember the World is a Group as well). No two objects in a Group can have the same z value.
    */
    this.z = 0;

    /**
    * @property {Phaser.Point} world - The world coordinates of this Sprite. This differs from the x/y coordinates which are relative to the Sprites container.
    */
    this.world = new Phaser.Point(x, y);

    /**
    * @property {Phaser.Point} cameraOffset - If this object is fixedToCamera then this stores the x/y offset that its drawn at, from the top-left of the camera view.
    */
    this.cameraOffset = new Phaser.Point();

    PIXI.Graphics.call(this);

    this.position.set(x, y);

    /**
    * A small internal cache:
    * 0 = previous position.x
    * 1 = previous position.y
    * 2 = previous rotation
    * 3 = renderID
    * 4 = fresh? (0 = no, 1 = yes)
    * 5 = outOfBoundsFired (0 = no, 1 = yes)
    * 6 = exists (0 = no, 1 = yes)
    * 7 = fixed to camera (0 = no, 1 = yes)
    * @property {Array} _cache
    * @private
    */
    this._cache = [ 0, 0, 0, 0, 1, 0, 1, 0 ];

};

Phaser.Graphics.prototype = Object.create(PIXI.Graphics.prototype);
Phaser.Graphics.prototype.constructor = Phaser.Graphics;

/**
* Automatically called by World.preUpdate.
* @method Phaser.Graphics.prototype.preUpdate
*/
Phaser.Graphics.prototype.preUpdate = function () {

    this._cache[0] = this.world.x;
    this._cache[1] = this.world.y;
    this._cache[2] = this.rotation;

    if (!this.exists || !this.parent.exists)
    {
        this.renderOrderID = -1;
        return false;
    }

    if (this.autoCull)
    {
        //  Won't get rendered but will still get its transform updated
        this.renderable = this.game.world.camera.screenView.intersects(this.getBounds());
    }

    this.world.setTo(this.game.camera.x + this.worldTransform[2], this.game.camera.y + this.worldTransform[5]);

    if (this.visible)
    {
        this._cache[3] = this.game.stage.currentRenderOrderID++;
    }

    return true;

};

/**
* Override and use this function in your own custom objects to handle any update requirements you may have.
*
* @method Phaser.Graphics#update
* @memberof Phaser.Graphics
*/
Phaser.Graphics.prototype.update = function() {

};

/**
* Automatically called by World.postUpdate.
* @method Phaser.Graphics.prototype.postUpdate
*/
Phaser.Graphics.prototype.postUpdate = function () {

    //  Fixed to Camera?
    if (this._cache[7] === 1)
    {
        this.position.x = (this.game.camera.view.x + this.cameraOffset.x) / this.game.camera.scale.x;
        this.position.y = (this.game.camera.view.y + this.cameraOffset.y) / this.game.camera.scale.y;
    }

};

/**
* Destroy this Graphics instance.
*
* @method Phaser.Graphics.prototype.destroy
* @param {boolean} [destroyChildren=true] - Should every child of this object have its destroy method called?
*/
Phaser.Graphics.prototype.destroy = function(destroyChildren) {

    if (typeof destroyChildren === 'undefined') { destroyChildren = true; }

    this.clear();

    if (this.parent)
    {
        if (this.parent instanceof Phaser.Group)
        {
            this.parent.remove(this);
        }
        else
        {
            this.parent.removeChild(this);
        }
    }

    var i = this.children.length;

    if (destroyChildren)
    {
        while (i--)
        {
            this.children[i].destroy(destroyChildren);
        }
    }
    else
    {
        while (i--)
        {
            this.removeChild(this.children[i]);
        }
    }

    this.exists = false;
    this.visible = false;

    this.game = null;

};

/*
* Draws a {Phaser.Polygon} or a {PIXI.Polygon} filled
*
* @method Phaser.Graphics.prototype.drawPolygon
*/
Phaser.Graphics.prototype.drawPolygon = function (poly) {

    this.moveTo(poly.points[0].x, poly.points[0].y);

    for (var i = 1; i < poly.points.length; i += 1)
    {
        this.lineTo(poly.points[i].x, poly.points[i].y);
    }

    this.lineTo(poly.points[0].x, poly.points[0].y);

};

/**
* Indicates the rotation of the Graphics, in degrees, from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
* If you wish to work in radians instead of degrees use the property Sprite.rotation instead.
* @name Phaser.Graphics#angle
* @property {number} angle - Gets or sets the angle of rotation in degrees.
*/
Object.defineProperty(Phaser.Graphics.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

/**
* An Graphics that is fixed to the camera uses its x/y coordinates as offsets from the top left of the camera. These are stored in Graphics.cameraOffset.
* Note that the cameraOffset values are in addition to any parent in the display list.
* So if this Graphics was in a Group that has x: 200, then this will be added to the cameraOffset.x
*
* @name Phaser.Graphics#fixedToCamera
* @property {boolean} fixedToCamera - Set to true to fix this Graphics to the Camera at its current world coordinates.
*/
Object.defineProperty(Phaser.Graphics.prototype, "fixedToCamera", {

    get: function () {

        return !!this._cache[7];

    },

    set: function (value) {

        if (value)
        {
            this._cache[7] = 1;
            this.cameraOffset.set(this.x, this.y);
        }
        else
        {
            this._cache[7] = 0;
        }
    }

});
