/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The FixedToCamera component enables a Game Object to be rendered relative to the game camera coordinates, regardless 
* of where in the world the camera is. This is used for things like sticking game UI to the camera that scrolls as it moves around the world.
*
* @class
*/
Phaser.Component.FixedToCamera = function () {};

/**
 * The FixedToCamera component postUpdate handler.
 * Called automatically by the Game Object.
 *
 * @method
 */
Phaser.Component.FixedToCamera.postUpdate = function () {

    if (this.fixedToCamera)
    {
        this.position.x = (this.game.camera.view.x + this.cameraOffset.x) / this.game.camera.scale.x;
        this.position.y = (this.game.camera.view.y + this.cameraOffset.y) / this.game.camera.scale.y;
    }

};

Phaser.Component.FixedToCamera.prototype = {

    /**
    * @property {boolean} _fixedToCamera
    * @private
    */
    _fixedToCamera: false,

    /**
    * A Game Object that is "fixed" to the camera uses its x/y coordinates as offsets from the top left of the camera during rendering.
    * 
    * The values are adjusted at the rendering stage, overriding the Game Objects actual world position.
    * 
    * The end result is that the Game Object will appear to be 'fixed' to the camera, regardless of where in the game world
    * the camera is viewing. This is useful if for example this Game Object is a UI item that you wish to be visible at all times 
    * regardless where in the world the camera is.
    * 
    * The offsets are stored in the `cameraOffset` property.
    * 
    * Note that the `cameraOffset` values are in addition to any parent of this Game Object on the display list.
    *
    * Be careful not to set `fixedToCamera` on Game Objects which are in Groups that already have `fixedToCamera` enabled on them.
    *
    * @property {boolean} fixedToCamera
    */
    fixedToCamera: {

        get: function () {

            return this._fixedToCamera;

        },

        set: function (value) {

            if (value)
            {
                this._fixedToCamera = true;
                this.cameraOffset.set(this.x, this.y);
            }
            else
            {
                this._fixedToCamera = false;
            }

        }

    },

    /**
    * The x/y coordinate offset applied to the top-left of the camera that this Game Object will be drawn at if `fixedToCamera` is true.
    * 
    * The values are relative to the top-left of the camera view and in addition to any parent of the Game Object on the display list.
    * @property {Phaser.Point} cameraOffset
    */
    cameraOffset: new Phaser.Point()

};
