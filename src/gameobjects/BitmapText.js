/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* BitmapText objects work by taking a texture file and an XML file that describes the font structure.
* It then generates a new Sprite object for each letter of the text, proportionally spaced out and aligned to 
* match the font structure.
* 
* BitmapText objects are less flexible than Text objects, in that they have less features such as shadows, fills and the ability 
* to use Web Fonts. However you trade this flexibility for pure rendering speed. You can also create visually compelling BitmapTexts by 
* processing the font texture in an image editor first, applying fills and any other effects required.
*
* To create multi-line text insert \r, \n or \r\n escape codes into the text string.
*
* To create a BitmapText data files you can use:
*
* BMFont (Windows, free): http://www.angelcode.com/products/bmfont/
* Glyph Designer (OS X, commercial): http://www.71squared.com/en/glyphdesigner
* Littera (Web-based, free): http://kvazars.com/littera/
*
* @class Phaser.BitmapText
* @constructor
* @extends PIXI.DisplayObjectContainer
* @extends Phaser.Component.Core
* @extends Phaser.Component.Angle
* @extends Phaser.Component.AutoCull
* @extends Phaser.Component.Bounds
* @extends Phaser.Component.Destroy
* @extends Phaser.Component.FixedToCamera
* @extends Phaser.Component.InputEnabled
* @extends Phaser.Component.InWorld
* @extends Phaser.Component.LifeSpan
* @extends Phaser.Component.PhysicsBody
* @extends Phaser.Component.Reset
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - X coordinate to display the BitmapText object at.
* @param {number} y - Y coordinate to display the BitmapText object at.
* @param {string} font - The key of the BitmapText as stored in Phaser.Cache.
* @param {string} [text=''] - The text that will be rendered. This can also be set later via BitmapText.text.
* @param {number} [size=32] - The size the font will be rendered at in pixels.
* @param {string} [align='left'] - The alignment of multi-line text. Has no effect if there is only one line of text.
*/
Phaser.BitmapText = function (game, x, y, font, text, size, align) {

    x = x || 0;
    y = y || 0;
    font = font || '';
    text = text || '';
    size = size || 32;
    align = align || 'left';

    PIXI.DisplayObjectContainer.call(this);

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.BITMAPTEXT;

    /**
    * @property {number} physicsType - The const physics body type of this object.
    * @readonly
    */
    this.physicsType = Phaser.SPRITE;

    /**
    * @property {number} textWidth - The width in pixels of the overall text area, taking into consideration multi-line text.
    * @readOnly
    */
    this.textWidth = 0;

    /**
    * @property {number} textHeight - The height in pixels of the overall text area, taking into consideration multi-line text.
    * @readOnly
    */
    this.textHeight = 0;

    /**
    * @property {Phaser.Point} anchor - The anchor value of this BitmapText.
    */
    this.anchor = new Phaser.Point();

    /**
    * @property {Phaser.Point} _prevAnchor - The previous anchor value.
    * @private
    */
    this._prevAnchor = new Phaser.Point();

    /**
    * @property {array} _glyphs - Private tracker for the letter sprite pool.
    * @private
    */
    this._glyphs = [];

    /**
    * @property {number} _maxWidth - Internal cache var.
    * @private
    */
    this._maxWidth = 0;

    /**
    * @property {string} _text - Internal cache var.
    * @private
    */
    this._text = text;

    /**
    * @property {string} _font - Internal cache var.
    * @private
    */
    this._font = font;

    /**
    * @property {number} _fontSize - Internal cache var.
    * @private
    */
    this._fontSize = size;

    /**
    * @property {string} _align - Internal cache var.
    * @private
    */
    this._align = align;

    /**
    * @property {number} _tint - Internal cache var.
    * @private
    */
    this._tint = 0xFFFFFF;

    this.updateText();

    /**
    * @property {boolean} dirty - The dirty state of this object.
    */
    this.dirty = false;

    Phaser.Component.Core.init.call(this, game, x, y, '', null);

};

Phaser.BitmapText.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Phaser.BitmapText.prototype.constructor = Phaser.BitmapText;

Phaser.Component.Core.install.call(Phaser.BitmapText.prototype, [
    'Angle',
    'AutoCull',
    'Bounds',
    'Destroy',
    'FixedToCamera',
    'InputEnabled',
    'InWorld',
    'LifeSpan',
    'PhysicsBody',
    'Reset'
]);

Phaser.BitmapText.prototype.preUpdatePhysics = Phaser.Component.PhysicsBody.preUpdate;
Phaser.BitmapText.prototype.preUpdateLifeSpan = Phaser.Component.LifeSpan.preUpdate;
Phaser.BitmapText.prototype.preUpdateInWorld = Phaser.Component.InWorld.preUpdate;
Phaser.BitmapText.prototype.preUpdateCore = Phaser.Component.Core.preUpdate;

/**
* Automatically called by World.preUpdate.
*
* @method
* @memberof Phaser.BitmapText
* @return {boolean} True if the BitmapText was rendered, otherwise false.
*/
Phaser.BitmapText.prototype.preUpdate = function () {

    if (!this.preUpdatePhysics() || !this.preUpdateLifeSpan() || !this.preUpdateInWorld())
    {
        return false;
    }

    return this.preUpdateCore();

};

/**
* Automatically called by World.preUpdate.
* @method Phaser.BitmapText.prototype.postUpdate
*/
Phaser.BitmapText.prototype.postUpdate = function () {

    Phaser.Component.PhysicsBody.postUpdate.call(this);
    Phaser.Component.FixedToCamera.postUpdate.call(this);

    if (this.body && this.body.type === Phaser.Physics.ARCADE)
    {
        if ((this.textWidth !== this.body.sourceWidth) || (this.textHeight !== this.body.sourceHeight))
        {
            this.body.setSize(this.textWidth, this.textHeight);
        }
    }

};

/**
* The text to be displayed by this BitmapText object.
* 
* It's faster to use `BitmapText.text = string`, but this is kept for backwards compatibility.
*
* @method Phaser.BitmapText.prototype.setText
* @param {string} text - The text to be displayed by this BitmapText object.
*/
Phaser.BitmapText.prototype.setText = function (text) {

    this.text = text;

};

/**
* Given the input text this will scan the characters until either a newline is encountered, 
* or the line exceeds maxWidth, taking into account kerning, character widths and scaling.
* 
* @method Phaser.BitmapText.prototype.scanLine
* @private
* @param {object} data - A reference to the font object in the PIXI.BitmapText.fonts array.
* @param {float} scale - The scale of the font in relation to the texture.
* @param {string} text - The text to parse.
* @return {object} An object containing the parsed characters, total pixel width and x offsets.
*/
Phaser.BitmapText.prototype.scanLine = function (data, scale, text) {

    var x = 0;
    var w = 0;
    var lastSpace = -1;
    var prevCharCode = null;
    var maxWidth = (this._maxWidth > 0) ? this._maxWidth : null;
    var chars = [];

    //  Let's scan the text and work out if any of the lines are > maxWidth
    for (var i = 0; i < text.length; i++)
    {
        var end = (i === text.length - 1) ? true : false;

        var charCode = text.charCodeAt(i);
        var charData = data.chars[charCode];

        var c = 0;

        if (!charData)
        {
            // Skipped a character not found in font data
            continue;
        }

        if (/(?:\r\n|\r|\n)/.test(text.charAt(i)))
        {
            return { width: w, text: text.substr(0, i), end: end, chars: chars };
        }
        else
        {
            //  Adjust for kerning from previous character to this one
            var kerning = (prevCharCode && charData.kerning[prevCharCode]) ? charData.kerning[prevCharCode] : 0;

            //  Record the last space in the string
            lastSpace = /(\s)/.test(text.charAt(i)) ? i : lastSpace;

            //  What will the line width be if we add this character to it?
            c = (kerning + charData.texture.width + charData.xOffset) * scale;

            if (maxWidth && ((w + c) >= this._maxWidth))
            {
                //  We need to line-wrap
                if (lastSpace === -1)
                {
                    //  Damn we can't, there are no spaces in the text
                }
                else
                {
                    //  The last space was at "lastSpace" which was "i - lastSpace" characters ago
                    return { width: w, text: text.substr(0, i - (i - lastSpace)), end: end, chars: chars };
                }
            }
            else
            {
                w += charData.xAdvance * scale;

                chars.push(x + (charData.xOffset * scale));

                x += charData.xAdvance * scale;

                prevCharCode = charCode;
            }
        }
    }

    return { width: w, text: text, end: end, chars: chars };

};

/**
* Renders text and updates it when needed.
*
* @method Phaser.BitmapText.prototype.updateText
* @private
*/
Phaser.BitmapText.prototype.updateText = function () {

    var data = PIXI.BitmapText.fonts[this._font];

    if (!data)
    {
        return;
    }

    var text = this.text;
    var scale = this._fontSize / data.size;
    var lines = [];

    // var c = 0;
    var y = 0;

    this.textWidth = 0;

    do
    {
        var line = this.scanLine(data, scale, text);

        line.y = y;

        lines.push(line);

        // console.log(line);

        if (line.width > this.textWidth)
        {
            this.textWidth = line.width;
        }

        y += (data.lineHeight * scale);

        text = text.substr(line.text.length + 1);

        c++;
        
    // } while (line.end === false && c < 10)
    } while (line.end === false)

    this.textHeight = y;

    var t = 0;
    var align = 0;
    var ax = this.textWidth * this.anchor.x;
    var ay = this.textHeight * this.anchor.y;

    for (var i = 0; i < lines.length; i++)
    {
        var line = lines[i];

        if (this._align === 'right')
        {
            align = this.textWidth - line.width;
        }
        else if (this._align === 'center')
        {
            align = (this.textWidth - line.width) / 2;
        }

        for (var c = 0; c < line.text.length; c++)
        {
            var charCode = line.text.charCodeAt(c);
            var charData = data.chars[charCode];

            var g = this._glyphs[t];

            if (g)
            {
                g.texture = charData.texture;
            }
            else
            {
                g = new PIXI.Sprite(charData.texture);
                this._glyphs.push(g);
            }

            g.position.x = (line.chars[c] + align) - ax;
            g.position.y = (line.y + (charData.yOffset * scale)) - ay;

            g.scale.set(scale);
            g.tint = this.tint;

            if (!g.parent)
            {
                this.addChild(g);
            }

            t++;
        }
    }

    //  Remove unnecessary children
    for (i = t; i < this._glyphs.length; i++)
    {
        this.removeChild(this._glyphs[i]);
    }

};

/**
* Updates the transform of this object.
*
* @method Phaser.BitmapText.prototype.updateTransform
* @private
*/
Phaser.BitmapText.prototype.updateTransform = function () {

    if (this.dirty || !this.anchor.equals(this._prevAnchor))
    {
        this.updateText();
        this.dirty = false;
        this._prevAnchor.copyFrom(this.anchor);
    }

    PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);

};

/**
* @name Phaser.BitmapText#align
* @property {string} align - Alignment for multi-line text ('left', 'center' or 'right'), does not affect single lines of text.
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'align', {

    get: function() {
        return this._align;
    },

    set: function(value) {

        if (value !== this._align && (value === 'left' || value === 'center' || value === 'right'))
        {
            this._align = value;
            this.updateText();
        }

    }

});

/**
* @name Phaser.BitmapText#tint
* @property {number} tint - The tint applied to the BitmapText. This is a hex value. Set to white to disable (0xFFFFFF)
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'tint', {

    get: function() {
        return this._tint;
    },

    set: function(value) {

        if (value !== this._tint)
        {
            this._tint = value;
            this.dirty = true;
            this.updateText();
        }

    }

});

/**
* @name Phaser.BitmapText#font
* @property {string} font - The font the text will be rendered in, i.e. 'Arial'. Must be loaded in the browser before use.
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'font', {

    get: function() {
        return this._font;
    },

    set: function(value) {

        if (value !== this._font)
        {
            this._font = value.trim();
            // this.fontName = this._font;
            // this.style.font = this._fontSize + "px '" + this._font + "'";
            this.dirty = true;
            this.updateText();
        }

    }

});

/**
* @name Phaser.BitmapText#fontSize
* @property {number} fontSize - The size of the font in pixels.
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'fontSize', {

    get: function() {
        return this._fontSize;
    },

    set: function(value) {

        value = parseInt(value, 10);

        if (value !== this._fontSize)
        {
            this._fontSize = value;
            // this.style.font = this._fontSize + "px '" + this._font + "'";
            this.dirty = true;
            this.updateText();
        }

    }

});

/**
* @name Phaser.BitmapText#text
* @property {string} text - The text to be displayed by this BitmapText object.
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'text', {

    get: function() {
        return this._text;
    },

    set: function(value) {

        if (value !== this._text)
        {
            this._text = value.toString() || '';
            this.dirty = true;
            this.updateText();
        }

    }

});

/**
* The maximum display width of this BitmapText in pixels.
* 
* If BitmapText.text is longer than maxWidth then the lines will be automatically wrapped 
* based on the last whitespace character found in the line.
* 
* If no whitespace was found then no wrapping will take place and consequently the maxWidth value will not be honored.
* 
* Disable maxWidth by setting the value to 0.
* 
* @name Phaser.BitmapText#maxWidth
* @property {number} maxWidth - The maximum width of this BitmapText in pixels.
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'maxWidth', {

    get: function() {

        return this._maxWidth;

    },

    set: function(value) {

        if (value !== this._maxWidth)
        {
            this._maxWidth = value;
            this.updateText();
        }

    }

});
