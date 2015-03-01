/**
* AutoCull Component Features.
*
* @class
*/
Phaser.Component.AutoCull = function () {};

Phaser.Component.AutoCull.prototype = {

    /**
    * Should this Sprite be automatically culled if out of range of the camera?
    * A culled sprite has its renderable property set to 'false'.
    * Be advised this is quite an expensive operation, as it has to calculate the bounds of the object every frame, so only enable it if you really need it.
    *
    * @property {boolean} autoCull - A flag indicating if the Sprite should be automatically camera culled or not.
    * @default
    */
    autoCull: false,

    /**
    * Checks if the Sprite bounds are within the game camera, otherwise false if fully outside of it.
    *
    * @property {boolean} inCamera - True if the Sprite bounds is within the game camera, even if only partially. Otherwise false if fully outside of it.
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
