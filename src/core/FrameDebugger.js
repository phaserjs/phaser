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

    //  Called at the start of Game.updateRender
    start: function () {

        this.frame = [Date.now()];

    },

    //  Called at the end of Game.updateRender
    stop: function () {

        this.frame.push(Date.now());

        this.log.push(this.frame);

        this.count++;

        if (this.count === this.max)
        {
            this.finish();
        }

    },

    cr: function () {

        this.frame.push('Canvas.Render');

    },

    cb: function (mode) {

        this.frame.push('Set Blend Mode', mode);

    },

    cs: function (texture, width, height, res) {

        this.frame.push('Sprite.Render', texture, width, height, res);

    },

    cm: function (mask) {

        this.frame.push('Mask Push', mask);

    },

    cmo: function () {

        this.frame.push('Mask Pop', Date.now());

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

    },

    //  Called at the end of Game.updateRender if count = max
    finish: function () {

        this.on = false;

        this.win = window.open('about:blank', 'FrameDebugger');

        //  Add a title and a little css
        this.win.document.title = 'FrameDebugger Output';

        var head = this.win.document.head.style;

        head.backgroundColor = '#383838';
        head.fontFamily = 'sans';
        head.fontSize = '14px';
        head.color = '#b4b4b4';

        var body = this.win.document.body;

        var h1 = document.createElement('h1');
        h1.textContent = 'FrameDebugger Output';

        body.appendChild(h1);

        for (var f = 0; f < this.log.length; f++)
        {
            var h = document.createElement('p');
            h.textContent = "Frame " + f;
            body.appendChild(h);

            for (var i = 0; i < this.log[f].length; i++)
            {
                var t = document.createElement('p');
                t.textContent = this.log[f][i];
                body.appendChild(t);
            }
        }

        // console.log(this.log);
        // debugger;

    }

};