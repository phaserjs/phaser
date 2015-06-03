/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A BitmapText object will create a line or multiple lines of text using bitmap font. To split a line you can use '\n', '\r' or '\r\n' in your string.
 * You can generate the fnt files using:
 * 
 * http://www.angelcode.com/products/bmfont/ for Windows or
 * http://www.bmglyph.com/ for OS X.
 *
 * @class BitmapText
 * @extends DisplayObjectContainer
 * @constructor
 * @param text {String} The copy that you would like the text to display
 * @param style {Object} The style parameters
 * @param style.font {String} The size (optional) and bitmap font id (required) eq 'Arial' or '20px Arial' (must have loaded previously)
 * @param [style.align='left'] {String} Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
 */
PIXI.BitmapText = function(text, style)
{
    PIXI.DisplayObjectContainer.call(this);

    /**
     * The width of the overall text, different from fontSize,
     * which is defined in the style object
     *
     * @property textWidth
     * @type Number
     * @readOnly
     */
    this.textWidth = 0;

    /**
     * The height of the overall text, different from fontSize,
     * which is defined in the style object
     *
     * @property textHeight
     * @type Number
     * @readOnly
     */
    this.textHeight = 0;

    /**
     * @property anchor
     * @type Point
     */
    this.anchor = new Phaser.Point(0, 0);

    /**
     * @property _prevAnchor
     * @type Point
     */
    this._prevAnchor = new Phaser.Point(0, 0);

    /**
     * Private tracker for the letter sprite pool.
     *
     * @member {Sprite[]}
     * @private
     */
    this._glyphs = [];

    /**
    * @property {integer} _maxWidth - Internal cache var for maxWidth.
    * @private
    */
    this._maxWidth = 400;

    this.setText(text);
    this.setStyle(style);
    this.updateText();

    /**
     * The dirty state of this object.
     * @property dirty
     * @type Boolean
     */
    this.dirty = false;

};

// constructor
PIXI.BitmapText.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.BitmapText.prototype.constructor = PIXI.BitmapText;

/**
 * Set the text string to be rendered.
 *
 * @method setText
 * @param text {String} The text that you would like displayed
 */
PIXI.BitmapText.prototype.setText = function(text)
{
    this.text = text || ' ';
    this.dirty = true;
};

/**
 * Set the style of the text
 * style.font {String} The size (optional) and bitmap font id (required) eq 'Arial' or '20px Arial' (must have loaded previously)
 * [style.align='left'] {String} Alignment for multiline text ('left', 'center' or 'right'), does not affect single lines of text
 *
 * @method setStyle
 * @param style {Object} The style parameters, contained as properties of an object
 */
PIXI.BitmapText.prototype.setStyle = function(style)
{
    style = style || {};
    style.align = style.align || 'left';

    this.style = style;

    var font = style.font.split(' ');
    this.fontName = font[font.length - 1];
    this.fontSize = font.length >= 2 ? parseInt(font[font.length - 2], 10) : PIXI.BitmapText.fonts[this.fontName].size;

    this.dirty = true;
    this.tint = style.tint;
};

PIXI.BitmapText.prototype.scanLine = function(text)
{
    //  Given the input text this will scan the characters until either a newline
    //  is encountered, or the line exceeds maxWidth, taking into account
    //  kerning and font widths

    // console.log("Scanning: " + text);

    var data = PIXI.BitmapText.fonts[this.fontName];
    var scale = this.fontSize / data.size;
    var x = 0;
    var w = 0;
    var k = 0;
    var lastSpace = -1;
    var prevCharCode = null;
    var maxWidth = (this._maxWidth > 0) ? this._maxWidth : null;
    var chars = [];

    //  Let's scan the text and work out if any of the lines are > maxWidth
    for (var i = 0; i < text.length; i++)
    {
        var charCode = text.charCodeAt(i);
        var charData = data.chars[charCode];
        var end = false;
        var c = 0;

        if (!charData)
        {
            console.log(i, 'skipped a character not found in font data', charCode);
            continue;
        }

        if (i === text.length - 1)
        {
            end = true;
        }

        //  Adjust for kerning from previous character to this one
        k = 0;

        if (prevCharCode && charData.kerning[prevCharCode])
        {
            k = charData.kerning[prevCharCode];
        }

        lastSpace = /(\s)/.test(text.charAt(i)) ? i : lastSpace;

        if (/(?:\r\n|\r|\n)/.test(text.charAt(i)))
        {
            return { width: w, text: text.substr(0, i), end: end, chars: chars };
        }
        else
        {
            //  What will the line width be if we add this character to it?
            // c = (k + charData.xAdvance) * scale;
            c = (k + charData.texture.width + charData.xOffset) * scale;

            if (maxWidth && ((w + c) >= this._maxWidth))
            {
                // console.log('--> We need to wrap batman!', w, 'px');

                if (lastSpace === -1)
                {
                    console.log('shit we cannot wrap, no spaces in the text');
                }
                else
                {
                    // console.log('The last space was at', lastSpace, 'that is', i - lastSpace, 'characters ago:');
                    // console.log(text.substr(lastSpace, i - lastSpace));

                    return { width: w, text: text.substr(0, i - (i - lastSpace)), end: end, chars: chars };
                }
            }
            else
            {
                w += charData.xAdvance * scale;

                chars.push(x + (charData.xOffset * scale));

                // console.log(x, text.charAt(i), 'char size', c, 'total', w);

                // x += c;
                x += charData.xAdvance * scale;
            }
        }
    }

    return { width: w, text: text, end: end, chars: chars };

};

/**
 * Renders text and updates it when needed
 *
 * @method updateText
 * @private
 */
PIXI.BitmapText.prototype.updateText = function()
{
    var text = this.text;
    var lines = [];
    var data = PIXI.BitmapText.fonts[this.fontName];
    var scale = this.fontSize / data.size;

    console.log('scale', scale);
    console.log(text);

    var c = 0;
    var y = 0;

    this.textWidth = 0;

    do
    {
        var line = this.scanLine(text);

        line.y = y;

        lines.push(line);

        console.log(line);

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

    console.log('text area', this.textWidth, 'x', this.textHeight);

    var t = 0;
    var tint = this.tint || 0xFFFFFF;
    var ax = this.textWidth * this.anchor.x;
    var ay = this.textHeight * this.anchor.y;
    var alignOffset = 0;

    for (var i = 0; i < lines.length; i++)
    {
        var line = lines[i];

        if (this.style.align === 'right')
        {
            alignOffset = this.textWidth - line.width;
        }
        else if (this.style.align === 'center')
        {
            alignOffset = (this.textWidth - line.width) / 2;
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

            g.position.x = (line.chars[c] + alignOffset) - ax;
            g.position.y = (line.y + (charData.yOffset * scale)) - ay;

            g.scale.set(scale);
            g.tint = tint;

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




PIXI.BitmapText.prototype.BLAHupdateText = function()
{
    var data = PIXI.BitmapText.fonts[this.fontName];
    var scale = this.fontSize / data.size;

    var text = this.text;
    var lastSpace = -1;
    var x = 0;
    var w = 0;
    var k = 0;
    var y = 0;
    var prevCharCode = null;
    var maxWidth = (this._maxWidth > 0) ? this._maxWidth : null;
    var lines = [];

    //  Let's scan the text and work out if any of the lines are > maxWidth
    for (var i = 0; i < text.length; i++)
    {
        var charCode = text.charCodeAt(i);
        var charData = data.chars[charCode];

        if (!charData)
        {
            console.log(i, 'skipped a character not found in font data', charCode);
            continue;
        }

        //  Adjust for kerning from previous character to this one

        k = 0;

        if (prevCharCode && charData.kerning[prevCharCode])
        {
            k = charData.kerning[prevCharCode];
        }

        lastSpace = /(\s)/.test(text.charAt(i)) ? i : lastSpace;

        if (/(?:\r\n|\r|\n)/.test(text.charAt(i)))
        {
            x = 0;
            // y += data.lineHeight;
            prevCharCode = null;
            lastSpace = -1;
            // lineWidths.push(w);
            w = 0;
            console.log('newline');
        }
        else
        {
            x += k;

            //  What will the line width be if we add this character to it?
            w = x + charData.texture.width + charData.xOffset;

            if (maxWidth && w >= this._maxWidth)
            {
                console.log('--> We need to wrap batman!', w, 'px');

                if (lastSpace === -1)
                {
                    console.log('shit we cannot wrap, no spaces in the text');
                }
                else
                {
                    console.log('The last space was at', lastSpace, 'that is', i - lastSpace, 'characters ago:');
                    console.log(text.substr(lastSpace, i - lastSpace));
                    insertCRs.push(lastSpace);

                    x = 0;
                    // y += data.lineHeight;
                    prevCharCode = null;
                    lastSpace = -1;
                    // lineWidths.push(w);
                    w = 0;
                    console.log('newline');
                }
                // console.log(i, 'Character: ', text.charAt(i), charCode, 'x', x, 'kerning', k, w);
            }
            else
            {
                x += charData.xAdvance;
                console.log(i, 'Character: ', text.charAt(i), charCode, 'x', x, 'kerning', k, w);
            }
        }

    }

}


PIXI.BitmapText.prototype.OLDupdateText = function()
{
    var data = PIXI.BitmapText.fonts[this.fontName];
    var pos = new PIXI.Point();
    var prevCharCode = null;
    var chars = [];
    var lastLineWidth = 0;
    var maxLineWidth = 0;
    var lineWidths = [];
    var line = 0;
    var scale = this.fontSize / data.size;
    var lastSpace = -1;

    console.log('updateText');

    for (var i = 0; i < this.text.length; i++)
    {
        var charCode = this.text.charCodeAt(i);
        lastSpace = /(\s)/.test(this.text.charAt(i)) ? i : lastSpace;

        if (/(?:\r\n|\r|\n)/.test(this.text.charAt(i)))
        {
            lineWidths.push(lastLineWidth);
            maxLineWidth = Math.max(maxLineWidth, lastLineWidth);
            line++;

            // console.log('line break', line, 'lw', lastLineWidth, 'max', maxLineWidth);

            pos.x = 0;
            pos.y += data.lineHeight;
            prevCharCode = null;
            continue;
        }

        if (lastSpace !== -1 && this.maxWidth > 0 && pos.x * scale > this.maxWidth)
        {
            console.log('lastSpace?', lastSpace, i, i - lastSpace, 'pos', pos.x, pos.y);

            console.log(chars);

            chars.splice(lastSpace, i - lastSpace);

            console.log(chars);

            i = lastSpace;
            lastSpace = -1;

            lineWidths.push(lastLineWidth);
            maxLineWidth = Math.max(maxLineWidth, lastLineWidth);
            line++;

            pos.x = 0;
            pos.y += data.lineHeight;
            prevCharCode = null;
            continue;
        }

        var charData = data.chars[charCode];

        if (!charData)
        {
            continue;
        }

        if (prevCharCode && charData.kerning[prevCharCode])
        {
            pos.x += charData.kerning[prevCharCode];
        }

        chars.push({ 
            texture: charData.texture, 
            line: line, 
            charCode: charCode, 
            position: new PIXI.Point(pos.x + charData.xOffset, pos.y + charData.yOffset)
        });

        lastLineWidth = pos.x + (charData.texture.width + charData.xOffset);
        pos.x += charData.xAdvance;

        prevCharCode = charCode;
    }

    lineWidths.push(lastLineWidth);
    maxLineWidth = Math.max(maxLineWidth, lastLineWidth);

    // console.log('maxLineWidth', maxLineWidth);

    var lineAlignOffsets = [];

    for (i = 0; i <= line; i++)
    {
        var alignOffset = 0;

        if (this.style.align === 'right')
        {
            alignOffset = maxLineWidth - lineWidths[i];
        }
        else if (this.style.align === 'center')
        {
            alignOffset = (maxLineWidth - lineWidths[i]) / 2;
        }

        lineAlignOffsets.push(alignOffset);
    }

    var lenChars = chars.length;
    var tint = this.tint || 0xFFFFFF;

    var ax = this.textWidth * this.anchor.x;
    var ay = this.textHeight * this.anchor.y;

    for (i = 0; i < lenChars; i++)
    {
        var c = this._glyphs[i]; // get the next glyph sprite

        if (c)
        {
            c.texture = chars[i].texture;
        }
        else
        {
            c = new PIXI.Sprite(chars[i].texture);
            this._glyphs.push(c);
        }

        c.position.x = ((chars[i].position.x + lineAlignOffsets[chars[i].line]) * scale) - ax;
        c.position.y = (chars[i].position.y * scale) - ay;

        c.scale.x = c.scale.y = scale;
        c.tint = tint;

        if (!c.parent)
        {
            this.addChild(c);
        }
    }

    //  Remove unnecessary children.
    for (i = lenChars; i < this._glyphs.length; ++i)
    {
        this.removeChild(this._glyphs[i]);
    }

    this.textWidth = maxLineWidth * scale;
    this.textHeight = (pos.y + data.lineHeight) * scale;

};

/**
 * Updates the transform of this object
 *
 * @method updateTransform
 * @private
 */
PIXI.BitmapText.prototype.updateTransform = function()
{
    if (this.dirty || !this.anchor.equals(this._prevAnchor))
    {
        this.updateText();
        this.dirty = false;
        this._prevAnchor.copyFrom(this.anchor);
    }

    PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
};

/**
* The max width of this bitmap text in pixels. If the text provided is longer than the value provided, line breaks will be 
* automatically inserted in the last whitespace. Disable by setting value to 0.
* 
* @name PIXI.BitmapText#maxWidth
* @property {number} align - The max width of this bitmap text in pixels.
*/
Object.defineProperty(PIXI.BitmapText.prototype, 'maxWidth', {

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

PIXI.BitmapText.fonts = {};
