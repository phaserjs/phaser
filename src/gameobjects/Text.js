/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new game object for displaying Text.
*
* This uses a local hidden Canvas object and renders the type into it. It then makes a texture from this for rendering to the view.
* Because of this you can only display fonts that are currently loaded and available to the browser: fonts must be pre-loaded.
*
* See {@link http://www.jordanm.co.uk/tinytype this compatibility table} for the available default fonts across mobile browsers.
*
* @class Phaser.Text
* @extends Phaser.Sprite
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {number} x - X position of the new text object.
* @param {number} y - Y position of the new text object.
* @param {string} text - The actual text that will be written.
* @param {object} [style] - The style properties to be set on the Text.
* @param {string} [style.font='bold 20pt Arial'] - The style and size of the font.
* @param {string} [style.fontStyle=(from font)] - The style of the font (eg. 'italic'): overrides the value in `style.font`.
* @param {string} [style.fontVariant=(from font)] - The variant of the font (eg. 'small-caps'): overrides the value in `style.font`.
* @param {string} [style.fontWeight=(from font)] - The weight of the font (eg. 'bold'): overrides the value in `style.font`.
* @param {string|number} [style.fontSize=(from font)] - The size of the font (eg. 32 or '32px'): overrides the value in `style.font`.
* @param {string} [style.backgroundColor=null] - A canvas fillstyle that will be used as the background for the whole Text object. Set to `null` to disable.
* @param {string} [style.fill='black'] - A canvas fillstyle that will be used on the text eg 'red', '#00FF00'.
* @param {string} [style.align='left'] - Horizontal alignment of each line in multiline text. Can be: 'left', 'center' or 'right'. Does not affect single lines of text (see `textBounds` and `boundsAlignH` for that).
* @param {string} [style.boundsAlignH='left'] - Horizontal alignment of the text within the `textBounds`. Can be: 'left', 'center' or 'right'.
* @param {string} [style.boundsAlignV='top'] - Vertical alignment of the text within the `textBounds`. Can be: 'top', 'middle' or 'bottom'.
* @param {string} [style.stroke='black'] - A canvas stroke style that will be used on the text stroke eg 'blue', '#FCFF00'.
* @param {number} [style.strokeThickness=0] - A number that represents the thickness of the stroke. Default is 0 (no stroke).
* @param {boolean} [style.wordWrap=false] - Indicates if word wrap should be used.
* @param {number} [style.wordWrapWidth=100] - The width in pixels at which text will wrap.
*/
Phaser.Text = function (game, x, y, text, style) {

    x = x || 0;
    y = y || 0;
    text = text || '';
    style = style || {};

    /**
    * @property {number} type - The const type of this object.
    * @default
    */
    this.type = Phaser.TEXT;

    /**
    * @property {number} physicsType - The const physics body type of this object.
    * @readonly
    */
    this.physicsType = Phaser.SPRITE;

    /**
    * Specify a padding value which is added to the line width and height when calculating the Text size.
    * ALlows you to add extra spacing if Phaser is unable to accurately determine the true font dimensions.
    * @property {Phaser.Point} padding
    */
    this.padding = new Phaser.Point();

    /**
    * The textBounds property allows you to specify a rectangular region upon which text alignment is based.
    * See `Text.setTextBounds` for more details.
    * @property {Phaser.Rectangle} textBounds
    * @readOnly
    */
    this.textBounds = null;

    /**
     * @property {HTMLCanvasElement} canvas - The canvas element that the text is rendered.
     */
    this.canvas = document.createElement('canvas');

    /**
     * @property {HTMLCanvasElement} context - The context of the canvas element that the text is rendered to.
     */
    this.context = this.canvas.getContext('2d');

    /**
     * 
     * @property {number} resolution - The resolution of the canvas.
     * @default
     */
    this.resolution = 1;

    /**
    * @property {array} colors - An array of the color values as specified by {@link Phaser.Text#addColor addColor}.
    */
    this.colors = [];

    /**
    * @property {string} _text - Internal cache var.
    * @private
    */
    this._text = text;

    /**
    * @property {object} _fontComponents - The font, broken down into components, set in `setStyle`.
    * @private
    */
    this._fontComponents = null;

    /**
    * @property {number} lineSpacing - Additional spacing (in pixels) between each line of text if multi-line.
    * @private
    */
    this._lineSpacing = 0;

    /**
    * @property {number} _charCount - Internal character counter used by the text coloring.
    * @private
    */
    this._charCount = 0;

    /**
    * @property {number} _width - Internal width var.
    * @private
    */
    this._width = 0;

    /**
    * @property {number} _height - Internal height var.
    * @private
    */
    this._height = 0;

    Phaser.Sprite.call(this, game, x, y, PIXI.Texture.fromCanvas(this.canvas));

    this.texture.trim = new Phaser.Rectangle();

    this.setStyle(style);

    if (text !== '')
    {
        this.updateText();
    }

};

Phaser.Text.prototype = Object.create(Phaser.Sprite.prototype);
Phaser.Text.prototype.constructor = Phaser.Text;

/**
* Automatically called by World.preUpdate.
* 
* @method Phaser.Text#preUpdate
* @protected
*/
Phaser.Text.prototype.preUpdate = function () {

    if (!this.preUpdatePhysics() || !this.preUpdateLifeSpan() || !this.preUpdateInWorld())
    {
        return false;
    }

    return this.preUpdateCore();

};

/**
* Override this function to handle any special update requirements.
*
* @method Phaser.Text#update
* @protected
*/
Phaser.Text.prototype.update = function() {

};

/**
* Destroy this Text object, removing it from the group it belongs to.
*
* @method Phaser.Text#destroy
* @param {boolean} [destroyChildren=true] - Should every child of this object have its destroy method called?
*/
Phaser.Text.prototype.destroy = function (destroyChildren) {

    this.texture.destroy(true);

    if (this.canvas && this.canvas.parentNode)
    {
        this.canvas.parentNode.removeChild(this.canvas);
    }
    else
    {
        this.canvas = null;
        this.context = null;
    }

    Phaser.Component.Destroy.prototype.destroy.call(this, destroyChildren);

};

/**
* Sets a drop shadow effect on the Text. You can specify the horizontal and vertical distance of the drop shadow with the `x` and `y` parameters.
* The color controls the shade of the shadow (default is black) and can be either an `rgba` or `hex` value.
* The blur is the strength of the shadow. A value of zero means a hard shadow, a value of 10 means a very soft shadow.
* To remove a shadow already in place you can call this method with no parameters set.
* 
* @method Phaser.Text#setShadow
* @param {number} [x=0] - The shadowOffsetX value in pixels. This is how far offset horizontally the shadow effect will be.
* @param {number} [y=0] - The shadowOffsetY value in pixels. This is how far offset vertically the shadow effect will be.
* @param {string} [color='rgba(0,0,0,1)'] - The color of the shadow, as given in CSS rgba or hex format. Set the alpha component to 0 to disable the shadow.
* @param {number} [blur=0] - The shadowBlur value. Make the shadow softer by applying a Gaussian blur to it. A number from 0 (no blur) up to approx. 10 (depending on scene).
* @param {boolean} [shadowStroke=true] - Apply the drop shadow to the Text stroke (if set).
* @param {boolean} [shadowFill=true] - Apply the drop shadow to the Text fill (if set).
* @return {Phaser.Text} This Text instance.
*/
Phaser.Text.prototype.setShadow = function (x, y, color, blur, shadowStroke, shadowFill) {

    if (typeof x === 'undefined') { x = 0; }
    if (typeof y === 'undefined') { y = 0; }
    if (typeof color === 'undefined') { color = 'rgba(0, 0, 0, 1)'; }
    if (typeof blur === 'undefined') { blur = 0; }
    if (typeof shadowStroke === 'undefined') { shadowStroke = true; }
    if (typeof shadowFill === 'undefined') { shadowFill = true; }

    this.style.shadowOffsetX = x;
    this.style.shadowOffsetY = y;
    this.style.shadowColor = color;
    this.style.shadowBlur = blur;
    this.style.shadowStroke = shadowStroke;
    this.style.shadowFill = shadowFill;
    this.dirty = true;

    return this;

};

/**
* Set the style of the text by passing a single style object to it.
*
* @method Phaser.Text#setStyle
* @param {object} [style] - The style properties to be set on the Text.
* @param {string} [style.font='bold 20pt Arial'] - The style and size of the font.
* @param {string} [style.fontStyle=(from font)] - The style of the font (eg. 'italic'): overrides the value in `style.font`.
* @param {string} [style.fontVariant=(from font)] - The variant of the font (eg. 'small-caps'): overrides the value in `style.font`.
* @param {string} [style.fontWeight=(from font)] - The weight of the font (eg. 'bold'): overrides the value in `style.font`.
* @param {string|number} [style.fontSize=(from font)] - The size of the font (eg. 32 or '32px'): overrides the value in `style.font`.
* @param {string} [style.backgroundColor=null] - A canvas fillstyle that will be used as the background for the whole Text object. Set to `null` to disable.
* @param {string} [style.fill='black'] - A canvas fillstyle that will be used on the text eg 'red', '#00FF00'.
* @param {string} [style.align='left'] - Horizontal alignment of each line in multiline text. Can be: 'left', 'center' or 'right'. Does not affect single lines of text (see `textBounds` and `boundsAlignH` for that).
* @param {string} [style.boundsAlignH='left'] - Horizontal alignment of the text within the `textBounds`. Can be: 'left', 'center' or 'right'.
* @param {string} [style.boundsAlignV='top'] - Vertical alignment of the text within the `textBounds`. Can be: 'top', 'middle' or 'bottom'.
* @param {string} [style.stroke='black'] - A canvas stroke style that will be used on the text stroke eg 'blue', '#FCFF00'.
* @param {number} [style.strokeThickness=0] - A number that represents the thickness of the stroke. Default is 0 (no stroke).
* @param {boolean} [style.wordWrap=false] - Indicates if word wrap should be used.
* @param {number} [style.wordWrapWidth=100] - The width in pixels at which text will wrap.
* @return {Phaser.Text} This Text instance.
*/
Phaser.Text.prototype.setStyle = function (style) {

    style = style || {};
    style.font = style.font || 'bold 20pt Arial';
    style.backgroundColor = style.backgroundColor || null;
    style.fill = style.fill || 'black';
    style.align = style.align || 'left';
    style.boundsAlignH = style.boundsAlignH || 'left';
    style.boundsAlignV = style.boundsAlignV || 'top';
    style.stroke = style.stroke || 'black'; //provide a default, see: https://github.com/GoodBoyDigital/pixi.js/issues/136
    style.strokeThickness = style.strokeThickness || 0;
    style.wordWrap = style.wordWrap || false;
    style.wordWrapWidth = style.wordWrapWidth || 100;
    style.shadowOffsetX = style.shadowOffsetX || 0;
    style.shadowOffsetY = style.shadowOffsetY || 0;
    style.shadowColor = style.shadowColor || 'rgba(0,0,0,0)';
    style.shadowBlur = style.shadowBlur || 0;

    var components = this.fontToComponents(style.font);

    if (style.fontStyle)
    {
        components.fontStyle = style.fontStyle;
    }

    if (style.fontVariant)
    {
        components.fontVariant = style.fontVariant;
    }

    if (style.fontWeight)
    {
        components.fontWeight = style.fontWeight;
    }

    if (style.fontSize)
    {
        if (typeof style.fontSize === 'number')
        {
            style.fontSize = style.fontSize + 'px';
        }

        components.fontSize = style.fontSize;
    }

    this._fontComponents = components;

    style.font = this.componentsToFont(this._fontComponents);
    this.style = style;
    this.dirty = true;

    return this;

};

/**
* Renders text. This replaces the Pixi.Text.updateText function as we need a few extra bits in here.
*
* @method Phaser.Text#updateText
* @private
*/
Phaser.Text.prototype.updateText = function () {

    this.texture.baseTexture.resolution = this.resolution;

    this.context.font = this.style.font;

    var outputText = this.text;

    if (this.style.wordWrap)
    {
        outputText = this.runWordWrap(this.text);
    }

    //  Split text into lines
    var lines = outputText.split(/(?:\r\n|\r|\n)/);

    //  Calculate text width
    var lineWidths = [];
    var maxLineWidth = 0;
    var fontProperties = this.determineFontProperties(this.style.font);

    for (var i = 0; i < lines.length; i++)
    {
        var lineWidth = this.context.measureText(lines[i]).width + this.padding.x;
        lineWidths[i] = lineWidth;
        maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }

    var width = maxLineWidth + this.style.strokeThickness;

    this.canvas.width = width * this.resolution;
    
    //  Calculate text height
    var lineHeight = fontProperties.fontSize + this.style.strokeThickness + this.padding.y;
    var height = lineHeight * lines.length;
    var lineSpacing = this._lineSpacing;

    if (lineSpacing < 0 && Math.abs(lineSpacing) > lineHeight)
    {
        lineSpacing = -lineHeight;
    }

    //  Adjust for line spacing
    if (lineSpacing !== 0)
    {
        var diff = lineSpacing * (lines.length - 1);
        height += diff;
    }

    this.canvas.height = height * this.resolution;

    this.context.scale(this.resolution, this.resolution);

    if (navigator.isCocoonJS)
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (this.style.backgroundColor)
    {
        this.context.fillStyle = this.style.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    this.context.fillStyle = this.style.fill;
    this.context.font = this.style.font;
    this.context.strokeStyle = this.style.stroke;
    this.context.textBaseline = 'alphabetic';

    this.context.lineWidth = this.style.strokeThickness;
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';

    var linePositionX;
    var linePositionY;

    this._charCount = 0;

    //  Draw text line by line
    for (i = 0; i < lines.length; i++)
    {
        linePositionX = this.style.strokeThickness / 2;
        linePositionY = (this.style.strokeThickness / 2 + i * lineHeight) + fontProperties.ascent;

        if (i > 0)
        {
            linePositionY += (lineSpacing * i);
        }

        if (this.style.align === 'right')
        {
            linePositionX += maxLineWidth - lineWidths[i];
        }
        else if (this.style.align === 'center')
        {
            linePositionX += (maxLineWidth - lineWidths[i]) / 2;
        }

        if (this.colors.length > 0)
        {
            this.updateLine(lines[i], linePositionX, linePositionY);
        }
        else
        {
            if (this.style.stroke && this.style.strokeThickness)
            {
                this.updateShadow(this.style.shadowStroke);
                this.context.strokeText(lines[i], linePositionX, linePositionY);
            }

            if (this.style.fill)
            {
                this.updateShadow(this.style.shadowFill);
                this.context.fillText(lines[i], linePositionX, linePositionY);
            }
        }
    }

    this.updateTexture();

};

/**
* Sets the Shadow on the Text.context based on the Style settings, or disables it if not enabled.
* This is called automatically by Text.updateText.
*
* @method Phaser.Text#updateShadow
* @param {boolean} state - If true the shadow will be set to the Style values, otherwise it will be set to zero.
*/
Phaser.Text.prototype.updateShadow = function (state) {

    if (state)
    {
        this.context.shadowOffsetX = this.style.shadowOffsetX;
        this.context.shadowOffsetY = this.style.shadowOffsetY;
        this.context.shadowColor = this.style.shadowColor;
        this.context.shadowBlur = this.style.shadowBlur;
    }
    else
    {
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowColor = 0;
        this.context.shadowBlur = 0;
    }

};

/**
* Updates a line of text.
*
* @method Phaser.Text#updateLine
* @private
*/
Phaser.Text.prototype.updateLine = function (line, x, y) {

    for (var i = 0; i < line.length; i++)
    {
        var letter = line[i];

        if (this.colors[this._charCount])
        {
            this.context.fillStyle = this.colors[this._charCount];
            this.context.strokeStyle = this.colors[this._charCount];
        }

        if (this.style.stroke && this.style.strokeThickness)
        {
            this.updateShadow(this.style.shadowStroke);
            this.context.strokeText(letter, x, y);
        }

        if (this.style.fill)
        {
            this.updateShadow(this.style.shadowFill);
            this.context.fillText(letter, x, y);
        }

        x += this.context.measureText(letter).width;

        this._charCount++;
    }

};

/**
* Clears any previously set color stops.
*
* @method Phaser.Text#clearColors
* @return {Phaser.Text} This Text instance.
*/
Phaser.Text.prototype.clearColors = function () {

    this.colors = [];
    this.dirty = true;

    return this;

};

/**
* Set specific colors for certain characters within the Text.
*
* It works by taking a color value, which is a typical HTML string such as `#ff0000` or `rgb(255,0,0)` and a position.
* The position value is the index of the character in the Text string to start applying this color to.
* Once set the color remains in use until either another color or the end of the string is encountered.
* For example if the Text was `Photon Storm` and you did `Text.addColor('#ffff00', 6)` it would color in the word `Storm` in yellow.
*
* @method Phaser.Text#addColor
* @param {string} color - A canvas fillstyle that will be used on the text eg `red`, `#00FF00`, `rgba()`.
* @param {number} position - The index of the character in the string to start applying this color value from.
* @return {Phaser.Text} This Text instance.
*/
Phaser.Text.prototype.addColor = function (color, position) {

    this.colors[position] = color;
    this.dirty = true;

    return this;

};

/**
* Greedy wrapping algorithm that will wrap words as the line grows longer than its horizontal bounds.
*
* @method Phaser.Text#runWordWrap
* @param {string} text - The text to perform word wrap detection against.
* @private
*/
Phaser.Text.prototype.runWordWrap = function (text) {

    var result = '';
    var lines = text.split('\n');

    for (var i = 0; i < lines.length; i++)
    {
        var spaceLeft = this.style.wordWrapWidth;
        var words = lines[i].split(' ');

        for (var j = 0; j < words.length; j++)
        {
            var wordWidth = this.context.measureText(words[j]).width;
            var wordWidthWithSpace = wordWidth + this.context.measureText(' ').width;

            if (wordWidthWithSpace > spaceLeft)
            {
                // Skip printing the newline if it's the first word of the line that is greater than the word wrap width.
                if (j > 0)
                {
                    result += '\n';
                }
                result += words[j] + ' ';
                spaceLeft = this.style.wordWrapWidth - wordWidth;
            }
            else
            {
                spaceLeft -= wordWidthWithSpace;
                result += words[j] + ' ';
            }
        }

        if (i < lines.length-1)
        {
            result += '\n';
        }
    }

    return result;

};

/**
* Updates the internal `style.font` if it now differs according to generation from components.
*
* @method Phaser.Text#updateFont
* @private
* @param {object} components - Font components.
*/
Phaser.Text.prototype.updateFont = function (components) {

    var font = this.componentsToFont(components);

    if (this.style.font !== font)
    {
        this.style.font = font;
        this.dirty = true;

        if (this.parent)
        {
            this.updateTransform();
        }
    }

};

/**
* Converting a short CSS-font string into the relevant components.
*
* @method Phaser.Text#fontToComponents
* @private
* @param {string} font - a CSS font string
*/
Phaser.Text.prototype.fontToComponents = function (font) {

    // The format is specified in http://www.w3.org/TR/CSS2/fonts.html#font-shorthand:
    // style - normal | italic | oblique | inherit
    // variant - normal | small-caps | inherit
    // weight - normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | inherit
    // size - xx-small | x-small | small | medium | large | x-large | xx-large,
    //        larger | smaller
    //        {number} (em | ex | ch | rem | vh | vw | vmin | vmax | px | mm | cm | in | pt | pc | %)
    // font-family - rest (but identifiers or quoted with comma separation)
    var m = font.match(/^\s*(?:\b(normal|italic|oblique|inherit)?\b)\s*(?:\b(normal|small-caps|inherit)?\b)\s*(?:\b(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit)?\b)\s*(?:\b(xx-small|x-small|small|medium|large|x-large|xx-large|larger|smaller|0|\d*(?:[.]\d*)?(?:%|[a-z]{2,5}))?\b)\s*(.*)\s*$/);

    if (m)
    {
        return {
            font: font,
            fontStyle: m[1] || 'normal',
            fontVariant: m[2] || 'normal',
            fontWeight: m[3] || 'normal',
            fontSize: m[4] || 'medium',
            fontFamily: m[5]
        };
    }
    else
    {
        console.warn("Phaser.Text - unparsable CSS font: " + font);
        return {
            font: font
        };
    }

};

/**
* Converts individual font components (see `fontToComponents`) to a short CSS font string.
*
* @method Phaser.Text#componentsToFont
* @private
* @param {object} components - Font components.
*/
Phaser.Text.prototype.componentsToFont = function (components) {

    var parts = [];
    var v;

    v = components.fontStyle;
    if (v && v !== 'normal') { parts.push(v); }

    v = components.fontVariant;
    if (v && v !== 'normal') { parts.push(v); }

    v = components.fontWeight;
    if (v && v !== 'normal') { parts.push(v); }

    v = components.fontSize;
    if (v && v !== 'medium') { parts.push(v); }

    v = components.fontFamily;
    if (v) { parts.push(v); }

    if (!parts.length)
    {
        // Fallback to whatever value the 'font' was
        parts.push(components.font);
    }

    return parts.join(" ");

};

/**
 * The text to be displayed by this Text object.
 * Use a \n to insert a carriage return and split the text.
 * The text will be rendered with any style currently set.
 *
 * @method Phaser.Text#setText
 * @param {string} [text] - The text to be displayed. Set to an empty string to clear text that is already present.
 * @return {Phaser.Text} This Text instance.
 */
Phaser.Text.prototype.setText = function (text) {

    this.text = text.toString() || '';
    this.dirty = true;

    return this;

};

/**
 * The Text Bounds is a rectangular region that allows you to align your text within it, regardless of the number of lines of text
 * or position within the world. For example in an 800x600 sized game if you set the textBounds to be 0,0,800,600 and text alignment
 * to 'left' and vertical alignment to 'bottom' then the text will render in the bottom-right hand corner of the game, regardless of
 * the size of font you're using or the number of lines in the text itself.
 *
 * Set the Style properties `boundsAlignH` and `boundsAlignV` or adjust them via the Text setters to change the alignment.
 * 
 * It works by calculating the final position based on the Text.canvas size, which is modified as the text is updated. Some fonts
 * have additional padding around them which you can mitigate by tweaking the Text.padding property.
 *
 * Setting a textBounds _doesn't_ update the wordWrapWidth, so be aware of the relationship between the two.
 *
 * Call this method with nothing defined for any of the parameters to reset an existing textBounds.
 *
 * @method Phaser.Text#setTextBounds
 * @param {number} [x] - The x coordinate of the Text Bounds region.
 * @param {number} [y] - The y coordinate of the Text Bounds region.
 * @param {number} [width] - The width of the Text Bounds region.
 * @param {number} [height] - The height of the Text Bounds region.
 * @return {Phaser.Text} This Text instance.
 */
Phaser.Text.prototype.setTextBounds = function (x, y, width, height) {

    if (typeof x === 'undefined')
    {
        this.textBounds = null;
    }
    else
    {
        if (!this.textBounds)
        {
            this.textBounds = new Phaser.Rectangle(x, y, width, height);
        }
        else
        {
            this.textBounds.setTo(x, y, width, height);
        }
    }

    this.updateTexture();
    
    return this;

};

/**
 * Updates the texture based on the canvas dimensions.
 *
 * @method Phaser.Text#updateTexture
 * @private
 */
Phaser.Text.prototype.updateTexture = function () {

    var base = this.texture.baseTexture;
    var crop = this.texture.crop;
    var trim = this.texture.trim;
    var frame = this.texture.frame;

    var w = this.canvas.width;
    var h = this.canvas.height;

    base.width = w;
    base.height = h;

    crop.width = w;
    crop.height = h;

    trim.width = w;
    trim.height = h;

    frame.width = w;
    frame.height = h;

    this.texture.width = w;
    this.texture.height = h;

    this._width = w;
    this._height = h;

    if (this.textBounds)
    {
        var x = this.textBounds.x;
        var y = this.textBounds.y;

        //  Align the canvas based on the bounds
        if (this.style.boundsAlignH === 'right')
        {
            x = this.textBounds.width - this.canvas.width;
        }
        else if (this.style.boundsAlignH === 'center')
        {
            x = this.textBounds.halfWidth - (this.canvas.width / 2);
        }

        if (this.style.boundsAlignV === 'bottom')
        {
            y = this.textBounds.height - this.canvas.height;
        }
        else if (this.style.boundsAlignV === 'middle')
        {
            y = this.textBounds.halfHeight - (this.canvas.height / 2);
        }

        trim.x = x;
        trim.y = y;
    }

    this.texture.baseTexture.dirty();

};

/**
* Renders the object using the WebGL renderer
*
* @method Phaser.Text#_renderWebGL
* @private
* @param {RenderSession} renderSession - The Render Session to render the Text on.
*/
Phaser.Text.prototype._renderWebGL = function (renderSession) {

    if (this.dirty)
    {
        this.resolution = renderSession.resolution;

        this.updateText();
        this.dirty = false;
    }

    PIXI.Sprite.prototype._renderWebGL.call(this, renderSession);

};

/**
* Renders the object using the Canvas renderer.
*
* @method Phaser.Text#_renderCanvas
* @private
* @param {RenderSession} renderSession - The Render Session to render the Text on.
*/
Phaser.Text.prototype._renderCanvas = function (renderSession) {

    if (this.dirty)
    {
        this.resolution = renderSession.resolution;

        this.updateText();
        this.dirty = false;
    }
     
    PIXI.Sprite.prototype._renderCanvas.call(this, renderSession);

};

/**
* Calculates the ascent, descent and fontSize of a given font style.
*
* @method Phaser.Text#determineFontProperties
* @private
* @param {object} fontStyle 
*/
Phaser.Text.prototype.determineFontProperties = function (fontStyle) {

    var properties = Phaser.Text.fontPropertiesCache[fontStyle];

    if (!properties)
    {
        properties = {};
        
        var canvas = Phaser.Text.fontPropertiesCanvas;
        var context = Phaser.Text.fontPropertiesContext;

        context.font = fontStyle;

        var width = Math.ceil(context.measureText('|MÉq').width);
        var baseline = Math.ceil(context.measureText('|MÉq').width);
        var height = 2 * baseline;

        baseline = baseline * 1.4 | 0;

        canvas.width = width;
        canvas.height = height;

        context.fillStyle = '#f00';
        context.fillRect(0, 0, width, height);

        context.font = fontStyle;

        context.textBaseline = 'alphabetic';
        context.fillStyle = '#000';
        context.fillText('|MÉq', 0, baseline);

        if (!context.getImageData(0, 0, width, height))
        {
            properties.ascent = baseline;
            properties.descent = baseline + 6;
            properties.fontSize = properties.ascent + properties.descent;

            Phaser.Text.fontPropertiesCache[fontStyle] = properties;

            return properties;
        }

        var imagedata = context.getImageData(0, 0, width, height).data;
        var pixels = imagedata.length;
        var line = width * 4;

        var i, j;

        var idx = 0;
        var stop = false;

        // ascent. scan from top to bottom until we find a non red pixel
        for (i = 0; i < baseline; i++)
        {
            for (j = 0; j < line; j += 4)
            {
                if (imagedata[idx + j] !== 255)
                {
                    stop = true;
                    break;
                }
            }

            if (!stop)
            {
                idx += line;
            }
            else
            {
                break;
            }
        }

        properties.ascent = baseline - i;

        idx = pixels - line;
        stop = false;

        // descent. scan from bottom to top until we find a non red pixel
        for (i = height; i > baseline; i--)
        {
            for (j = 0; j < line; j += 4)
            {
                if (imagedata[idx + j] !== 255)
                {
                    stop = true;
                    break;
                }
            }

            if (!stop)
            {
                idx -= line;
            }
            else
            {
                break;
            }
        }

        properties.descent = i - baseline;
        //TODO might need a tweak. kind of a temp fix!
        properties.descent += 6;
        properties.fontSize = properties.ascent + properties.descent;

        Phaser.Text.fontPropertiesCache[fontStyle] = properties;
    }

    return properties;

};

/**
* Returns the bounds of the Text as a rectangle.
* The bounds calculation takes the worldTransform into account.
*
* @method Phaser.Text#getBounds
* @param {Phaser.Matrix} matrix - The transformation matrix of the Text.
* @return {Phaser.Rectangle} The framing rectangle
*/
Phaser.Text.prototype.getBounds = function (matrix) {

    if (this.dirty)
    {
        this.updateText();
        this.dirty = false;
    }

    return PIXI.Sprite.prototype.getBounds.call(this, matrix);

};

/**
* The text to be displayed by this Text object.
* Use a \n to insert a carriage return and split the text.
* The text will be rendered with any style currently set.
*
* @name Phaser.Text#text
* @property {string} text
*/
Object.defineProperty(Phaser.Text.prototype, 'text', {

    get: function() {
        return this._text;
    },

    set: function(value) {

        if (value !== this._text)
        {
            this._text = value.toString() || ' ';
            this.dirty = true;

            if (this.parent)
            {
                this.updateTransform();
            }
        }

    }

});

/**
* Change the font used.
*
* This is equivalent of the `font` property specified to {@link Phaser.Text#setStyle setStyle}, except
* that unlike using `setStyle` this will not change any current font fill/color settings.
*
* The CSS font string can also be individually altered with the `font`, `fontSize`, `fontWeight`, `fontStyle`, and `fontVariant` properties.
*
* @name Phaser.Text#cssFont
* @property {string} cssFont
*/
Object.defineProperty(Phaser.Text.prototype, 'cssFont', {

    get: function() {
        return this.componentsToFont(this._fontComponents);
    },

    set: function (value)
    {
        value = value || 'bold 20pt Arial';
        this._fontComponents = this.fontToComponents(value);
        this.updateFont(this._fontComponents);
    }

});

/**
* Change the font family that the text will be rendered in, such as 'Arial'.
*
* Multiple CSS font families and generic fallbacks can be specified as long as
* {@link http://www.w3.org/TR/CSS2/fonts.html#propdef-font-family CSS font-family rules} are followed.
*
* To change the entire font string use {@link Phaser.Text#cssFont cssFont} instead: eg. `text.cssFont = 'bold 20pt Arial'`.
*
* @name Phaser.Text#font
* @property {string} font
*/
Object.defineProperty(Phaser.Text.prototype, 'font', {

    get: function() {
        return this._fontComponents.fontFamily;
    },

    set: function(value) {

        value = value || 'Arial';
        value = value.trim();

        // If it looks like the value should be quoted, but isn't, then quote it.
        if (!/^(?:inherit|serif|sans-serif|cursive|fantasy|monospace)$/.exec(value) && !/['",]/.exec(value))
        {
            value = "'" + value + "'";
        }

        this._fontComponents.fontFamily = value;
        this.updateFont(this._fontComponents);

    }

});

/**
* The size of the font.
*
* If the font size is specified in pixels (eg. `32` or `'32px`') then a number (ie. `32`) representing
* the font size in pixels is returned; otherwise the value with CSS unit is returned as a string (eg. `'12pt'`).
*
* @name Phaser.Text#fontSize
* @property {number|string} fontSize
*/
Object.defineProperty(Phaser.Text.prototype, 'fontSize', {

    get: function() {

        var size = this._fontComponents.fontSize;

        if (size && /(?:^0$|px$)/.exec(size))
        {
            return parseInt(size, 10);
        }
        else
        {
            return size;
        }

    },

    set: function(value) {

        value = value || '0';
        
        if (typeof value === 'number')
        {
            value = value + 'px';
        }

        this._fontComponents.fontSize = value;
        this.updateFont(this._fontComponents);

    }

});

/**
* The weight of the font: 'normal', 'bold', or {@link http://www.w3.org/TR/CSS2/fonts.html#propdef-font-weight a valid CSS font weight}.
* @name Phaser.Text#fontWeight
* @property {string} fontWeight
*/
Object.defineProperty(Phaser.Text.prototype, 'fontWeight', {

    get: function() {
        return this._fontComponents.fontWeight || 'normal';
    },

    set: function(value) {

        value = value || 'normal';
        this._fontComponents.fontWeight = value;
        this.updateFont(this._fontComponents);

    }

});

/**
* The style of the font: 'normal', 'italic', 'oblique'
* @name Phaser.Text#fontStyle
* @property {string} fontStyle
*/
Object.defineProperty(Phaser.Text.prototype, 'fontStyle', {

    get: function() {
        return this._fontComponents.fontStyle || 'normal';
    },

    set: function(value) {

        value = value || 'normal';
        this._fontComponents.fontStyle = value;
        this.updateFont(this._fontComponents);

    }

});

/**
* The variant the font: 'normal', 'small-caps'
* @name Phaser.Text#fontVariant
* @property {string} fontVariant
*/
Object.defineProperty(Phaser.Text.prototype, 'fontVariant', {

    get: function() {
        return this._fontComponents.fontVariant || 'normal';
    },

    set: function(value) {

        value = value || 'normal';
        this._fontComponents.fontVariant = value;
        this.updateFont(this._fontComponents);

    }

});

/**
* @name Phaser.Text#fill
* @property {object} fill - A canvas fillstyle that will be used on the text eg 'red', '#00FF00'.
*/
Object.defineProperty(Phaser.Text.prototype, 'fill', {

    get: function() {
        return this.style.fill;
    },

    set: function(value) {

        if (value !== this.style.fill)
        {
            this.style.fill = value;
            this.dirty = true;
        }

    }

});

/**
* Controls the horizontal alignment for multiline text.
* Can be: 'left', 'center' or 'right'.
* Does not affect single lines of text. For that please see `setTextBounds`.
* @name Phaser.Text#align
* @property {string} align
*/
Object.defineProperty(Phaser.Text.prototype, 'align', {

    get: function() {
        return this.style.align;
    },

    set: function(value) {

        if (value !== this.style.align)
        {
            this.style.align = value;
            this.dirty = true;
        }

    }

});

/**
* Horizontal alignment of the text within the `textBounds`. Can be: 'left', 'center' or 'right'.
* @name Phaser.Text#boundsAlignH
* @property {string} boundsAlignH
*/
Object.defineProperty(Phaser.Text.prototype, 'boundsAlignH', {

    get: function() {
        return this.style.boundsAlignH;
    },

    set: function(value) {

        if (value !== this.style.boundsAlignH)
        {
            this.style.boundsAlignH = value;
            this.dirty = true;
        }

    }

});

/**
* Vertical alignment of the text within the `textBounds`. Can be: 'top', 'middle' or 'bottom'.
* @name Phaser.Text#boundsAlignV
* @property {string} boundsAlignV
*/
Object.defineProperty(Phaser.Text.prototype, 'boundsAlignV', {

    get: function() {
        return this.style.boundsAlignV;
    },

    set: function(value) {

        if (value !== this.style.boundsAlignV)
        {
            this.style.boundsAlignV = value;
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#stroke
* @property {string} stroke - A canvas fillstyle that will be used on the text stroke eg 'blue', '#FCFF00'.
*/
Object.defineProperty(Phaser.Text.prototype, 'stroke', {

    get: function() {
        return this.style.stroke;
    },

    set: function(value) {

        if (value !== this.style.stroke)
        {
            this.style.stroke = value;
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#strokeThickness
* @property {number} strokeThickness - A number that represents the thickness of the stroke. Default is 0 (no stroke)
*/
Object.defineProperty(Phaser.Text.prototype, 'strokeThickness', {

    get: function() {
        return this.style.strokeThickness;
    },

    set: function(value) {

        if (value !== this.style.strokeThickness)
        {
            this.style.strokeThickness = value;
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#wordWrap
* @property {boolean} wordWrap - Indicates if word wrap should be used.
*/
Object.defineProperty(Phaser.Text.prototype, 'wordWrap', {

    get: function() {
        return this.style.wordWrap;
    },

    set: function(value) {

        if (value !== this.style.wordWrap)
        {
            this.style.wordWrap = value;
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#wordWrapWidth
* @property {number} wordWrapWidth - The width at which text will wrap.
*/
Object.defineProperty(Phaser.Text.prototype, 'wordWrapWidth', {

    get: function() {
        return this.style.wordWrapWidth;
    },

    set: function(value) {

        if (value !== this.style.wordWrapWidth)
        {
            this.style.wordWrapWidth = value;
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#lineSpacing
* @property {number} lineSpacing - Additional spacing (in pixels) between each line of text if multi-line.
*/
Object.defineProperty(Phaser.Text.prototype, 'lineSpacing', {

    get: function() {
        return this._lineSpacing;
    },

    set: function(value) {

        if (value !== this._lineSpacing)
        {
            this._lineSpacing = parseFloat(value);
            this.dirty = true;

            if (this.parent)
            {
                this.updateTransform();
            }
        }

    }

});

/**
* @name Phaser.Text#shadowOffsetX
* @property {number} shadowOffsetX - The shadowOffsetX value in pixels. This is how far offset horizontally the shadow effect will be.
*/
Object.defineProperty(Phaser.Text.prototype, 'shadowOffsetX', {

    get: function() {
        return this.style.shadowOffsetX;
    },

    set: function(value) {

        if (value !== this.style.shadowOffsetX)
        {
            this.style.shadowOffsetX = value;
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#shadowOffsetY
* @property {number} shadowOffsetY - The shadowOffsetY value in pixels. This is how far offset vertically the shadow effect will be.
*/
Object.defineProperty(Phaser.Text.prototype, 'shadowOffsetY', {

    get: function() {
        return this.style.shadowOffsetY;
    },

    set: function(value) {

        if (value !== this.style.shadowOffsetY)
        {
            this.style.shadowOffsetY = value;
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#shadowColor
* @property {string} shadowColor - The color of the shadow, as given in CSS rgba format. Set the alpha component to 0 to disable the shadow.
*/
Object.defineProperty(Phaser.Text.prototype, 'shadowColor', {

    get: function() {
        return this.style.shadowColor;
    },

    set: function(value) {

        if (value !== this.style.shadowColor)
        {
            this.style.shadowColor = value;
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#shadowBlur
* @property {number} shadowBlur - The shadowBlur value. Make the shadow softer by applying a Gaussian blur to it. A number from 0 (no blur) up to approx. 10 (depending on scene).
*/
Object.defineProperty(Phaser.Text.prototype, 'shadowBlur', {

    get: function() {
        return this.style.shadowBlur;
    },

    set: function(value) {

        if (value !== this.style.shadowBlur)
        {
            this.style.shadowBlur = value;
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#shadowStroke
* @property {boolean} shadowStroke - Sets if the drop shadow is applied to the Text stroke.
*/
Object.defineProperty(Phaser.Text.prototype, 'shadowStroke', {

    get: function() {
        return this.style.shadowStroke;
    },

    set: function(value) {

        if (value !== this.style.shadowStroke)
        {
            this.style.shadowStroke = value;
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#shadowFill
* @property {boolean} shadowFill - Sets if the drop shadow is applied to the Text fill.
*/
Object.defineProperty(Phaser.Text.prototype, 'shadowFill', {

    get: function() {
        return this.style.shadowFill;
    },

    set: function(value) {

        if (value !== this.style.shadowFill)
        {
            this.style.shadowFill = value;
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#width
* @property {number} width - The width of the Text. Setting this will modify the scale to achieve the value requested.
*/
Object.defineProperty(Phaser.Text.prototype, 'width', {

    get: function() {

        if (this.dirty)
        {
            this.updateText();
            this.dirty = false;
        }

        return this.scale.x * this.texture.frame.width;
    },

    set: function(value) {

        this.scale.x = value / this.texture.frame.width;
        this._width = value;
    }

});

/**
* @name Phaser.Text#height
* @property {number} height - The height of the Text. Setting this will modify the scale to achieve the value requested.
*/
Object.defineProperty(Phaser.Text.prototype, 'height', {

    get: function() {

        if (this.dirty)
        {
            this.updateText();
            this.dirty = false;
        }

        return this.scale.y * this.texture.frame.height;
    },

    set: function(value) {

        this.scale.y = value / this.texture.frame.height;
        this._height = value;
    }

});

Phaser.Text.fontPropertiesCache = {};

Phaser.Text.fontPropertiesCanvas = document.createElement('canvas');
Phaser.Text.fontPropertiesContext = Phaser.Text.fontPropertiesCanvas.getContext('2d');
