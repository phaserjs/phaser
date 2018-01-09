/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The AutoCull Component is responsible for providing methods that check if a Game Object is within the bounds of the World Camera.
* It is used by the InWorld component.
*
* @class
*/
Phaser.Component.AutoCull = function () {};

Phaser.Component.AutoCull.prototype = {

    /**
    * A Game Object with `autoCull` set to true will check its bounds against the World Camera every frame.
    * If it is not intersecting the Camera bounds at any point then it has its `renderable` property set to `false`.
    * This keeps the Game Object alive and still processing updates, but forces it to skip the render step entirely.
    * 
    * This is a relatively expensive operation, especially if enabled on hundreds of Game Objects. So enable it only if you know it's required,
    * or you have tested performance and find it acceptable.
    *
    * @property {boolean} autoCull
    * @default
    */
    autoCull: false,

    /**
    * Checks if the Game Objects bounds intersect with the Game Camera bounds.
    * Returns `true` if they do, otherwise `false` if fully outside of the Cameras bounds.
    *
    * @property {boolean} inCamera
    * @readonly
    */
    inCamera: {

        get: function() {

            if (!this.autoCull && !this.checkWorldBounds)
            {
                this._bounds.copyFrom(this.getBounds());
                this._bounds.x += this.game.camera.view.x;
                this._bounds.y += this.game.camera.view.y;
            }

            return this.game.world.camera.view.intersects(this._bounds);

        }

    }

};
