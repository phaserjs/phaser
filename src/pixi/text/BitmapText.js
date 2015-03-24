/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A BitmapText object will create a line or multiple lines of text using bitmap font. To split a line you can use '\n', '\r' or '\r\n' in your string.
 * You can generate the fnt files using
 * http://www.angelcode.com/products/bmfont/ for windows or
 * http://www.bmglyph.com/ for mac.
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
     * [read-only] The width of the overall text, different from fontSize,
     * which is defined in the style object
     *
     * @property textWidth
     * @type Number
     * @readOnly
     */
    this.textWidth = 0;

    /**
     * [read-only] The height of the overall text, different from fontSize,
     * which is defined in the style object
     *
     * @property textHeight
     * @type Number
     * @readOnly
     */
    this.textHeight = 0;

    /**
     * The max width of this bitmap text in pixels. If the text provided is longer than the value provided, line breaks will be 
     * automatically inserted in the last whitespace. Disable by setting value to 0.
     *
     * @property maxWidth
     * @type Number
     */
    this.maxWidth = 0;

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
     * @property _pool
     * @type Array
     * @private
     */
    this._pool = [];

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

/**
 * Renders text and updates it when needed
 *
 * @method updateText
 * @private
 */
PIXI.BitmapText.prototype.updateText = function()
{
    var data = PIXI.BitmapText.fonts[this.fontName];
    var pos = new PIXI.Point();
    var prevCharCode = null;
    var chars = [];
    var maxLineWidth = 0;
    var lineWidths = [];
    var line = 0;
    var scale = this.fontSize / data.size;
    var lastSpace = 0;

    for (var i = 0; i < this.text.length; i++)
    {
        var charCode = this.text.charCodeAt(i);
        lastSpace = /(\s)/.test(this.text.charAt(i)) ? i : lastSpace;

        if (/(?:\r\n|\r|\n)/.test(this.text.charAt(i)))
        {
            lineWidths.push(pos.x);
            maxLineWidth = Math.max(maxLineWidth, pos.x);
            line++;

            pos.x = 0;
            pos.y += data.lineHeight;
            prevCharCode = null;
            continue;
        }

        if (lastSpace !== -1 && this.maxWidth > 0 && pos.x * scale > this.maxWidth)
        {
            chars.splice(lastSpace, i - lastSpace);
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

        if(!charData) continue;

        if(prevCharCode && charData.kerning[prevCharCode])
        {
            pos.x += charData.kerning[prevCharCode];
        }

        chars.push({texture:charData.texture, line: line, charCode: charCode, position: new PIXI.Point(pos.x + charData.xOffset, pos.y + charData.yOffset)});
        pos.x += charData.xAdvance;

        prevCharCode = charCode;
    }

    lineWidths.push(pos.x);
    maxLineWidth = Math.max(maxLineWidth, pos.x);

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

    var lenChildren = this.children.length;
    var lenChars = chars.length;
    var tint = this.tint || 0xFFFFFF;

    this.textWidth = maxLineWidth * scale;
    this.textHeight = (pos.y + data.lineHeight) * scale;

    var ax = this.textWidth * this.anchor.x;
    var ay = this.textHeight * this.anchor.y;

    for (i = 0; i < lenChars; i++)
    {
        var c = i < lenChildren ? this.children[i] : this._pool.pop(); // get old child if have. if not - take from pool.

        if (c) c.setTexture(chars[i].texture); // check if got one before.
        else c = new PIXI.Sprite(chars[i].texture); // if no create new one.

        c.position.x = ((chars[i].position.x + lineAlignOffsets[chars[i].line]) * scale) - ax;
        c.position.y = (chars[i].position.y * scale) - ay;

        c.scale.x = c.scale.y = scale;
        c.tint = tint;
        if (!c.parent) this.addChild(c);
    }

    //  Remove unnecessary children and put them into the pool
    while (this.children.length > lenChars)
    {
        var child = this.getChildAt(this.children.length - 1);
        this._pool.push(child);
        this.removeChild(child);
    }

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

PIXI.BitmapText.fonts = {};
