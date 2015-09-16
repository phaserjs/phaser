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

    this.skipNext = false;

    //  Single frame
    this.frame = [];

    //  Then at the end of the frame we'll add it to the log
    this.log = [];

    this.count = 0;
    this.max = 1;

    //  Consts
    this.START = 0;
    this.STOP = 1;
    this.CANVAS_CLEAR = 2;
    this.CANVAS_BLENDMODE = 3;
    this.CANVAS_MASK_PUSH = 4;
    this.CANVAS_MASK_POP = 5;
    this.CANVAS_RENDER_SPRITE = 6;
    this.CANVAS_RENDER_TEXT = 7;
    this.CANVAS_RENDER_BITMAPTEXT = 8;
    this.UPDATE_TEXT = 9;

};


Phaser.FrameDebugger.prototype = {

    //  Called at the start of Game.updateRender
    start: function () {

        this.frame = [{ type: this.START, time: Date.now() }];

    },

    //  Called at the end of Game.updateRender
    stop: function () {

        this.frame.push({ type: this.STOP, time: Date.now() });

        this.log.push(this.frame);

        this.count++;

        if (this.count === this.max)
        {
            this.finish();
        }

    },

    cr: function () {

        this.frame.push({ type: this.CANVAS_CLEAR });

    },

    tu: function () {

        this.frame.push({ type: this.UPDATE_TEXT, time: Date.now() });

    },

    cb: function (mode) {

        this.frame.push({ type: this.CANVAS_BLENDMODE, mode: mode });

    },

    ct: function (texture, width, height, res) {

        this.frame.push({ 
            type: this.CANVAS_RENDER_TEXT, 
            texture: texture, 
            width: width, height: height, 
            resolution: res
        });

        this.skipNext = true;

    },

    cs: function (texture, width, height, res) {

        if (this.skipNext)
        {
            this.skipNext = false;
            return;
        }

        this.frame.push({ 
            type: this.CANVAS_RENDER_SPRITE, 
            texture: texture, 
            width: width, height: height, 
            resolution: res
        });

    },

    cm: function (mask) {

        this.frame.push({ type: this.CANVAS_MASK_PUSH, mask: mask });

    },

    cmo: function () {

        this.frame.push({ type: this.CANVAS_MASK_POP });

    },

    record: function (max) {

        if (max === undefined) { max = 1; }
        if (this.on) { return; }

        this.reset();

        this.on = true;

        // this.max = max;
        this.max = 1;

    },

    reset: function () {

        this.frame = [];
        this.log = [];
        this.count = 0;
        this.max = 1;

    },

    //  Called at the end of Game.updateRender if count = max
    finish: function () {

        console.log(this.log);

        this.on = false;

        this.win = window.open('about:blank', 'FrameDebugger');

        var content = '<!DOCTYPE html>'
        + '<head><title>FrameDebugger Output</title>'
        + '<style>'
        + 'body {'
        + ' background: #383838;'
        + ' color: #b4b4b4;'
        + ' font-family: sans-serif;'
        + ' font-size: 12px;'
        + '}'
        + 'h2 {'
        + ' margin-top: 32px;'
        + '}'
        + '.strip {'
        + ' background: #4a4a4a;'
        + ' padding: 16px 0px 16px 48px;'
        + '}'
        + '</style>'
        + '</head>'
        + '<body>'
        + '<h1>FrameDebugger</h1>';
        + '</body></html>';

        this.win.document.open('text/html', 'replace');
        this.win.document.write(content);
        this.win.document.close();

        var body = this.win.document.body;

        for (var f = 0; f < this.log.length; f++)
        {
            var pixels = 0;
            var frame = this.log[f];
            var textures = {};

            this.addTag(body, 'h2', 'Frame ' + f);
            
            this.addTag(body, 'p', 'Frame Start @ ' + frame[0].time);

            var box = this.addTag(body, 'ol', null, 'strip');

            //  Count sprite batch changes
            //  Add in TilingSprite, Graphics, etc

            for (var i = 1; i < frame.length - 1; i++)
            {
                var t = frame[i];

                switch (t.type)
                {
                    case this.UPDATE_TEXT:
                        this.addTag(box, 'li', 'Text.updateText @ ' + t.time);
                        break;

                    case this.CANVAS_RENDER_SPRITE:
                        this.addTag(box, 'li', 'Sprite (' + t.width + ' x ' + t.height + ')');
                        pixels += this.addTexture(t, textures);
                        break;

                    case this.CANVAS_RENDER_TEXT:
                        this.addTag(box, 'li', 'Text (' + t.width + ' x ' + t.height + ')');
                        pixels += this.addTexture(t, textures);
                        break;
                }
            }

            var t = frame[frame.length - 1];
            var duration = t.time - frame[0].time;
            this.addTag(body, 'p', 'Frame Stop @ ' + t.time);
            this.addTag(body, 'p', 'Frame Duration: ' + duration + 'ms');
            this.addTag(body, 'p', 'Total pixels rendered: ' + pixels);
            this.addTag(body, 'p', 'Unique Textures:');

            var textureList = this.addTag(body, 'ol');

            for (var single in textures)
            {
                this.addTag(textureList, 'li', single + ' - Times Used: ' + textures[single]);
            }

        }

    },

    addTexture: function (t, textures) {

        var txt = t.texture.baseTexture.source.src;

        if (txt === undefined)
        {
            //  It's a canvas
            txt = t.texture.baseTexture.source._pixiId;
        }

        if (textures.hasOwnProperty(txt))
        {
            textures[txt]++;
        }
        else
        {
            textures[txt] = 1;
        }

        return t.width * t.height;

    },

    addImg: function (parent, img) {

        parent.appendChild(img.cloneNode(true));

    },

    addTag: function (parent, tag, content, style) {

        var e = this.win.document.createElement(tag);

        if (content)
        {
            e.textContent = content;
        }

        if (style)
        {
            e.className = style;
        }

        parent.appendChild(e);

        return e;

    }

};