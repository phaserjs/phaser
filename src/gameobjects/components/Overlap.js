/**
* Overlap Component Features.
*
* @class
*/
Phaser.Component.Overlap = function () {};

Phaser.Component.Overlap.prototype = {

    /**
    * Checks to see if the bounds of this Sprite overlaps with the bounds of the given Display Object, which can be a Sprite, Image, TileSprite or anything that extends those such as a Button.
    * This check ignores the Sprites hitArea property and runs a Sprite.getBounds comparison on both objects to determine the result.
    * Therefore it's relatively expensive to use in large quantities (i.e. with lots of Sprites at a high frequency), but should be fine for low-volume testing where physics isn't required.
    *
    * @method
    * @param {Phaser.Sprite|Phaser.Image|Phaser.TileSprite|Phaser.Button|PIXI.DisplayObject} displayObject - The display object to check against.
    * @return {boolean} True if the bounds of this Sprite intersects at any point with the bounds of the given display object.
    */
    overlap: function (displayObject) {

        return Phaser.Rectangle.intersects(this.getBounds(), displayObject.getBounds());

    }

};
