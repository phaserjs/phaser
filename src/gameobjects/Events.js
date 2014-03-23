/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Events
*
* @classdesc The Events component is a collection of events fired by the parent game object.
*
* For example to tell when a Sprite has been added to a new group:
*
* `sprite.events.onAddedToGroup.add(yourFunction, this);`
*
* Where `yourFunction` is the function you want called when this event occurs.
*
* Note that the Input related events only exist if the Sprite has had `inputEnabled` set to `true`.
*
* @constructor
*
* @param {Phaser.Sprite} sprite - A reference to Description.
*/
Phaser.Events = function (sprite) {

    this.parent = sprite;

    this.onAddedToGroup = new Phaser.Signal();
    this.onRemovedFromGroup = new Phaser.Signal();
    this.onKilled = new Phaser.Signal();
    this.onRevived = new Phaser.Signal();
    this.onOutOfBounds = new Phaser.Signal();
    this.onEnterBounds = new Phaser.Signal();

    this.onInputOver = null;
    this.onInputOut = null;
    this.onInputDown = null;
    this.onInputUp = null;
    this.onDragStart = null;
    this.onDragStop = null;

    this.onAnimationStart = null;
    this.onAnimationComplete = null;
    this.onAnimationLoop = null;

};

Phaser.Events.prototype = {

    destroy: function () {

        this.parent = null;
        this.onAddedToGroup.dispose();
        this.onRemovedFromGroup.dispose();
        this.onKilled.dispose();
        this.onRevived.dispose();
        this.onOutOfBounds.dispose();

        if (this.onInputOver)
        {
            this.onInputOver.dispose();
            this.onInputOut.dispose();
            this.onInputDown.dispose();
            this.onInputUp.dispose();
            this.onDragStart.dispose();
            this.onDragStop.dispose();
        }

        if (this.onAnimationStart)
        {
            this.onAnimationStart.dispose();
            this.onAnimationComplete.dispose();
            this.onAnimationLoop.dispose();
        }

    }

};

Phaser.Events.prototype.constructor = Phaser.Events;
