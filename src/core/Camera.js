/**
* Phaser - Camera
*
* A Camera is your view into the game world. It has a position and size and renders only those objects within its field of view.
* The game automatically creates a single Stage sized camera on boot. Move the camera around the world with Phaser.Camera.x/y
*/

Phaser.Camera = function (game, id, x, y, width, height) {

	this.game = game;
	this.world = game.world;
	this.id = 0; // reserved for future multiple camera set-ups
	
	//  The view into the world we wish to render (by default the game dimensions)
	//  The x/y values are in world coordinates, not screen coordinates, the width/height is how many pixels to render
	//	Objects outside of this view are not rendered (unless set to ignore the Camera, i.e. UI?)
	this.view = new Phaser.Rectangle(x, y, width, height);
	
};

//	Consts
Phaser.Camera.FOLLOW_LOCKON = 0;
Phaser.Camera.FOLLOW_PLATFORMER = 1;
Phaser.Camera.FOLLOW_TOPDOWN = 2;
Phaser.Camera.FOLLOW_TOPDOWN_TIGHT = 3;

Phaser.Camera.prototype = {

    game: null,
    world: null,

    id: 0,

	/**
	* Camera view.
	* @type {Rectangle}
	*/
	view: null,

	/**
	* Sprite moving inside this Rectangle will not cause camera moving.
	* @type {Rectangle}
	*/
	deadzone: null,

	/**
	* Whether this camera is visible or not. (default is true)
	* @type {bool}
	*/
	visible: true,

	/**
	* If the camera is tracking a Sprite, this is a reference to it, otherwise null
	* @type {Sprite}
	*/
	target: null,

	/**
    * Tells this camera which sprite to follow.
    * @param target {Sprite} The object you want the camera to track. Set to null to not follow anything.
    * @param [style] {number} Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
    */
    follow: function (target, style) {

        if (typeof style === "undefined") { style = Phaser.Camera.FOLLOW_LOCKON; }

        this.target = target;

        var helper;

        switch (style) {

            case Phaser.Types.CAMERA_FOLLOW_PLATFORMER:
                var w = this.width / 8;
                var h = this.height / 3;
                this.deadzone = new Phaser.Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h);
                break;

            case Phaser.Types.CAMERA_FOLLOW_TOPDOWN:
                helper = Math.max(this.width, this.height) / 4;
                this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                break;

            case Phaser.Types.CAMERA_FOLLOW_TOPDOWN_TIGHT:
                helper = Math.max(this.width, this.height) / 8;
                this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                break;

            case Phaser.Types.CAMERA_FOLLOW_LOCKON:
            default:
                this.deadzone = null;
                break;
        }

    },

	/**
    * Move the camera focus to this location instantly.
    * @param x {number} X position.
    * @param y {number} Y position.
    */
    focusOnXY: function (x, y) {

        x += (x > 0) ? 0.0000001 : -0.0000001;
        y += (y > 0) ? 0.0000001 : -0.0000001;

        this.view.x = Math.round(x - this.view.halfWidth);
        this.view.y = Math.round(y - this.view.halfHeight);

    },

	/**
    * Update focusing and scrolling.
    */
    update: function () {

        // this.plugins.preUpdate();

        if (this.target !== null)
        {
            if (this.deadzone == null)
            {
                this.focusOnXY(this.target.x, this.target.y);
            }
            else
            {
                var edge;
                var targetX = this.target.x + ((this.target.x > 0) ? 0.0000001 : -0.0000001);
                var targetY = this.target.y + ((this.target.y > 0) ? 0.0000001 : -0.0000001);

                edge = targetX - this.deadzone.x;

                if (this.view.x > edge)
                {
                    this.view.x = edge;
                }

                edge = targetX + this.target.width - this.deadzone.x - this.deadzone.width;

                if (this.view.x < edge)
                {
                    this.view.x = edge;
                }

                edge = targetY - this.deadzone.y;

                if (this.view.y > edge)
                {
                    this.view.y = edge;
                }

                edge = targetY + this.target.height - this.deadzone.y - this.deadzone.height;

                if (this.view.y < edge)
                {
                    this.view.y = edge;
                }
            }
        }

        //  Make sure we didn't go outside the cameras worldBounds
        if (this.view.x < this.world.bounds.left)
        {
            this.view.x = this.world.bounds.left;
        }

        if (this.view.x > this.world.bounds.right - this.width)
        {
            this.view.x = (this.world.bounds.right - this.width) + 1;
        }

        if (this.view.y < this.world.bounds.top)
        {
            this.view.y = this.world.bounds.top;
        }

        if (this.view.y > this.world.bounds.bottom - this.height)
        {
            this.view.y = (this.world.bounds.bottom - this.height) + 1;
        }

        this.view.floor();

        // this.plugins.update();

    },

    setPosition: function (x, y) {

        this.view.x = x;
        this.view.y = y;

    },

    setSize: function (width, height) {

        this.view.width = width;
        this.view.height = height;

    }

};

Object.defineProperty(Phaser.Camera.prototype, "x", {

    get: function () {
        return this.view.x;
    },

    set: function (value) {
        this.view.x = value;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Camera.prototype, "y", {

    get: function () {
        return this.view.y;
    },

    set: function (value) {
        this.view.y = value;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Camera.prototype, "width", {

    get: function () {
        return this.view.width;
    },

    set: function (value) {
        this.view.width = value;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Camera.prototype, "height", {

    get: function () {
        return this.view.height;
    },

    set: function (value) {
        this.view.height = value;
    },

    enumerable: true,
    configurable: true
});
