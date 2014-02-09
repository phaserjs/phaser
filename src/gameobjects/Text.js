/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new `Text` object.
* @class Phaser.Text
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
    text = text || '';
    style = style || '';

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
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
    * @property {Phaser.Point} world - The world coordinates of this Sprite. This differs from the x/y coordinates which are relative to the Sprites container.
    */
    this.world = new Phaser.Point(x, y);

    /**
    * An object that is fixed to the camera ignores the position of any ancestors in the display list and uses its x/y coordinates as offsets from the top left of the camera.
    * @property {boolean} fixedToCamera - Fixes this object to the Camera.
    * @default
    */
    this.fixedToCamera = false;

    /**
    * @property {string} _text - Internal cache var.
    * @private
    */
    this._text = text;

    /**
    * @property {string} _font - Internal cache var.
    * @private
    */
    this._font = '';

    /**
    * @property {number} _fontSize - Internal cache var.
    * @private
    */
    this._fontSize = 32;

    /**
    * @property {string} _fontWeight - Internal cache var.
    * @private
    */
    this._fontWeight = 'normal';

    /**
    * @property {number} lineSpacing - Additional spacing (in pixels) between each line of text if multi-line.
    * @private
    */
    this._lineSpacing = 0;

    PIXI.Text.call(this, text, style);

    this.position.set(x, y);

};

Phaser.Text.prototype = Object.create(PIXI.Text.prototype);
Phaser.Text.prototype.constructor = Phaser.Text;

/**
* Automatically called by World.preUpdate.
* @method Phaser.Text.prototype.preUpdate
*/
Phaser.Text.prototype.preUpdate = function() {

    if (!this.exists || !this.parent.exists)
    {
        //  Reset the renderOrderID
        return false;
    }

    this.world.setTo(this.game.camera.x + this.worldTransform.tx, this.game.camera.y + this.worldTransform.ty);

}

/**
* Automatically called by World.postUpdate.
* @method Phaser.Text.prototype.postUpdate
*/
Phaser.Text.prototype.postUpdate = function() {

    if (this.exists)
    {
        if (this.fixedToCamera)
        {
            // this.position.x = this.game.camera.view.x + this.x;
            // this.position.y = this.game.camera.view.y + this.y;
        }
    }
}

/**
* @method Phaser.Text.prototype.destroy
*/
Phaser.Text.prototype.destroy = function() {

    if (this.filters)
    {
        this.filters = null;
    }

    if (this.parent)
    {
        this.parent.remove(this);
    }

    this.texture.destroy();

    if (this.canvas.parentNode)
    {
        this.canvas.parentNode.removeChild(this.canvas);
    }
    else
    {
        this.canvas = null;
        this.context = null;
    }

    this.exists = false;
    this.visible = false;

    this.game = null;

}

/**
* @method Phaser.Text.prototype.setShadow
* @param {number} [x=0] - The shadowOffsetX value in pixels. This is how far offset horizontally the shadow effect will be.
* @param {number} [y=0] - The shadowOffsetY value in pixels. This is how far offset vertically the shadow effect will be.
* @param {string} [color='rgba(0,0,0,0)'] - The color of the shadow, as given in CSS rgba format. Set the alpha component to 0 to disable the shadow.
* @param {number} [blur=0] - The shadowBlur value. Make the shadow softer by applying a Gaussian blur to it. A number from 0 (no blur) up to approx. 10 (depending on scene).
*/
Phaser.Text.prototype.setShadow = function(x, y, color, blur) {

    this.style.shadowOffsetX = x || 0;
    this.style.shadowOffsetY = y || 0;
    this.style.shadowColor = color || 'rgba(0,0,0,0)';
    this.style.shadowBlur = blur || 0;
    this.dirty = true;

}

/**
* Set the style of the text by passing a single style object to it.
*
* @method Phaser.Text.prototype.setStyle
* @param [style] {Object} The style parameters
* @param [style.font='bold 20pt Arial'] {String} The style and size of the font
* @param [style.fill='black'] {Object} A canvas fillstyle that will be used on the text eg 'red', '#00FF00'
* @param [style.align='left'] {String} Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
* @param [style.stroke='black'] {String} A canvas fillstyle that will be used on the text stroke eg 'blue', '#FCFF00'
* @param [style.strokeThickness=0] {Number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
* @param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
* @param [style.wordWrapWidth=100] {Number} The width at which text will wrap
*/
Phaser.Text.prototype.setStyle = function(style) {

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

    this.style = style;
    this.dirty = true;

};

/**
* Renders text. This replaces the Pixi.Text.updateText function as we need a few extra bits in here.
*
* @method Phaser.Text.prototype.updateText
* @private
*/
Phaser.Text.prototype.updateText = function() {

    this.context.font = this.style.font;

    var outputText = this.text;

    // word wrap
    // preserve original text
    if(this.style.wordWrap)outputText = this.runWordWrap(this.text);

    //split text into lines
    var lines = outputText.split(/(?:\r\n|\r|\n)/);

    //calculate text width
    var lineWidths = [];
    var maxLineWidth = 0;
    for (var i = 0; i < lines.length; i++)
    {
        var lineWidth = this.context.measureText(lines[i]).width;
        lineWidths[i] = lineWidth;
        maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }
    this.canvas.width = maxLineWidth + this.style.strokeThickness;

    //calculate text height
    var lineHeight = this.determineFontHeight('font: ' + this.style.font  + ';') + this.style.strokeThickness + this._lineSpacing + this.style.shadowOffsetY;
    this.canvas.height = lineHeight * lines.length;

    if(navigator.isCocoonJS) this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    
    //set canvas text styles
    this.context.fillStyle = this.style.fill;
    this.context.font = this.style.font;

    this.context.strokeStyle = this.style.stroke;
    this.context.lineWidth = this.style.strokeThickness;

    this.context.shadowOffsetX = this.style.shadowOffsetX;
    this.context.shadowOffsetY = this.style.shadowOffsetY;
    this.context.shadowColor = this.style.shadowColor;
    this.context.shadowBlur = this.style.shadowBlur;

    this.context.textBaseline = 'top';

    //draw lines line by line
    for (i = 0; i < lines.length; i++)
    {
        var linePosition = new PIXI.Point(this.style.strokeThickness / 2, this.style.strokeThickness / 2 + i * lineHeight);

        if(this.style.align === 'right')
        {
            linePosition.x += maxLineWidth - lineWidths[i];
        }
        else if(this.style.align === 'center')
        {
            linePosition.x += (maxLineWidth - lineWidths[i]) / 2;
        }

        linePosition.y += this._lineSpacing;

        if(this.style.stroke && this.style.strokeThickness)
        {
            this.context.strokeText(lines[i], linePosition.x, linePosition.y);
        }

        if(this.style.fill)
        {
            this.context.fillText(lines[i], linePosition.x, linePosition.y);
        }
    }

    this.updateTexture();
};

/**
* Greedy wrapping algorithm that will wrap words as the line grows longer than its horizontal bounds.
*
* @method Phaser.Text.prototype.runWordWrap
* @private
*/
Phaser.Text.prototype.runWordWrap = function(text) {

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
        result += '\n';
    }

    return result;

};

/**
* Indicates the rotation of the Text, in degrees, from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
* If you wish to work in radians instead of degrees use the property Sprite.rotation instead.
* @name Phaser.Text#angle
* @property {number} angle - Gets or sets the angle of rotation in degrees.
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
* @name Phaser.Text#text
* @property {string} text - The text string to be displayed by this Text object, taking into account the style settings.
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
        }

    }

});

/**
* @name Phaser.Text#font
* @property {string} font - The font the text will be rendered in, i.e. 'Arial'. Must be loaded in the browser before use.
*/
Object.defineProperty(Phaser.Text.prototype, 'font', {

    get: function() {
        return this._font;
    },

    set: function(value) {

        if (value !== this._font)
        {
            this._font = value.trim();
            this.style.font = this._fontWeight + ' ' + this._fontSize + "px '" + this._font + "'";
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#fontSize
* @property {number} fontSize - The size of the font in pixels.
*/
Object.defineProperty(Phaser.Text.prototype, 'fontSize', {

    get: function() {
        return this._fontSize;
    },

    set: function(value) {

        value = parseInt(value);

        if (value !== this._fontSize)
        {
            this._fontSize = value;
            this.style.font = this._fontWeight + ' ' + this._fontSize + "px '" + this._font + "'";
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.Text#fontWeight
* @property {number} fontWeight - The weight of the font: 'normal', 'bold', 'italic'. You can combine settings too, such as 'bold italic'.
*/
Object.defineProperty(Phaser.Text.prototype, 'fontWeight', {

    get: function() {
        return this._fontWeight;
    },

    set: function(value) {

        if (value !== this._fontWeight)
        {
            this._fontWeight = value;
            this.style.font = this._fontWeight + ' ' + this._fontSize + "px '" + this._font + "'";
            this.dirty = true;
        }

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
