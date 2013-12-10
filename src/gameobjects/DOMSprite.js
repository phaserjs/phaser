/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new DOMSprite.
* @class Phaser.DOMSprite
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {string} id - DOM ID.
* @param {number} x - X position of the new text object.
* @param {number} y - Y position of the new text object.
* @param {string} text - The actual text that will be written.
* @param {object} style - The style object containing style attributes like font, font size ,
*/
Phaser.DOMSprite = function (game, element, x, y, style) {

    x = x || 0;
    y = y || 0;
    style = style || '';

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
    * @property {boolean} alive - This is a handy little var your game can use to determine if an object is alive or not, it doesn't effect rendering.
    * @default
    */
    this.alive = true;

    /**
    * @property {Phaser.Group} group - The parent Group of this Text object.
    */
    this.group = null;

    /**
    * @property {string} name - The user defined name given to this object.
    * @default
    */
    this.name = '';

    /**
    * @property {number} type - The const type of this object.
    * @default
    */
    this.type = Phaser.DOMSPRITE;

    /**
    * @property {boolean} visible - Sets the visible state of this DOMSprite.
    * @default
    */
    this.visible = true;

    /*
    if (parent)
    {
        if (typeof parent === 'string')
        {
            // hopefully an element ID
            target = document.getElementById(parent);
        }
        else if (typeof parent === 'object' && parent.nodeType === 1)
        {
            // quick test for a HTMLelement
            target = parent;
        }

        if (overflowHidden)
        {
            target.style.overflow = 'hidden';
        }
    }
    */

};

// Phaser.DOMSprite.prototype = Object.create(PIXI.DOMSprite.prototype);
// Phaser.DOMSprite.prototype.constructor = Phaser.DOMSprite;
