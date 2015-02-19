Phaser.Component.FixedToCamera = function () {};

Phaser.Component.FixedToCamera.postUpdate = function () {

    if (this.fixedToCamera)
    {
        this.position.x = (this.game.camera.view.x + this.cameraOffset.x) / this.game.camera.scale.x;
        this.position.y = (this.game.camera.view.y + this.cameraOffset.y) / this.game.camera.scale.y;
    }

};

Phaser.Component.FixedToCamera.prototype = {

    /**
    * A Sprite that is fixed to the camera uses its x/y coordinates as offsets from the top left of the camera. These are stored in Sprite.cameraOffset.
    * Note that the cameraOffset values are in addition to any parent in the display list.
    * So if this Sprite was in a Group that has x: 200, then this will be added to the cameraOffset.x
    * Be careful not to set `fixedToCamera` on Game Objects which are in Groups that already have fixedToCamera enabled on them.
    * @property {boolean} fixedToCamera
    */
    fixedToCamera: false,

    /**
    * @property {Phaser.Point} cameraOffset - If this object is fixedToCamera then this stores the x/y offset that it is drawn at. Values are relative to the top-left of the camera view.
    */
    cameraOffset: new Phaser.Point()

};
