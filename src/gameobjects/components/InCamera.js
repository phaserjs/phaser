/**
* InCamera Component Features.
*
* @class
*/
Phaser.Component.InCamera = function () {};

Phaser.Component.InCamera.prototype = {

    /**
    * Checks if the Sprite bounds are within the game camera, otherwise false if fully outside of it.
    *
    * @property {boolean} inCamera - True if the Sprite bounds is within the game camera, even if only partially. Otherwise false if fully outside of it.
    * @readonly
    */
    inCamera: {

        get: function() {

            return this.game.world.camera.view.intersects(this._bounds);

        }

    }

};
