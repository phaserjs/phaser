/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
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
* @class Phaser.GameObject.Text
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
* @param {number} [style.maxLines=0] - The maximum number of lines to be shown for wrapped text.
* @param {number} [style.tabs=0] - The size (in pixels) of the tabs, for when text includes tab characters. 0 disables. Can be an array of varying tab sizes, one per tab stop.
*/
Phaser.GameObject.Text = function (game, x, y, text, style) {

    x = x || 0;
    y = y || 0;

    if (text === undefined || text === null)
    {
        text = '';
    }
    else
    {
        text = text.toString();
    }

    style = Phaser.Utils.extend({}, style);

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
    this.canvas = Phaser.CanvasPool.create(this);

    /**
     * @property {HTMLCanvasElement} context - The context of the canvas element that the text is rendered to.
     */
    this.context = this.canvas.getContext('2d');

    /**
    * @property {array} colors - An array of the color values as specified by {@link Phaser.GameObject.Text#addColor addColor}.
    */
    this.colors = [];

    /**
    * @property {array} strokeColors - An array of the stroke color values as specified by {@link Phaser.GameObject.Text#addStrokeColor addStrokeColor}.
    */
    this.strokeColors = [];

    /**
    * @property {array} fontStyles - An array of the font styles values as specified by {@link Phaser.GameObject.Text#addFontStyle addFontStyle}.
    */
    this.fontStyles = [];

    /**
    * @property {array} fontWeights - An array of the font weights values as specified by {@link Phaser.GameObject.Text#addFontWeight addFontWeight}.
    */
    this.fontWeights = [];

    /**
    * Should the linePositionX and Y values be automatically rounded before rendering the Text?
    * You may wish to enable this if you want to remove the effect of sub-pixel aliasing from text.
    * @property {boolean} autoRound
    * @default
    */
    this.autoRound = false;

    /**
    * Will this Text object use Basic or Advanced Word Wrapping?
    * 
    * Advanced wrapping breaks long words if they are the first of a line, and repeats the process as necessary.
    * White space is condensed (e.g., consecutive spaces are replaced with one).
    * Lines are trimmed of white space before processing.
    * 
    * It throws an error if wordWrapWidth is less than a single character.
    * @property {boolean} useAdvancedWrap
    * @default
    */
    this.useAdvancedWrap = false;

    /**
     * The Regular Expression that is used to split the text up into lines, in
     * multi-line text. By default this is `/(?:\r\n|\r|\n)/`.
     * You can change this RegExp to be anything else that you may need.
     * @property {Object} splitRegExp
     */
    this.splitRegExp = /(?:\r\n|\r|\n)/;

    /**
     * @property {number} _res - Internal canvas resolution var.
     * @private
     */
    this._res = game.resolution;

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

    this.setStyle(style);

    if (text !== '')
    {
        this.updateText();
    }

};

Phaser.GameObject.Text.prototype = Object.create(Phaser.GameObject.Sprite.prototype);
Phaser.GameObject.Text.prototype.constructor = Phaser.GameObject.Text;

/**
* Automatically called by World.preUpdate.
* 
* @method Phaser.GameObject.Text#preUpdate
* @protected
*/
Phaser.GameObject.Text.prototype.preUpdate = function () {

    if (!this.preUpdatePhysics() || !this.preUpdateLifeSpan() || !this.preUpdateInWorld())
    {
        return false;
    }

    return this.preUpdateCore();

};

/**
* Override this function to handle any special update requirements.
*
* @method Phaser.GameObject.Text#update
* @protected
*/
Phaser.GameObject.Text.prototype.update = function() {

};

/**
* Destroy this Text object, removing it from the group it belongs to.
*
* @method Phaser.GameObject.Text#destroy
* @param {boolean} [destroyChildren=true] - Should every child of this object have its destroy method called?
*/
Phaser.GameObject.Text.prototype.destroy = function (destroyChildren) {

    this.texture.destroy(true);

    Phaser.Component.Destroy.prototype.destroy.call(this, destroyChildren);

};

/**
* Sets a drop shadow effect on the Text. You can specify the horizontal and vertical distance of the drop shadow with the `x` and `y` parameters.
* The color controls the shade of the shadow (default is black) and can be either an `rgba` or `hex` value.
* The blur is the strength of the shadow. A value of zero means a hard shadow, a value of 10 means a very soft shadow.
* To remove a shadow already in place you can call this method with no parameters set.
* 
* @method Phaser.GameObject.Text#setShadow
* @param {number} [x=0] - The shadowOffsetX value in pixels. This is how far offset horizontally the shadow effect will be.
* @param {number} [y=0] - The shadowOffsetY value in pixels. This is how far offset vertically the shadow effect will be.
* @param {string} [color='rgba(0,0,0,1)'] - The color of the shadow, as given in CSS rgba or hex format. Set the alpha component to 0 to disable the shadow.
* @param {number} [blur=0] - The shadowBlur value. Make the shadow softer by applying a Gaussian blur to it. A number from 0 (no blur) up to approx. 10 (depending on scene).
* @param {boolean} [shadowStroke=true] - Apply the drop shadow to the Text stroke (if set).
* @param {boolean} [shadowFill=true] - Apply the drop shadow to the Text fill (if set).
* @return {Phaser.GameObject.Text} This Text instance.
*/
Phaser.GameObject.Text.prototype.setShadow = function (x, y, color, blur, shadowStroke, shadowFill) {

    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (color === undefined) { color = 'rgba(0, 0, 0, 1)'; }
    if (blur === undefined) { blur = 0; }
    if (shadowStroke === undefined) { shadowStroke = true; }
    if (shadowFill === undefined) { shadowFill = true; }

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
* @method Phaser.GameObject.Text#setStyle
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
* @param {number} [style.maxLines=0] - The maximum number of lines to be shown for wrapped text.
* @param {number|array} [style.tabs=0] - The size (in pixels) of the tabs, for when text includes tab characters. 0 disables. Can be an array of varying tab sizes, one per tab stop.
* @param {boolean} [update=false] - Immediately update the Text object after setting the new style? Or wait for the next frame.
* @return {Phaser.GameObject.Text} This Text instance.
*/
Phaser.GameObject.Text.prototype.setStyle = function (style, update) {

    if (update === undefined) { update = false; }

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
    style.maxLines = style.maxLines || 0;
    style.shadowOffsetX = style.shadowOffsetX || 0;
    style.shadowOffsetY = style.shadowOffsetY || 0;
    style.shadowColor = style.shadowColor || 'rgba(0,0,0,0)';
    style.shadowBlur = style.shadowBlur || 0;
    style.tabs = style.tabs || 0;

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

    if (update)
    {
        this.updateText();
    }

    return this;

};

/**
* Renders text to the internal canvas.
*
* @method Phaser.GameObject.Text#updateText
* @private
*/
Phaser.GameObject.Text.prototype.updateText = function () {

    this.texture.baseTexture.resolution = this._res;

    this.context.font = this.style.font;

    var outputText = this.text;

    if (this.style.wordWrap)
    {
        outputText = this.runWordWrap(this.text);
    }

    //  Split text into lines
    var lines = outputText.split(this.splitRegExp);

    //  Calculate text width
    var tabs = this.style.tabs;
    var lineWidths = [];
    var maxLineWidth = 0;
    var fontProperties = this.determineFontProperties(this.style.font);

    var drawnLines = lines.length;
    
    if (this.style.maxLines > 0 && this.style.maxLines < lines.length)
    {
        drawnLines = this.style.maxLines;
    }

    this._charCount = 0;

    for (var i = 0; i < drawnLines; i++)
    {
        if (tabs === 0)
        {
            //  Simple layout (no tabs)
            var lineWidth =  this.style.strokeThickness + this.padding.x;

            if (this.colors.length > 0 || this.strokeColors.length > 0 || this.fontWeights.length > 0 || this.fontStyles.length > 0)
            {
                lineWidth += this.measureLine(lines[i]);
            }
            else
            {
                lineWidth += this.context.measureText(lines[i]).width;
            }

            // Adjust for wrapped text
            if (this.style.wordWrap)
            {
                lineWidth -= this.context.measureText(' ').width;
            }
        }
        else
        {
            //  Complex layout (tabs)
            var line = lines[i].split(/(?:\t)/);
            var lineWidth = this.padding.x + this.style.strokeThickness;

            if (Array.isArray(tabs))
            {
                var tab = 0;

                for (var c = 0; c < line.length; c++)
                {
                    var section = 0;

                    if (this.colors.length > 0 || this.strokeColors.length > 0 || this.fontWeights.length > 0 || this.fontStyles.length > 0)
                    {
                        section = this.measureLine(line[c]);
                    }
                    else
                    {
                        section = Math.ceil(this.context.measureText(line[c]).width);
                    }

                    if (c > 0)
                    {
                        tab += tabs[c - 1];
                    }

                    lineWidth = tab + section;
                }
            }
            else
            {
                for (var c = 0; c < line.length; c++)
                {
                    //  How far to the next tab?
                    if (this.colors.length > 0 || this.strokeColors.length > 0 || this.fontWeights.length > 0 || this.fontStyles.length > 0)
                    {
                        lineWidth += this.measureLine(line[c]);
                    }
                    else
                    {
                        lineWidth += Math.ceil(this.context.measureText(line[c]).width);
                    }

                    var diff = this.game.math.snapToCeil(lineWidth, tabs) - lineWidth;

                    lineWidth += diff;
                }
            }
        }

        lineWidths[i] = Math.ceil(lineWidth);
        maxLineWidth = Math.max(maxLineWidth, lineWidths[i]);
    }

    this.canvas.width = maxLineWidth * this._res;
    
    //  Calculate text height
    var lineHeight = fontProperties.fontSize + this.style.strokeThickness + this.padding.y;
    var height = lineHeight * drawnLines;
    var lineSpacing = this._lineSpacing;

    if (lineSpacing < 0 && Math.abs(lineSpacing) > lineHeight)
    {
        lineSpacing = -lineHeight;
    }

    //  Adjust for line spacing
    if (lineSpacing !== 0)
    {
        height += (lineSpacing > 0) ? lineSpacing * lines.length : lineSpacing * (lines.length - 1);
    }

    this.canvas.height = height * this._res;

    this.context.scale(this._res, this._res);

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

    //  HERE

    var linePositionX;
    var linePositionY;

    this._charCount = 0;

    //  Draw text line by line
    for (i = 0; i < drawnLines; i++)
    {
        //  Split the line by

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

        if (this.autoRound)
        {
            linePositionX = Math.round(linePositionX);
            linePositionY = Math.round(linePositionY);
        }

        if (this.colors.length > 0 || this.strokeColors.length > 0 || this.fontWeights.length > 0 || this.fontStyles.length > 0)
        {
            this.updateLine(lines[i], linePositionX, linePositionY);
        }
        else
        {
            if (this.style.stroke && this.style.strokeThickness)
            {
                this.updateShadow(this.style.shadowStroke);

                if (tabs === 0)
                {
                    this.context.strokeText(lines[i], linePositionX, linePositionY);
                }
                else
                {
                    this.renderTabLine(lines[i], linePositionX, linePositionY, false);
                }
            }

            if (this.style.fill)
            {
                this.updateShadow(this.style.shadowFill);

                if (tabs === 0)
                {
                    this.context.fillText(lines[i], linePositionX, linePositionY);
                }
                else
                {
                    this.renderTabLine(lines[i], linePositionX, linePositionY, true);
                }
            }
        }
    }

    this.updateTexture();

    this.dirty = false;

};

/**
* Renders a line of text that contains tab characters if Text.tab > 0.
* Called automatically by updateText.
*
* @method Phaser.GameObject.Text#renderTabLine
* @private
* @param {string} line - The line of text to render.
* @param {integer} x - The x position to start rendering from.
* @param {integer} y - The y position to start rendering from.
* @param {boolean} fill - If true uses fillText, if false uses strokeText.
*/
Phaser.GameObject.Text.prototype.renderTabLine = function (line, x, y, fill) {

    var text = line.split(/(?:\t)/);
    var tabs = this.style.tabs;
    var snap = 0;

    if (Array.isArray(tabs))
    {
        var tab = 0;

        for (var c = 0; c < text.length; c++)
        {
            if (c > 0)
            {
                tab += tabs[c - 1];
            }

            snap = x + tab;

            if (fill)
            {
                this.context.fillText(text[c], snap, y);
            }
            else
            {
                this.context.strokeText(text[c], snap, y);
            }
        }
    }
    else
    {
        for (var c = 0; c < text.length; c++)
        {
            var section = Math.ceil(this.context.measureText(text[c]).width);

            //  How far to the next tab?
            snap = this.game.math.snapToCeil(x, tabs);

            if (fill)
            {
                this.context.fillText(text[c], snap, y);
            }
            else
            {
                this.context.strokeText(text[c], snap, y);
            }

            x = snap + section;
        }
    }

};

/**
* Sets the Shadow on the Text.context based on the Style settings, or disables it if not enabled.
* This is called automatically by Text.updateText.
*
* @method Phaser.GameObject.Text#updateShadow
* @param {boolean} state - If true the shadow will be set to the Style values, otherwise it will be set to zero.
*/
Phaser.GameObject.Text.prototype.updateShadow = function (state) {

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
* Measures a line of text character by character taking into the account the specified character styles.
*
* @method Phaser.GameObject.Text#measureLine
* @private
* @param {string} line - The line of text to measure.
* @return {integer} length of the line.
*/
Phaser.GameObject.Text.prototype.measureLine = function (line) {

    var lineLength = 0;

    for (var i = 0; i < line.length; i++)
    {
        var letter = line[i];

        if (this.fontWeights.length > 0 || this.fontStyles.length > 0)
        {
            var components = this.fontToComponents(this.context.font);

            if (this.fontStyles[this._charCount])
            {
                components.fontStyle = this.fontStyles[this._charCount];
            }

            if (this.fontWeights[this._charCount])
            {
                components.fontWeight = this.fontWeights[this._charCount];
            }

            this.context.font = this.componentsToFont(components);
        }

        if (this.style.stroke && this.style.strokeThickness)
        {
            if (this.strokeColors[this._charCount])
            {
                this.context.strokeStyle = this.strokeColors[this._charCount];
            }

            this.updateShadow(this.style.shadowStroke);
        }

        if (this.style.fill)
        {
            if (this.colors[this._charCount])
            {
                this.context.fillStyle = this.colors[this._charCount];
            }

            this.updateShadow(this.style.shadowFill);
        }

        lineLength += this.context.measureText(letter).width;

        this._charCount++;
    }

    return Math.ceil(lineLength);
};

/**
* Updates a line of text, applying fill and stroke per-character colors or style and weight per-character font if applicable.
*
* @method Phaser.GameObject.Text#updateLine
* @private
*/
Phaser.GameObject.Text.prototype.updateLine = function (line, x, y) {

    for (var i = 0; i < line.length; i++)
    {
        var letter = line[i];

        if (this.fontWeights.length > 0 || this.fontStyles.length > 0)
        {
            var components = this.fontToComponents(this.context.font);

            if (this.fontStyles[this._charCount])
            {
                components.fontStyle = this.fontStyles[this._charCount];
            }
        
            if (this.fontWeights[this._charCount])
            {
                components.fontWeight = this.fontWeights[this._charCount];
            }
      
            this.context.font = this.componentsToFont(components);
        }

        if (this.style.stroke && this.style.strokeThickness)
        {
            if (this.strokeColors[this._charCount])
            {
                this.context.strokeStyle = this.strokeColors[this._charCount];
            }

            this.updateShadow(this.style.shadowStroke);
            this.context.strokeText(letter, x, y);
        }

        if (this.style.fill)
        {
            if (this.colors[this._charCount])
            {
                this.context.fillStyle = this.colors[this._charCount];
            }

            this.updateShadow(this.style.shadowFill);
            this.context.fillText(letter, x, y);
        }

        x += this.context.measureText(letter).width;

        this._charCount++;
    }

};

/**
* Clears any text fill or stroke colors that were set by `addColor` or `addStrokeColor`.
*
* @method Phaser.GameObject.Text#clearColors
* @return {Phaser.GameObject.Text} This Text instance.
*/
Phaser.GameObject.Text.prototype.clearColors = function () {

    this.colors = [];
    this.strokeColors = [];
    this.dirty = true;

    return this;

};

/**
* Clears any text styles or weights font that were set by `addFontStyle` or `addFontWeight`.
*
* @method Phaser.GameObject.Text#clearFontValues
* @return {Phaser.GameObject.Text} This Text instance.
*/
Phaser.GameObject.Text.prototype.clearFontValues = function () {

    this.fontStyles = [];
    this.fontWeights = [];
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
* If you wish to change the stroke color see addStrokeColor instead.
*
* @method Phaser.GameObject.Text#addColor
* @param {string} color - A canvas fillstyle that will be used on the text eg `red`, `#00FF00`, `rgba()`.
* @param {number} position - The index of the character in the string to start applying this color value from.
* @return {Phaser.GameObject.Text} This Text instance.
*/
Phaser.GameObject.Text.prototype.addColor = function (color, position) {

    this.colors[position] = color;
    this.dirty = true;

    return this;

};

/**
* Set specific stroke colors for certain characters within the Text.
*
* It works by taking a color value, which is a typical HTML string such as `#ff0000` or `rgb(255,0,0)` and a position.
* The position value is the index of the character in the Text string to start applying this color to.
* Once set the color remains in use until either another color or the end of the string is encountered.
* For example if the Text was `Photon Storm` and you did `Text.addColor('#ffff00', 6)` it would color in the word `Storm` in yellow.
*
* This has no effect if stroke is disabled or has a thickness of 0.
*
* If you wish to change the text fill color see addColor instead.
*
* @method Phaser.GameObject.Text#addStrokeColor
* @param {string} color - A canvas fillstyle that will be used on the text stroke eg `red`, `#00FF00`, `rgba()`.
* @param {number} position - The index of the character in the string to start applying this color value from.
* @return {Phaser.GameObject.Text} This Text instance.
*/
Phaser.GameObject.Text.prototype.addStrokeColor = function (color, position) {

    this.strokeColors[position] = color;
    this.dirty = true;

    return this;

};

/**
* Set specific font styles for certain characters within the Text.
*
* It works by taking a font style value, which is a typical string such as `normal`, `italic` or `oblique`.
* The position value is the index of the character in the Text string to start applying this font style to.
* Once set the font style remains in use until either another font style or the end of the string is encountered.
* For example if the Text was `Photon Storm` and you did `Text.addFontStyle('italic', 6)` it would font style in the word `Storm` in italic.
*
* If you wish to change the text font weight see addFontWeight instead.
*
* @method Phaser.GameObject.Text#addFontStyle
* @param {string} style - A canvas font-style that will be used on the text style eg `normal`, `italic`, `oblique`.
* @param {number} position - The index of the character in the string to start applying this font style value from.
* @return {Phaser.GameObject.Text} This Text instance.
*/
Phaser.GameObject.Text.prototype.addFontStyle = function (style, position) {

    this.fontStyles[position] = style;
    this.dirty = true;

    return this;

};

/**
* Set specific font weights for certain characters within the Text.
*
* It works by taking a font weight value, which is a typical string such as `normal`, `bold`, `bolder`, etc.
* The position value is the index of the character in the Text string to start applying this font weight to.
* Once set the font weight remains in use until either another font weight or the end of the string is encountered.
* For example if the Text was `Photon Storm` and you did `Text.addFontWeight('bold', 6)` it would font weight in the word `Storm` in bold.
*
* If you wish to change the text font style see addFontStyle instead.
*
* @method Phaser.GameObject.Text#addFontWeight
* @param {string} style - A canvas font-weight that will be used on the text weight eg `normal`, `bold`, `bolder`, `lighter`, etc.
* @param {number} position - The index of the character in the string to start applying this font weight value from.
* @return {Phaser.GameObject.Text} This Text instance.
*/
Phaser.GameObject.Text.prototype.addFontWeight = function (weight, position) {

    this.fontWeights[position] = weight;
    this.dirty = true;

    return this;

};

/**
* Runs the given text through the Text.runWordWrap function and returns
* the results as an array, where each element of the array corresponds to a wrapped
* line of text.
*
* Useful if you wish to control pagination on long pieces of content.
*
* @method Phaser.GameObject.Text#precalculateWordWrap
* @param {string} text - The text for which the wrapping will be calculated.
* @return {array} An array of strings with the pieces of wrapped text.
*/
Phaser.GameObject.Text.prototype.precalculateWordWrap = function (text) {

    this.texture.baseTexture.resolution = this._res;
    this.context.font = this.style.font;

    var wrappedLines = this.runWordWrap(text);

    return wrappedLines.split(/(?:\r\n|\r|\n)/);

};

/**
* Greedy wrapping algorithm that will wrap words as the line grows longer than its horizontal bounds.
*
* @method Phaser.GameObject.Text#runWordWrap
* @param {string} text - The text to perform word wrap detection against.
* @private
*/
Phaser.GameObject.Text.prototype.runWordWrap = function (text) {

    if (this.useAdvancedWrap)
    {
        return this.advancedWordWrap(text);
    }
    else
    {
        return this.basicWordWrap(text);
    }

};

/**
* Advanced wrapping algorithm that will wrap words as the line grows longer than its horizontal bounds.
* White space is condensed (e.g., consecutive spaces are replaced with one).
* Lines are trimmed of white space before processing.
* Throws an error if the user was smart enough to specify a wordWrapWidth less than a single character.
*
* @method Phaser.GameObject.Text#advancedWordWrap
* @param {string} text - The text to perform word wrap detection against.
* @private
*/
Phaser.GameObject.Text.prototype.advancedWordWrap = function (text) {

    var context = this.context;
    var wordWrapWidth = this.style.wordWrapWidth;

    var output = '';

    // (1) condense whitespace
    // (2) split into lines
    var lines = text
        .replace(/ +/gi, ' ')
        .split(/\r?\n/gi);

    var linesCount = lines.length;

    for (var i = 0; i < linesCount; i++)
    {
        var line = lines[i];
        var out = '';

        // trim whitespace
        line = line.replace(/^ *|\s*$/gi, '');

        // if entire line is less than wordWrapWidth
        // append the entire line and exit early
        var lineWidth = context.measureText(line).width;

        if (lineWidth < wordWrapWidth)
        {
            output += line + '\n';
            continue;
        }

        // otherwise, calculate new lines
        var currentLineWidth = wordWrapWidth;

        // split into words
        var words = line.split(' ');

        for (var j = 0; j < words.length; j++)
        {
            var word = words[j];
            var wordWithSpace = word + ' ';
            var wordWidth = context.measureText(wordWithSpace).width;

            if (wordWidth > currentLineWidth)
            {
                // break word
                if (j === 0)
                {
                    // shave off letters from word until it's small enough
                    var newWord = wordWithSpace;

                    while (newWord.length)
                    {
                        newWord = newWord.slice(0, -1);
                        wordWidth = context.measureText(newWord).width;

                        if (wordWidth <= currentLineWidth)
                        {
                            break;
                        }
                    }

                    // if wordWrapWidth is too small for even a single
                    // letter, shame user failure with a fatal error
                    if (!newWord.length)
                    {
                        throw new Error('This text\'s wordWrapWidth setting is less than a single character!');
                    }

                    // replace current word in array with remainder
                    var secondPart = word.substr(newWord.length);

                    words[j] = secondPart;

                    // append first piece to output
                    out += newWord;
                }

                // if existing word length is 0, don't include it
                var offset = (words[j].length) ? j : j + 1;

                // collapse rest of sentence
                var remainder = words.slice(offset).join(' ')
                // remove any trailing white space
                .replace(/[ \n]*$/gi, '');

                // prepend remainder to next line
                lines[i + 1] = remainder + ' ' + (lines[i + 1] || '');
                linesCount = lines.length;

                break; // processing on this line

                // append word with space to output
            }
            else
            {
                out += wordWithSpace;
                currentLineWidth -= wordWidth;
            }
        }

        // append processed line to output
        output += out.replace(/[ \n]*$/gi, '') + '\n';
    }

    // trim the end of the string
    output = output.replace(/[\s|\n]*$/gi, '');

    return output;

};

/**
* Greedy wrapping algorithm that will wrap words as the line grows longer than its horizontal bounds.
*
* @method Phaser.GameObject.Text#basicWordWrap
* @param {string} text - The text to perform word wrap detection against.
* @private
*/
Phaser.GameObject.Text.prototype.basicWordWrap = function (text) {

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
* @method Phaser.GameObject.Text#updateFont
* @private
* @param {object} components - Font components.
*/
Phaser.GameObject.Text.prototype.updateFont = function (components) {

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
* @method Phaser.GameObject.Text#fontToComponents
* @private
* @param {string} font - a CSS font string
*/
Phaser.GameObject.Text.prototype.fontToComponents = function (font) {

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
        var family = m[5].trim();

        // If it looks like the value should be quoted, but isn't, then quote it.
        if (!/^(?:inherit|serif|sans-serif|cursive|fantasy|monospace)$/.exec(family) && !/['",]/.exec(family))
        {
            family = "'" + family + "'";
        }

        return {
            font: font,
            fontStyle: m[1] || 'normal',
            fontVariant: m[2] || 'normal',
            fontWeight: m[3] || 'normal',
            fontSize: m[4] || 'medium',
            fontFamily: family
        };
    }
    else
    {
        console.warn("Phaser.GameObject.Text - unparsable CSS font: " + font);

        return {
            font: font
        };
    }

};

/**
* Converts individual font components (see `fontToComponents`) to a short CSS font string.
*
* @method Phaser.GameObject.Text#componentsToFont
* @private
* @param {object} components - Font components.
*/
Phaser.GameObject.Text.prototype.componentsToFont = function (components) {

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
* Use the optional `immediate` argument if you need the Text display to update immediately.
* 
* If not it will re-create the texture of this Text object during the next time the render
* loop is called.
*
* @method Phaser.GameObject.Text#setText
* @param {string} [text] - The text to be displayed. Set to an empty string to clear text that is already present.
* @param {boolean} [immediate=false] - Update the texture used by this Text object immediately (true) or automatically during the next render loop (false).
* @return {Phaser.GameObject.Text} This Text instance.
*/
Phaser.GameObject.Text.prototype.setText = function (text, immediate) {

    if (immediate === undefined) { immediate = false; }

    this.text = text.toString() || '';

    if (immediate)
    {
        this.updateText();
    }
    else
    {
        this.dirty = true;
    }

    return this;

};

/**
 * Converts the given array into a tab delimited string and then updates this Text object.
 * This is mostly used when you want to display external data using tab stops.
 *
 * The array can be either single or multi dimensional depending on the result you need:
 *
 * `[ 'a', 'b', 'c' ]` would convert in to `"a\tb\tc"`.
 *
 * Where as:
 *
 * `[
 *      [ 'a', 'b', 'c' ],
 *      [ 'd', 'e', 'f']
 * ]`
 *
 * would convert in to: `"a\tb\tc\nd\te\tf"`
 *
 * @method Phaser.GameObject.Text#parseList
 * @param {array} list - The array of data to convert into a string.
 * @return {Phaser.GameObject.Text} This Text instance.
 */
Phaser.GameObject.Text.prototype.parseList = function (list) {

    if (!Array.isArray(list))
    {
        return this;
    }
    else
    {
        var s = "";

        for (var i = 0; i < list.length; i++)
        {
            if (Array.isArray(list[i]))
            {
                s += list[i].join("\t");

                if (i < list.length - 1)
                {
                    s += "\n";
                }
            }
            else
            {
                s += list[i];

                if (i < list.length - 1)
                {
                    s += "\t";
                }
            }
        }
    }

    this.text = s;
    this.dirty = true;

    return this;

};

/**
 * The Text Bounds is a rectangular region that you control the dimensions of into which the Text object itself is positioned,
 * regardless of the number of lines in the text, the font size or any other attribute.
 *
 * Alignment is controlled via the properties `boundsAlignH` and `boundsAlignV` within the Text.style object, or can be directly
 * set through the setters `Text.boundsAlignH` and `Text.boundsAlignV`. Bounds alignment is independent of text alignment.
 *
 * For example: If your game is 800x600 in size and you set the text bounds to be 0,0,800,600 then by setting boundsAlignH to
 * 'center' and boundsAlignV to 'bottom' the text will render in the center and at the bottom of your game window, regardless of
 * how many lines of text there may be. Even if you adjust the text content or change the style it will remain at the bottom center
 * of the text bounds.
 *
 * This is especially powerful when you need to align text against specific coordinates in your game, but the actual text dimensions
 * may vary based on font (say for multi-lingual games).
 *
 * If `Text.wordWrapWidth` is greater than the width of the text bounds it is clamped to match the bounds width.
 *
 * Call this method with no arguments given to reset an existing textBounds.
 * 
 * It works by calculating the final position based on the Text.canvas size, which is modified as the text is updated. Some fonts
 * have additional padding around them which you can mitigate by tweaking the Text.padding property. It then adjusts the `pivot`
 * property based on the given bounds and canvas size. This means if you need to set the pivot property directly in your game then
 * you either cannot use `setTextBounds` or you must place the Text object inside another DisplayObject on which you set the pivot.
 *
 * @method Phaser.GameObject.Text#setTextBounds
 * @param {number} [x] - The x coordinate of the Text Bounds region.
 * @param {number} [y] - The y coordinate of the Text Bounds region.
 * @param {number} [width] - The width of the Text Bounds region.
 * @param {number} [height] - The height of the Text Bounds region.
 * @return {Phaser.GameObject.Text} This Text instance.
 */
Phaser.GameObject.Text.prototype.setTextBounds = function (x, y, width, height) {

    if (x === undefined)
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

        if (this.style.wordWrapWidth > width)
        {
            this.style.wordWrapWidth = width;
        }
    }

    this.updateTexture();
    
    return this;

};

/**
 * Updates the texture based on the canvas dimensions.
 *
 * @method Phaser.GameObject.Text#updateTexture
 * @private
 */
Phaser.GameObject.Text.prototype.updateTexture = function () {

    var base = this.texture.baseTexture;
    var crop = this.texture.crop;
    var frame = this.texture.frame;

    var w = this.canvas.width;
    var h = this.canvas.height;

    base.width = w;
    base.height = h;

    crop.width = w;
    crop.height = h;

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
            x += this.textBounds.width - this.canvas.width / this.resolution;
        }
        else if (this.style.boundsAlignH === 'center')
        {
            x += this.textBounds.halfWidth - (this.canvas.width / this.resolution / 2);
        }

        if (this.style.boundsAlignV === 'bottom')
        {
            y += this.textBounds.height - this.canvas.height / this.resolution;
        }
        else if (this.style.boundsAlignV === 'middle')
        {
            y += this.textBounds.halfHeight - (this.canvas.height / this.resolution / 2);
        }

        this.pivot.x = -x;
        this.pivot.y = -y;
    }

    //  Can't render something with a zero sized dimension
    this.renderable = (w !== 0 && h !== 0);

    this.texture.requiresReTint = true;

    this.texture.baseTexture.dirty();

};

/**
* Calculates the ascent, descent and fontSize of a given font style.
*
* @method Phaser.GameObject.Text#determineFontProperties
* @private
* @param {object} fontStyle 
*/
Phaser.GameObject.Text.prototype.determineFontProperties = function (fontStyle) {

    var properties = Phaser.GameObject.Text.fontPropertiesCache[fontStyle];

    if (!properties)
    {
        properties = {};
        
        var canvas = Phaser.GameObject.Text.fontPropertiesCanvas;
        var context = Phaser.GameObject.Text.fontPropertiesContext;

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

            Phaser.GameObject.Text.fontPropertiesCache[fontStyle] = properties;

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

        Phaser.GameObject.Text.fontPropertiesCache[fontStyle] = properties;
    }

    return properties;

};

/**
* Returns the bounds of the Text as a rectangle.
* The bounds calculation takes the worldTransform into account.
*
* @method Phaser.GameObject.Text#getBounds
* @param {Phaser.Matrix} matrix - The transformation matrix of the Text.
* @return {Phaser.Rectangle} The framing rectangle
*/
Phaser.GameObject.Text.prototype.getBounds = function (matrix) {

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
* @name Phaser.GameObject.Text#text
* @property {string} text
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'text', {

    get: function() {
        return this._text;
    },

    set: function(value) {

        if (value !== this._text)
        {
            this._text = value.toString() || '';
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
* This is equivalent of the `font` property specified to {@link Phaser.GameObject.Text#setStyle setStyle}, except
* that unlike using `setStyle` this will not change any current font fill/color settings.
*
* The CSS font string can also be individually altered with the `font`, `fontSize`, `fontWeight`, `fontStyle`, and `fontVariant` properties.
*
* @name Phaser.GameObject.Text#cssFont
* @property {string} cssFont
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'cssFont', {

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
* To change the entire font string use {@link Phaser.GameObject.Text#cssFont cssFont} instead: eg. `text.cssFont = 'bold 20pt Arial'`.
*
* @name Phaser.GameObject.Text#font
* @property {string} font
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'font', {

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
* @name Phaser.GameObject.Text#fontSize
* @property {number|string} fontSize
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'fontSize', {

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
* @name Phaser.GameObject.Text#fontWeight
* @property {string} fontWeight
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'fontWeight', {

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
* @name Phaser.GameObject.Text#fontStyle
* @property {string} fontStyle
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'fontStyle', {

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
* @name Phaser.GameObject.Text#fontVariant
* @property {string} fontVariant
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'fontVariant', {

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
* @name Phaser.GameObject.Text#fill
* @property {object} fill - A canvas fillstyle that will be used on the text eg 'red', '#00FF00'.
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'fill', {

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
* @name Phaser.GameObject.Text#align
* @property {string} align
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'align', {

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
* The resolution of the canvas the text is rendered to.
* This defaults to match the resolution of the renderer, but can be changed on a per Text object basis.
* @name Phaser.GameObject.Text#resolution
* @property {integer} resolution
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'resolution', {

    get: function() {
        return this._res;
    },

    set: function(value) {

        if (value !== this._res)
        {
            this._res = value;
            this.dirty = true;
        }

    }

});

/**
* The size (in pixels) of the tabs, for when text includes tab characters. 0 disables. 
* Can be an integer or an array of varying tab sizes, one tab per element.
* For example if you set tabs to 100 then when Text encounters a tab it will jump ahead 100 pixels.
* If you set tabs to be `[100,200]` then it will set the first tab at 100px and the second at 200px.
* 
* @name Phaser.GameObject.Text#tabs
* @property {integer|array} tabs
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'tabs', {

    get: function() {
        return this.style.tabs;
    },

    set: function(value) {

        if (value !== this.style.tabs)
        {
            this.style.tabs = value;
            this.dirty = true;
        }

    }

});

/**
* Horizontal alignment of the text within the `textBounds`. Can be: 'left', 'center' or 'right'.
* @name Phaser.GameObject.Text#boundsAlignH
* @property {string} boundsAlignH
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'boundsAlignH', {

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
* @name Phaser.GameObject.Text#boundsAlignV
* @property {string} boundsAlignV
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'boundsAlignV', {

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
* @name Phaser.GameObject.Text#stroke
* @property {string} stroke - A canvas fillstyle that will be used on the text stroke eg 'blue', '#FCFF00'.
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'stroke', {

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
* @name Phaser.GameObject.Text#strokeThickness
* @property {number} strokeThickness - A number that represents the thickness of the stroke. Default is 0 (no stroke)
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'strokeThickness', {

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
* @name Phaser.GameObject.Text#wordWrap
* @property {boolean} wordWrap - Indicates if word wrap should be used.
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'wordWrap', {

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
* @name Phaser.GameObject.Text#wordWrapWidth
* @property {number} wordWrapWidth - The width at which text will wrap.
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'wordWrapWidth', {

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
* @name Phaser.GameObject.Text#lineSpacing
* @property {number} lineSpacing - Additional spacing (in pixels) between each line of text if multi-line.
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'lineSpacing', {

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
* @name Phaser.GameObject.Text#shadowOffsetX
* @property {number} shadowOffsetX - The shadowOffsetX value in pixels. This is how far offset horizontally the shadow effect will be.
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'shadowOffsetX', {

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
* @name Phaser.GameObject.Text#shadowOffsetY
* @property {number} shadowOffsetY - The shadowOffsetY value in pixels. This is how far offset vertically the shadow effect will be.
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'shadowOffsetY', {

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
* @name Phaser.GameObject.Text#shadowColor
* @property {string} shadowColor - The color of the shadow, as given in CSS rgba format. Set the alpha component to 0 to disable the shadow.
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'shadowColor', {

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
* @name Phaser.GameObject.Text#shadowBlur
* @property {number} shadowBlur - The shadowBlur value. Make the shadow softer by applying a Gaussian blur to it. A number from 0 (no blur) up to approx. 10 (depending on scene).
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'shadowBlur', {

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
* @name Phaser.GameObject.Text#shadowStroke
* @property {boolean} shadowStroke - Sets if the drop shadow is applied to the Text stroke.
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'shadowStroke', {

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
* @name Phaser.GameObject.Text#shadowFill
* @property {boolean} shadowFill - Sets if the drop shadow is applied to the Text fill.
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'shadowFill', {

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
* The width of the Text object in pixels. This is width of the Texture frame / the Text.resolution.
* @name Phaser.GameObject.Text#width
* @property {number} width - The width of the Text. Setting this will modify the scale to achieve the value requested.
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'width', {

    get: function() {

        if (this.dirty)
        {
            this.updateText();
            this.dirty = false;
        }

        return this.scale.x * (this.texture.frame.width / this.resolution);
    },

    set: function(value) {

        this.scale.x = value / this.texture.frame.width;
        this._width = value;
    }

});

/**
* The height of the Text object in pixels. This is height of the Texture frame / the Text.resolution.
* @name Phaser.GameObject.Text#height
* @property {number} height - The height of the Text. Setting this will modify the scale to achieve the value requested.
*/
Object.defineProperty(Phaser.GameObject.Text.prototype, 'height', {

    get: function() {

        if (this.dirty)
        {
            this.updateText();
            this.dirty = false;
        }

        return this.scale.y * (this.texture.frame.height / this.resolution);
    },

    set: function(value) {

        this.scale.y = value / this.texture.frame.height;
        this._height = value;
    }

});

Phaser.GameObject.Text.fontPropertiesCache = {};

Phaser.GameObject.Text.fontPropertiesCanvas = document.createElement('canvas');
Phaser.GameObject.Text.fontPropertiesContext = Phaser.GameObject.Text.fontPropertiesCanvas.getContext('2d');
