Phaser.Component.BringToTop = function () {};

/**
* Brings the Sprite to the top of the display list it is a child of. Sprites that are members of a Phaser.Group are only
* bought to the top of that Group, not the entire display list.
*
* @method Phaser.Sprite#bringToTop
* @memberof Phaser.Sprite
* @return (Phaser.Sprite) This instance.
*/
Phaser.Component.BringToTop.prototype.bringToTop = function() {

    if (this.parent)
    {
        this.parent.bringToTop(this);
    }

    return this;

};

Phaser.Component.BringToTop.prototype.sendToBack = function() {

    if (this.parent)
    {
        this.parent.sendToBack(this);
    }

    return this;

};

/**
* Moves the given child up one place in this group unless it's already at the top.
*
* @method Phaser.Group#moveUp
* @return {any} The child that was moved.
*/
Phaser.Component.BringToTop.prototype.moveUp = function () {

    if (this.parent)
    {
        this.parent.moveUp(this);
    }

    return this;

};

/**
* Moves the given child down one place in this group unless it's already at the bottom.
*
* @method Phaser.Group#moveDown
* @return {any} The child that was moved.
*/
Phaser.Component.BringToTop.prototype.moveDown = function () {

    if (this.parent)
    {
        this.parent.moveDown(this);
    }

    return this;

};
