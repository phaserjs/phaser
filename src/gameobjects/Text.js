/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new game object for displaying Text.
*
* This uses a local hidden Canvas object and renders the type into it. It then makes a texture from this for renderning to the view.
* Because of this you can only display fonts that are currently loaded and available to the browser: fonts must be pre-loaded.
*
* See {@link http://www.jordanm.co.uk/tinytype this compatibility table} for the available default fonts across mobile browsers.
*
* @class Phaser.Text
* @extends PIXI.Text
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {number} x - X position of the new text object.
* @param {number} y - Y position of the new text object.
* @param {string} text - The actual text that will be written.
* @param {object} style - The style object containing style attributes like font, font size ,
*/
Phaser.Text = function (game, x, y, text, style) {

    x = x || 0;
    y = y || 0;
    text = text || ' ';
    style = style || {};

    if (text.length === 0)
    {
        text = ' ';
    }
    else
    {
        text = text.toString();
    }

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    * @protected
    */
    this.game = game;

    /**
    * @property {boolean} exists - If exists = false then the Text isn't updated by the core game loop.
    * @default
    */
    this.exists = true;

    /**
    * @property {string} name - The user defined name given to this object.
    * @default
    */
    this.name = '';

    /**
    * @property {number} type - The const type of this object.
    * @default
    */
    this.type = Phaser.TEXT;

    /**
    * @property {number} z - The z-depth value of this object within its Group (remember the World is a Group as well). No two objects in a Group can have the same z value.
    */
    this.z = 0;

    /**
    * @property {Phaser.Point} world - The world coordinates of this Sprite. This differs from the x/y coordinates which are relative to the Sprites container.
    */
    this.world = new Phaser.Point(x, y);

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
    * @property {Phaser.Events} events - The Events you can subscribe to that are dispatched when certain things happen on this Sprite or its components.
    */
    this.events = new Phaser.Events(this);

    /**
    * @property {?Phaser.InputHandler} input - The Input Handler for this object. Needs to be enabled with image.inputEnabled = true before you can use it.
    */
    this.input = null;

    /**
    * @property {Phaser.Point} cameraOffset - If this object is fixedToCamera then this stores the x/y offset that its drawn at, from the top-left of the camera view.
    */
    this.cameraOffset = new Phaser.Point();

    /**
    * @property {array} colors - An array of the color values as specified by {@link Phaser.Text#addColor addColor}.
    */
    this.colors = [];

    this.setStyle(style);

    PIXI.Text.call(this, text, this.style);

    this.position.set(x, y);

    /**
    * A small internal cache:
    * 0 = previous position.x
    * 1 = previous position.y
    * 2 = previous rotation
    * 3 = renderID
    * 4 = fresh? (0 = no, 1 = yes)
    * 5 = outOfBoundsFired (0 = no, 1 = yes)
    * 6 = exists (0 = no, 1 = yes)
    * 7 = fixed to camera (0 = no, 1 = yes)
    * 8 = destroy phase? (0 = no, 1 = yes)
    * @property {Array} _cache
    * @private
    */
    this._cache = [ 0, 0, 0, 0, 1, 0, 1, 0, 0 ];

    if (text !== ' ')
    {
        this.updateText();
    }

};

Phaser.Text.prototype = Object.create(PIXI.Text.prototype);
Phaser.Text.prototype.constructor = Phaser.Text;

/**
* Automatically called by World.preUpdate.
* 
* @method Phaser.Text#preUpdate
* @protected
*/
Phaser.Text.prototype.preUpdate = function () {

    this._cache[0] = this.world.x;
    this._cache[1] = this.world.y;
    this._cache[2] = this.rotation;

    if (!this.exists || !this.parent.exists)
    {
        this.renderOrderID = -1;
        return false;
    }

    if (this.autoCull)
    {
        //  Won't get rendered but will still get its transform updated
        this.renderable = this.game.world.camera.screenView.intersects(this.getBounds());
    }

    this.world.setTo(this.game.camera.x + this.worldTransform.tx, this.game.camera.y + this.worldTransform.ty);

    if (this.visible)
    {
        this._cache[3] = this.game.stage.currentRenderOrderID++;
    }

    //  Update any Children
    for (var i = 0, len = this.children.length; i < len; i++)
    {
        this.children[i].preUpdate();
    }

    return true;

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
* Automatically called by World.postUpdate.
* 
* @method Phaser.Text#postUpdate
* @protected
*/
Phaser.Text.prototype.postUpdate = function () {

    if (this._cache[7] === 1)
    {
        this.position.x = (this.game.camera.view.x + this.cameraOffset.x) / this.game.camera.scale.x;
        this.position.y = (this.game.camera.view.y + this.cameraOffset.y) / this.game.camera.scale.y;
    }

    //  Update any Children
    for (var i = 0, len = this.children.length; i < len; i++)
    {
        this.children[i].postUpdate();
    }

};

/**
* Destroy this Text object, removing it from the group it belongs to.
*
* @method Phaser.Text#destroy
* @param {boolean} [destroyChildren=true] - Should every child of this object have its destroy method called?
*/
Phaser.Text.prototype.destroy = function (destroyChildren) {

    if (this.game === null || this.destroyPhase) { return; }

    if (typeof destroyChildren === 'undefined') { destroyChildren = true; }

    this._cache[8] = 1;

    if (this.events)
    {
        this.events.onDestroy.dispatch(this);
    }

    if (this.parent)
    {
        if (this.parent instanceof Phaser.Group)
        {
            this.parent.remove(this);
        }
        else
        {
            this.parent.removeChild(this);
        }
    }

    this.texture.destroy(true);

    if (this.canvas.parentNode)
    {
        this.canvas.parentNode.removeChild(this.canvas);
    }
    else
    {
        this.canvas = null;
        this.context = null;
    }

    var i = this.children.length;

    if (destroyChildren)
    {
        while (i--)
        {
            this.children[i].destroy(destroyChildren);
        }
    }
    else
    {
        while (i--)
        {
            this.removeChild(this.children[i]);
        }
    }

    this.exists = false;
    this.visible = false;

    this.filters = null;
    this.mask = null;
    this.game = null;

    this._cache[8] = 0;

};

/**
* Sets a drop-shadow effect on the Text.
* 
* @method Phaser.Text#setShadow
* @param {number} [x=0] - The shadowOffsetX value in pixels. This is how far offset horizontally the shadow effect will be.
* @param {number} [y=0] - The shadowOffsetY value in pixels. This is how far offset vertically the shadow effect will be.
* @param {string} [color='rgba(0,0,0,0)'] - The color of the shadow, as given in CSS rgba format. Set the alpha component to 0 to disable the shadow.
* @param {number} [blur=0] - The shadowBlur value. Make the shadow softer by applying a Gaussian blur to it. A number from 0 (no blur) up to approx. 10 (depending on scene).
*/
Phaser.Text.prototype.setShadow = function (x, y, color, blur) {

    this.style.shadowOffsetX = x || 0;
    this.style.shadowOffsetY = y || 0;
    this.style.shadowColor = color || 'rgba(0,0,0,0)';
    this.style.shadowBlur = blur || 0;
    this.dirty = true;

};

/**
* Set the style of the text by passing a single style object to it.
*
* @method Phaser.Text#setStyle
* @param {Object} [style] - The style properties to be set on the Text.
* @param {string} [style.font='bold 20pt Arial'] - The style and size of the font.
* @param {string} [style.fontStyle=(from font)] - The style of the font (eg. 'italic'): overrides the value in `style.font`.
* @param {string} [style.fontVariant=(from font)] - The variant of the font (eg. 'small-caps'): overrides the value in `style.font`.
* @param {string} [style.fontWeight=(from font)] - The weight of the font (eg. 'bold'): overrides the value in `style.font`.
* @param {string|number} [style.fontSize=(from font)] - The size of the font (eg. 32 or '32px'): overrides the value in `style.font`.
* @param {string} [style.fill='black'] - A canvas fillstyle that will be used on the text eg 'red', '#00FF00'.
* @param {string} [style.align='left'] - Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text.
* @param {string} [style.stroke='black'] - A canvas stroke style that will be used on the text stroke eg 'blue', '#FCFF00'.
* @param {number} [style.strokeThickness=0] - A number that represents the thickness of the stroke. Default is 0 (no stroke).
* @param {boolean} [style.wordWrap=false] - Indicates if word wrap should be used.
* @param {number} [style.wordWrapWidth=100] - The width in pixels at which text will wrap.
*/
Phaser.Text.prototype.setStyle = function (style) {

    style = style || {};
    style.font = style.font || 'bold 20pt Arial';
    style.fill = style.fill || 'black';
    style.align = style.align || 'left';
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

    //split text into lines
    var lines = outputText.split(/(?:\r\n|\r|\n)/);

    //calculate text width
    var lineWidths = [];
    var maxLineWidth = 0;
    var fontProperties = this.determineFontProperties(this.style.font);

    for (var i = 0; i < lines.length; i++)
    {
        var lineWidth = this.context.measureText(lines[i]).width;
        lineWidths[i] = lineWidth;
        maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }

    var width = maxLineWidth + this.style.strokeThickness;

    this.canvas.width = width * this.resolution;
    
    //calculate text height
    var lineHeight = fontProperties.fontSize + this.style.strokeThickness + this._lineSpacing;

    var height = (lineHeight + this._lineSpacing) * lines.length;

    this.canvas.height = height * this.resolution;

    this.context.scale(this.resolution, this.resolution);

    if (navigator.isCocoonJS)
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    this.context.fillStyle = this.style.fill;
    this.context.font = this.style.font;
    this.context.strokeStyle = this.style.stroke;
    this.context.textBaseline = 'alphabetic';
    this.context.shadowOffsetX = this.style.shadowOffsetX;
    this.context.shadowOffsetY = this.style.shadowOffsetY;
    this.context.shadowColor = this.style.shadowColor;
    this.context.shadowBlur = this.style.shadowBlur;
    this.context.lineWidth = this.style.strokeThickness;
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';

    var linePositionX;
    var linePositionY;

    this._charCount = 0;

    //draw lines line by line
    for (i = 0; i < lines.length; i++)
    {
        linePositionX = this.style.strokeThickness / 2;
        linePositionY = (this.style.strokeThickness / 2 + i * lineHeight) + fontProperties.ascent;

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
                this.context.strokeText(lines[i], linePositionX, linePositionY);
            }

            if (this.style.fill)
            {
                this.context.fillText(lines[i], linePositionX, linePositionY);
            }
        }
    }

    this.updateTexture();

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
            this.context.strokeText(letter, x, y);
        }

        if (this.style.fill)
        {
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
*/
Phaser.Text.prototype.clearColors = function () {

    this.colors = [];
    this.dirty = true;

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
*/
Phaser.Text.prototype.addColor = function (color, position) {

    this.colors[position] = color;
    this.dirty = true;

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
* The rotation of the Text, in degrees, from its original orientation.
*
* Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
* If you wish to work in radians instead of degrees use the property Sprite.rotation instead.
* 
* @name Phaser.Text#angle
* @property {number} angle - 
*/
Object.defineProperty(Phaser.Text.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

/**
* The text string to be displayed by this Text object, taking into account the style settings.
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
* The CSS font string can also be invidually altered with the `font`, `fontSize`, `fontWeight`, `fontStyle`, and `fontVariant` properties.
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
* Multiple CSS font familes and generic fallbacks can be specified as long as
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
* @name Phaser.Text#align
* @property {string} align - Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text.
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
* Set to true to allow this object to receive input events.
* By default a Text object won't process any input events at all. By setting inputEnabled to true the Phaser.InputHandler is
* activated for this object and it will then start to process click/touch events and more.
*
* @name Phaser.Text#inputEnabled
* @property {boolean} inputEnabled
*/
Object.defineProperty(Phaser.Text.prototype, "inputEnabled", {

    get: function () {

        return (this.input && this.input.enabled);

    },

    set: function (value) {

        if (value)
        {
            if (this.input === null)
            {
                this.input = new Phaser.InputHandler(this);
                this.input.start();
            }
            else if (this.input && !this.input.enabled)
            {
                this.input.start();
            }
        }
        else
        {
            if (this.input && this.input.enabled)
            {
                this.input.stop();
            }
        }

    }

});

/**
* Set to true to fix this Text to the Camera at its current world coordinates.
*
* An Text that is fixed to the camera uses its x/y coordinates as offsets from the top left of the camera. These are stored in Text.cameraOffset.
* Note that the cameraOffset values are in addition to any parent in the display list.
* So if this Text was in a Group that has x: 200, then this will be added to the cameraOffset.x
*
* @name Phaser.Text#fixedToCamera
* @property {boolean} fixedToCamera
*/
Object.defineProperty(Phaser.Text.prototype, "fixedToCamera", {

    get: function () {

        return !!this._cache[7];

    },

    set: function (value) {

        if (value)
        {
            this._cache[7] = 1;
            this.cameraOffset.set(this.x, this.y);
        }
        else
        {
            this._cache[7] = 0;
        }
    }

});

/**
* @name Phaser.Text#destroyPhase
* @property {boolean} destroyPhase - True if this object is currently being destroyed.
* @protected
*/
Object.defineProperty(Phaser.Text.prototype, "destroyPhase", {

    get: function () {

        return !!this._cache[8];

    }

});
