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
    this.CANVAS_DOC_START = 10;
    this.CANVAS_DOC_STOP = 11;
    this.CANVAS_SPRITE_BATCH_START = 12;
    this.CANVAS_SPRITE_BATCH_RENDER_FAST = 13;
    this.CANVAS_SPRITE_BATCH_RENDER_SLOW = 14;
    this.CANVAS_SPRITE_BATCH_STOP = 15;
    this.CANVAS_RENDER_TILING_SPRITE = 16;
    this.GENERATE_TILING_TEXTURE = 17;
    this.GRAPHICS_GENERATE_CACHED_SPRITE_SLOW = 18;
    this.GRAPHICS_GENERATE_CACHED_SPRITE_FAST = 19;
    this.CANVAS_RENDER_GRAPHICS = 20;
    this.CANVAS_RENDER_GRAPHICS_CACHED = 21;
    this.CANVAS_GRAPHICS_START = 22;
    this.CANVAS_GRAPHICS_STOP = 23;
    this.CANVAS_GRAPHICS_POLY = 24;
    this.CANVAS_GRAPHICS_RECT = 25;
    this.CANVAS_GRAPHICS_CIRCLE = 26;
    this.CANVAS_GRAPHICS_ELIPSE = 27;
    this.CANVAS_GRAPHICS_ROUNDED_RECT = 28;

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

    cts: function (texture, width, height) {

        this.frame.push({
            type: this.CANVAS_RENDER_TILING_SPRITE,
            texture: texture,
            width: width,
            height: height
        });

    },

    gtt: function (texture, width, height) {

        this.frame.push({
            type: this.GENERATE_TILING_TEXTURE,
            texture: texture,
            width: width,
            height: height,
            time: Date.now()
        });

    },

    cgc: function () {

        this.frame.push({ type: this.CANVAS_RENDER_GRAPHICS_CACHED });

    },

    cg: function () {

        this.frame.push({ type: this.CANVAS_RENDER_GRAPHICS });

    },

    rgs: function () {

        this.frame.push({ type: this.CANVAS_GRAPHICS_START, time: Date.now() });

    },

    rgp: function () {

        this.frame.push({ type: this.CANVAS_GRAPHICS_STOP, time: Date.now() });

    },

    cgpoly: function (points) {

        this.frame.push({ type: this.CANVAS_GRAPHICS_POLY, time: Date.now(), points: points });

    },

    cgrect: function () {

        this.frame.push({ type: this.CANVAS_GRAPHICS_RECT, time: Date.now() });

    },

    cgcirc: function () {

        this.frame.push({ type: this.CANVAS_GRAPHICS_CIRCLE, time: Date.now() });

    },

    cgrrect: function () {

        this.frame.push({ type: this.CANVAS_GRAPHICS_ROUNDED_RECT, time: Date.now() });

    },

    cgelip: function () {

        this.frame.push({ type: this.CANVAS_GRAPHICS_ELIPSE, time: Date.now() });

    },

    cgcs1: function (texture, width, height) {

        this.frame.push({
            type: this.GRAPHICS_GENERATE_CACHED_SPRITE_SLOW,
            texture: texture,
            width: width,
            height: height,
            time: Date.now()
        });

    },

    cgcs2: function (texture, width, height) {

        this.frame.push({
            type: this.GRAPHICS_GENERATE_CACHED_SPRITE_FAST,
            texture: texture,
            width: width,
            height: height,
            time: Date.now()
        });

    },

    cb: function (mode) {

        this.frame.push({ type: this.CANVAS_BLENDMODE, mode: mode });

    },

    cdcs: function () {

        this.frame.push({ type: this.CANVAS_DOC_START, time: Date.now() });

    },

    cdcp: function () {

        this.frame.push({ type: this.CANVAS_DOC_STOP, time: Date.now() });

    },

    csbs: function () {

        this.frame.push({ type: this.CANVAS_SPRITE_BATCH_START, time: Date.now() });

    },

    csb1: function (texture, width, height, res) {

        this.frame.push({
            type: this.CANVAS_SPRITE_BATCH_RENDER_FAST,
            texture: texture,
            width: width,
            height: height,
            resolution: res
        });

    },

    csb2: function (texture, width, height, res) {

        this.frame.push({
            type: this.CANVAS_SPRITE_BATCH_RENDER_SLOW,
            texture: texture,
            width: width,
            height: height,
            resolution: res
        });

    },

    csbp: function () {

        this.frame.push({ type: this.CANVAS_SPRITE_BATCH_STOP, time: Date.now() });

    },

    ct: function (texture, width, height, res) {

        this.frame.push({
            type: this.CANVAS_RENDER_TEXT,
            texture: texture,
            width: width,
            height: height,
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
            width: width,
            height: height,
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

        var content = '<!DOCTYPE html>' +
        '<head><title>Display List Debugger Output</title>' +
        '<style>' +
        'body {' +
        ' background: #383838;' +
        ' color: #b4b4b4;' +
        ' font-family: sans-serif;' +
        ' font-size: 12px;' +
        '}' +
        'h1 {' +
        ' float: right;' +
        ' padding: 0;' +
        ' margin: 0;' +
        '}' +
        'h2 {' +
        ' margin-top: 32px;' +
        '}' +
        '.thumbs {' +
        ' float: right;' +
        ' width: 512px;' +
        ' height: 512px;' +
        ' border: 2px solid white;' +
        '}' +
        '.strip {' +
        ' background: #4a4a4a;' +
        ' padding: 16px 0px 16px 32px;' +
        '}' +
        'li:Hover {' +
        ' background: #3e5f96;' +
        ' color: #fff;' +
        '}' +
        '</style>' +
        '</head>' +
        '<body>' +
        '<h1>Display List Debugger</h1>' +
        '</body></html>';

        this.win.document.open('text/html', 'replace');
        this.win.document.write(content);
        this.win.document.close();

        var body = this.win.document.body;

        for (var f = 0; f < this.log.length; f++)
        {
            var pixels = 0;
            var frame = this.log[f];
            var textures = {};
            var total = 0;
            var primitives = 0;

            this.addTag(body, 'h2', 'Frame ' + f);

            // var thumbs = this.addTag(body, 'div', null, 'thumbs');

            this.addTag(body, 'p', 'Frame Start @ ' + frame[0].time);

            var root = this.addTag(body, 'ol', null, 'strip');
            var current = root;
            var stack = [root];

            for (var i = 1; i < frame.length - 1; i++)
            {
                var t = frame[i];

                switch (t.type)
                {
                    case this.UPDATE_TEXT:
                        this.addTag(current, 'li', 'Text.updateText @ ' + t.time);
                        break;

                    case this.GENERATE_TILING_TEXTURE:
                        this.addTag(current, 'li', 'Generate Tiling Texture @ ' + t.time);
                        break;

                    case this.CANVAS_BLENDMODE:
                        this.addTag(current, 'li', 'Set Blend Mode: ' + t.mode);
                        break;

                    case this.GRAPHICS_GENERATE_CACHED_SPRITE_FAST:
                        this.addTag(current, 'li', 'Graphics.Generate Cached Sprite (Fast) @ ' + t.time + '(' + t.width + ' x ' + t.height + ')');
                        break;

                    case this.GRAPHICS_GENERATE_CACHED_SPRITE_SLOW:
                        this.addTag(current, 'li', 'Graphics.Generate Cached Sprite (Slow) @ ' + t.time + '(' + t.width + ' x ' + t.height + ')');
                        break;

                    case this.CANVAS_DOC_START:
                        this.addTag(current, 'li', 'DisplayObjectContainer Start @ ' + t.time);
                        var current = this.addTag(current, 'ol');
                        stack.push(current);
                        break;

                    case this.CANVAS_DOC_STOP:
                        stack.pop();
                        current = stack[stack.length - 1];
                        this.addTag(current, 'li', 'DisplayObjectContainer Stop @ ' + t.time);
                        break;

                    case this.CANVAS_SPRITE_BATCH_START:
                        this.addTag(current, 'li', 'SpriteBatch Start @ ' + t.time);
                        var current = this.addTag(current, 'ol');
                        stack.push(current);
                        break;

                    case this.CANVAS_SPRITE_BATCH_RENDER_FAST:
                        this.addTag(current, 'li', 'Child (FastPath) (' + t.width + ' x ' + t.height + ')');
                        pixels += this.addTexture(t, textures);
                        total++;
                        break;

                    case this.CANVAS_SPRITE_BATCH_RENDER_SLOW:
                        this.addTag(current, 'li', 'Child (SlowPath) (' + t.width + ' x ' + t.height + ')');
                        pixels += this.addTexture(t, textures);
                        total++;
                        break;

                    case this.CANVAS_SPRITE_BATCH_STOP:
                        stack.pop();
                        current = stack[stack.length - 1];
                        this.addTag(current, 'li', 'SpriteBatch Stop @ ' + t.time);
                        break;

                    case this.CANVAS_RENDER_SPRITE:
                        this.addTag(current, 'li', 'Sprite (' + t.width + ' x ' + t.height + ')');
                        pixels += this.addTexture(t, textures);
                        total++;
                        break;

                    case this.CANVAS_RENDER_TEXT:
                        this.addTag(current, 'li', 'Text (' + t.width + ' x ' + t.height + ')');
                        pixels += this.addTexture(t, textures);
                        total++;
                        break;

                    case this.CANVAS_RENDER_TILING_SPRITE:
                        this.addTag(current, 'li', 'Tiling Sprite (' + t.width + ' x ' + t.height + ')');
                        pixels += this.addTexture(t, textures);
                        total++;
                        break;

                    case this.CANVAS_RENDER_GRAPHICS:
                        this.addTag(current, 'li', 'Graphics (Dynamic)');
                        break;

                    case this.CANVAS_RENDER_GRAPHICS_CACHED:
                        this.addTag(current, 'li', 'Graphics (Cached)');
                        break;

                    case this.CANVAS_GRAPHICS_START:
                        this.addTag(current, 'li', 'Render Graphics Start @ ' + t.time);
                        var current = this.addTag(current, 'ol');
                        stack.push(current);
                        break;

                    case this.CANVAS_GRAPHICS_POLY:
                        this.addTag(current, 'li', 'Polygon (' + t.points + ' points)');
                        primitives++;
                        break;

                    case this.CANVAS_GRAPHICS_RECT:
                        this.addTag(current, 'li', 'Rectangle');
                        primitives++;
                        break;

                    case this.CANVAS_GRAPHICS_CIRCLE:
                        this.addTag(current, 'li', 'Circle');
                        primitives++;
                        break;

                    case this.CANVAS_GRAPHICS_ROUNDED_RECT:
                        this.addTag(current, 'li', 'Rounded Rectangle');
                        primitives++;
                        break;

                    case this.CANVAS_GRAPHICS_ELIPSE:
                        this.addTag(current, 'li', 'Elipse');
                        primitives++;
                        break;

                    case this.CANVAS_GRAPHICS_STOP:
                        stack.pop();
                        current = stack[stack.length - 1];
                        this.addTag(current, 'li', 'Render Graphics Stop @ ' + t.time);
                        break;
                }
            }

            var t = frame[frame.length - 1];
            var duration = t.time - frame[0].time;
            this.addTag(body, 'p', 'Frame Stop @ ' + t.time);
            this.addTag(body, 'p', 'Frame Duration: ' + duration + 'ms');
            this.addTag(body, 'p', 'Total Objects Rendered: ' + total + ' (' + pixels + ' pixels)');
            this.addTag(body, 'p', 'Canvas Primitives Rendered: ' + primitives);
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

    addTag: function (parent, tag, content, className, style) {

        var e = this.win.document.createElement(tag);

        if (content)
        {
            e.textContent = content;
        }

        if (className)
        {
            e.className = className;
        }

        if (style)
        {
            e.style = style;
        }

        parent.appendChild(e);

        return e;

    }

};