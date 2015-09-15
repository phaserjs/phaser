/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* 
*
* @class Phaser.FrameDebugger
* @constructor
* @param {Phaser.Game} game - Reference to the currently running game.
*/
Phaser.FrameDebugger = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    this.on = false;

    //  Single frame
    this.frame = [];

    //  Then at the end of the frame we'll add it to the log
    this.log = [];

    this.count = 0;
    this.max = 1;

};

Phaser.FrameDebugger.prototype = {

    start: function () {

        this.frame = [Date.now()];

    },

    stop: function () {

        this.frame.push(Date.now());

        this.log.push(this.frame);

        this.count++;

        if (this.count === this.max)
        {
            this.finish();
        }

    },

    finish: function () {

        this.on = false;

        console.log(this.log);

        debugger;

    },

    record: function (max) {

        if (max === undefined) { max = 1; }
        if (this.on) { return; }

        this.reset();

        this.on = true;

        this.max = max;

    },

    reset: function () {

        this.frame = [];
        this.log = [];
        this.count = 0;
        this.max = 1;

    }

};