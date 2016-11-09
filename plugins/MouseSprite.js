/**
 * Replaces the mouse cursor with a sprite
 * @param {object} game   The game object
 * @param {parent} parent The parent object
 */
Phaser.Plugin.MouseSprite = function (game, parent) {
    Phaser.Plugin.call(this, game, parent);
    // sets the game element's cursor style to none
    document.getElementById(game.parent).style.cursor = 'none';

    // setup the mouse listener
    this.game.input.mouse.mouseMoveCallback = this.updateLocation;
    this.game.input.mouse.callbackContext = this;
};

//  Extends the Phaser.Plugin template, setting up values we need
Phaser.Plugin.MouseSprite.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.MouseSprite.prototype.constructor = Phaser.Plugin.MouseSprite;

/**
* Set a Sprite reference to this Plugin.
* @type {Phaser.Sprite}
*/
Phaser.Plugin.MouseSprite.prototype.setSprite = function(sprite) {
    this.sprite = sprite;
    this.sprite.anchor.setTo(0.5, 0.5);
};

/**
* This is run when a mouseMove event is detected
*/
Phaser.Plugin.MouseSprite.prototype.updateLocation = function() {
    this.sprite.x = this.game.input.mouse.x;
    this.sprite.y = this.game.input.mouse.y;
};
