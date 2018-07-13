/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetValue = require('../../utils/object/GetValue');
var MeasureText = require('./MeasureText');

//  Key: [ Object Key, Default Value ]

/**
 * A custom function that will be responsible for wrapping the text.
 * @callback TextStyleWordWrapCallback
 *
 * @param {string} text - The string to wrap.
 * @param {Phaser.GameObjects.Text} textObject - The Text instance.
 *
 * @return {(string|string[])} Should return the wrapped lines either as an array of lines or as a string with
 * newline characters in place to indicate where breaks should happen.
 */

var propertyMap = {
    fontFamily: [ 'fontFamily', 'Courier' ],
    fontSize: [ 'fontSize', '16px' ],
    fontStyle: [ 'fontStyle', '' ],
    backgroundColor: [ 'backgroundColor', null ],
    color: [ 'color', '#fff' ],
    stroke: [ 'stroke', '#fff' ],
    strokeThickness: [ 'strokeThickness', 0 ],
    shadowOffsetX: [ 'shadow.offsetX', 0 ],
    shadowOffsetY: [ 'shadow.offsetY', 0 ],
    shadowColor: [ 'shadow.color', '#000' ],
    shadowBlur: [ 'shadow.blur', 0 ],
    shadowStroke: [ 'shadow.stroke', false ],
    shadowFill: [ 'shadow.fill', false ],
    align: [ 'align', 'left' ],
    maxLines: [ 'maxLines', 0 ],
    fixedWidth: [ 'fixedWidth', 0 ],
    fixedHeight: [ 'fixedHeight', 0 ],
    rtl: [ 'rtl', false ],
    testString: [ 'testString', '|MÃ‰qgy' ],
    baselineX: [ 'baselineX', 1.2 ],
    baselineY: [ 'baselineY', 1.4 ],
    wordWrapWidth: [ 'wordWrap.width', null ],
    wordWrapCallback: [ 'wordWrap.callback', null ],
    wordWrapCallbackScope: [ 'wordWrap.callbackScope', null ],
    wordWrapUseAdvanced: [ 'wordWrap.useAdvancedWrap', false ]
};

/**
 * Font metrics for a Text Style object.
 *
 * @typedef {object} TextMetrics
 *
 * @property {number} ascent - The ascent of the font.
 * @property {number} descent - The descent of the font.
 * @property {number} fontSize - The size of the font.
 */

/**
 * @classdesc
 * Style settings for a Text object.
 *
 * @class TextStyle
 * @memberOf Phaser.GameObjects.Text
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Text} text - The Text object that this TextStyle is styling.
 * @param {object} style - The style settings to set.
 */
var TextStyle = new Class({

    initialize:

    function TextStyle (text, style)
    {
        /**
         * The Text object that this TextStyle is styling.
         *
         * @name Phaser.GameObjects.Text.TextStyle#parent
         * @type {Phaser.GameObjects.Text}
         * @since 3.0.0
         */
        this.parent = text;

        /**
         * The font family.
         *
         * @name Phaser.GameObjects.Text.TextStyle#fontFamily
         * @type {string}
         * @default 'Courier'
         * @since 3.0.0
         */
        this.fontFamily;

        /**
         * The font size.
         *
         * @name Phaser.GameObjects.Text.TextStyle#fontSize
         * @type {string}
         * @default '16px'
         * @since 3.0.0
         */
        this.fontSize;

        /**
         * The font style.
         *
         * @name Phaser.GameObjects.Text.TextStyle#fontStyle
         * @type {string}
         * @since 3.0.0
         */
        this.fontStyle;

        /**
         * The background color.
         *
         * @name Phaser.GameObjects.Text.TextStyle#backgroundColor
         * @type {string}
         * @since 3.0.0
         */
        this.backgroundColor;

        /**
         * The text fill color.
         *
         * @name Phaser.GameObjects.Text.TextStyle#color
         * @type {string}
         * @default '#fff'
         * @since 3.0.0
         */
        this.color;

        /**
         * The text stroke color.
         *
         * @name Phaser.GameObjects.Text.TextStyle#stroke
         * @type {string}
         * @default '#fff'
         * @since 3.0.0
         */
        this.stroke;

        /**
         * The text stroke thickness.
         *
         * @name Phaser.GameObjects.Text.TextStyle#strokeThickness
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.strokeThickness;

        /**
         * The horizontal shadow offset.
         *
         * @name Phaser.GameObjects.Text.TextStyle#shadowOffsetX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.shadowOffsetX;

        /**
         * The vertical shadow offset.
         *
         * @name Phaser.GameObjects.Text.TextStyle#shadowOffsetY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.shadowOffsetY;

        /**
         * The shadow color.
         *
         * @name Phaser.GameObjects.Text.TextStyle#shadowColor
         * @type {string}
         * @default '#000'
         * @since 3.0.0
         */
        this.shadowColor;

        /**
         * The shadow blur radius.
         *
         * @name Phaser.GameObjects.Text.TextStyle#shadowBlur
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.shadowBlur;

        /**
         * Whether shadow stroke is enabled or not.
         *
         * @name Phaser.GameObjects.Text.TextStyle#shadowStroke
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.shadowStroke;

        /**
         * Whether shadow fill is enabled or not.
         *
         * @name Phaser.GameObjects.Text.TextStyle#shadowFill
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.shadowFill;

        /**
         * The text alignment.
         *
         * @name Phaser.GameObjects.Text.TextStyle#align
         * @type {string}
         * @default 'left'
         * @since 3.0.0
         */
        this.align;

        /**
         * The maximum number of lines to draw.
         *
         * @name Phaser.GameObjects.Text.TextStyle#maxLines
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.maxLines;

        /**
         * The fixed width of the text.
         *
         * `0` means no fixed with.
         *
         * @name Phaser.GameObjects.Text.TextStyle#fixedWidth
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.fixedWidth;

        /**
         * The fixed height of the text.
         *
         * `0` means no fixed height.
         *
         * @name Phaser.GameObjects.Text.TextStyle#fixedHeight
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.fixedHeight;

        /**
         * Whether the text should render right to left.
         *
         * @name Phaser.GameObjects.Text.TextStyle#rtl
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.rtl;

        /**
         * The test string to use when measuring the font.
         *
         * @name Phaser.GameObjects.Text.TextStyle#testString
         * @type {string}
         * @default '|MÉqgy'
         * @since 3.0.0
         */
        this.testString;

        /**
         * The amount of horizontal padding adding to the width of the text when calculating the font metrics.
         *
         * @name Phaser.GameObjects.Text.TextStyle#baselineX
         * @type {number}
         * @default 1.2
         * @since 3.3.0
         */
        this.baselineX;

        /**
         * The amount of vertical padding adding to the width of the text when calculating the font metrics.
         *
         * @name Phaser.GameObjects.Text.TextStyle#baselineY
         * @type {number}
         * @default 1.4
         * @since 3.3.0
         */
        this.baselineY;

        /**
         * The font style, size and family.
         *
         * @name Phaser.GameObjects.Text.TextStyle#_font
         * @type {string}
         * @private
         * @since 3.0.0
         */
        this._font;

        //  Set to defaults + user style
        this.setStyle(style, false);

        var metrics = GetValue(style, 'metrics', false);

        //  Provide optional TextMetrics in the style object to avoid the canvas look-up / scanning
        //  Doing this is reset if you then change the font of this TextStyle after creation
        if (metrics)
        {
            this.metrics = {
                ascent: GetValue(metrics, 'ascent', 0),
                descent: GetValue(metrics, 'descent', 0),
                fontSize: GetValue(metrics, 'fontSize', 0)
            };
        }
        else
        {
            this.metrics = MeasureText(this);
        }
    },

    /**
     * Set the text style.
     *
     * @example
     * text.setStyle({
     *     fontSize: '64px',
     *     fontFamily: 'Arial',
     *     color: '#ffffff',
     *     align: 'center',
     *     backgroundColor: '#ff00ff'
     * });
     *
     * @method Phaser.GameObjects.Text.TextStyle#setStyle
     * @since 3.0.0
     *
     * @param {object} style - The style settings to set.
     * @param {boolean} [updateText=true] - Whether to update the text immediately.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setStyle: function (style, updateText)
    {
        if (updateText === undefined) { updateText = true; }

        //  Avoid type mutation
        if (style && style.hasOwnProperty('fontSize') && typeof style.fontSize === 'number')
        {
            style.fontSize = style.fontSize.toString() + 'px';
        }

        for (var key in propertyMap)
        {
            if (key === 'wordWrapCallback' || key === 'wordWrapCallbackScope')
            {
                // Callback & scope should be set without processing the values
                this[key] = GetValue(style, propertyMap[key][0], propertyMap[key][1]);
            }
            else
            {
                this[key] = GetAdvancedValue(style, propertyMap[key][0], propertyMap[key][1]);
            }
        }

        //  Allow for 'font' override
        var font = GetValue(style, 'font', null);

        if (font === null)
        {
            this._font = [ this.fontStyle, this.fontSize, this.fontFamily ].join(' ');
        }
        else
        {
            this._font = font;
        }

        //  Allow for 'fill' to be used in place of 'color'
        var fill = GetValue(style, 'fill', null);

        if (fill !== null)
        {
            this.color = fill;
        }

        if (updateText)
        {
            return this.update(true);
        }
        else
        {
            return this.parent;
        }
    },

    /**
     * Synchronize the font settings to the given Canvas Rendering Context.
     *
     * @method Phaser.GameObjects.Text.TextStyle#syncFont
     * @since 3.0.0
     *
     * @param {HTMLCanvasElement} canvas - The Canvas Element.
     * @param {CanvasRenderingContext2D} context - The Canvas Rendering Context.
     */
    syncFont: function (canvas, context)
    {
        context.font = this._font;
    },

    /**
     * Synchronize the text style settings to the given Canvas Rendering Context.
     *
     * @method Phaser.GameObjects.Text.TextStyle#syncStyle
     * @since 3.0.0
     *
     * @param {HTMLCanvasElement} canvas - The Canvas Element.
     * @param {CanvasRenderingContext2D} context - The Canvas Rendering Context.
     */
    syncStyle: function (canvas, context)
    {
        context.textBaseline = 'alphabetic';

        context.fillStyle = this.color;
        context.strokeStyle = this.stroke;

        context.lineWidth = this.strokeThickness;
        context.lineCap = 'round';
        context.lineJoin = 'round';
    },

    /**
     * Synchronize the shadow settings to the given Canvas Rendering Context.
     *
     * @method Phaser.GameObjects.Text.TextStyle#syncShadow
     * @since 3.0.0
     *
     * @param {CanvasRenderingContext2D} context - The Canvas Rendering Context.
     * @param {boolean} enabled - Whether shadows are enabled or not.
     */
    syncShadow: function (context, enabled)
    {
        if (enabled)
        {
            context.shadowOffsetX = this.shadowOffsetX;
            context.shadowOffsetY = this.shadowOffsetY;
            context.shadowColor = this.shadowColor;
            context.shadowBlur = this.shadowBlur;
        }
        else
        {
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowColor = 0;
            context.shadowBlur = 0;
        }
    },

    /**
     * Update the style settings for the parent Text object.
     *
     * @method Phaser.GameObjects.Text.TextStyle#update
     * @since 3.0.0
     *
     * @param {boolean} recalculateMetrics - Whether to recalculate font and text metrics.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    update: function (recalculateMetrics)
    {
        if (recalculateMetrics)
        {
            this._font = [ this.fontStyle, this.fontSize, this.fontFamily ].join(' ');

            this.metrics = MeasureText(this);
        }

        return this.parent.updateText();
    },

    /**
     * Set the font.
     *
     * If a string is given, the font family is set.
     *
     * If an object is given, the `fontFamily`, `fontSize` and `fontStyle`
     * properties of that object are set.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setFont
     * @since 3.0.0
     *
     * @param {(string|object)} font - The font family or font settings to set.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setFont: function (font)
    {
        if (typeof font === 'string')
        {
            this.fontFamily = font;
            this.fontSize = '';
            this.fontStyle = '';
        }
        else
        {
            this.fontFamily = GetValue(font, 'fontFamily', 'Courier');
            this.fontSize = GetValue(font, 'fontSize', '16px');
            this.fontStyle = GetValue(font, 'fontStyle', '');
        }

        return this.update(true);
    },

    /**
     * Set the font family.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setFontFamily
     * @since 3.0.0
     *
     * @param {string} family - The font family.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setFontFamily: function (family)
    {
        this.fontFamily = family;

        return this.update(true);
    },

    /**
     * Set the font style.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setFontStyle
     * @since 3.0.0
     *
     * @param {string} style - The font style.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setFontStyle: function (style)
    {
        this.fontStyle = style;

        return this.update(true);
    },

    /**
     * Set the font size.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setFontSize
     * @since 3.0.0
     *
     * @param {(number|string)} size - The font size.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setFontSize: function (size)
    {
        if (typeof size === 'number')
        {
            size = size.toString() + 'px';
        }

        this.fontSize = size;

        return this.update(true);
    },

    /**
     * Set the test string to use when measuring the font.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setTestString
     * @since 3.0.0
     *
     * @param {string} string - The test string to use when measuring the font.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setTestString: function (string)
    {
        this.testString = string;

        return this.update(true);
    },

    /**
     * Set a fixed width and height for the text.
     *
     * Pass in `0` for either of these parameters to disable fixed width or height respectively.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setFixedSize
     * @since 3.0.0
     *
     * @param {number} width - The fixed width to set.
     * @param {number} height - The fixed height to set.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setFixedSize: function (width, height)
    {
        this.fixedWidth = width;
        this.fixedHeight = height;

        if (width)
        {
            this.parent.width = width;
        }

        if (height)
        {
            this.parent.height = height;
        }

        return this.update(false);
    },

    /**
     * Set the background color.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setBackgroundColor
     * @since 3.0.0
     *
     * @param {string} color - The background color.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setBackgroundColor: function (color)
    {
        this.backgroundColor = color;

        return this.update(false);
    },

    /**
     * Set the text fill color.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setFill
     * @since 3.0.0
     *
     * @param {string} color - The text fill color.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setFill: function (color)
    {
        this.color = color;

        return this.update(false);
    },

    /**
     * Set the text fill color.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setColor
     * @since 3.0.0
     *
     * @param {string} color - The text fill color.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setColor: function (color)
    {
        this.color = color;

        return this.update(false);
    },

    /**
     * Set the stroke settings.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setStroke
     * @since 3.0.0
     *
     * @param {string} color - The stroke color.
     * @param {number} thickness - The stroke thickness.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setStroke: function (color, thickness)
    {
        if (color === undefined)
        {
            //  Reset the stroke to zero (disabling it)
            this.strokeThickness = 0;
        }
        else
        {
            if (thickness === undefined) { thickness = this.strokeThickness; }

            this.stroke = color;
            this.strokeThickness = thickness;
        }

        return this.update(true);
    },

    /**
     * Set the shadow settings.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setShadow
     * @since 3.0.0
     *
     * @param {number} [x=0] - The horizontal shadow offset.
     * @param {number} [y=0] - The vertical shadow offset.
     * @param {string} [color='#000'] - The shadow color.
     * @param {number} [blur=0] - The shadow blur radius.
     * @param {boolean} [shadowStroke=false] - Whether to stroke the shadow.
     * @param {boolean} [shadowFill=true] - Whether to fill the shadow.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setShadow: function (x, y, color, blur, shadowStroke, shadowFill)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (color === undefined) { color = '#000'; }
        if (blur === undefined) { blur = 0; }
        if (shadowStroke === undefined) { shadowStroke = false; }
        if (shadowFill === undefined) { shadowFill = true; }

        this.shadowOffsetX = x;
        this.shadowOffsetY = y;
        this.shadowColor = color;
        this.shadowBlur = blur;
        this.shadowStroke = shadowStroke;
        this.shadowFill = shadowFill;

        return this.update(false);
    },

    /**
     * Set the shadow offset.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setShadowOffset
     * @since 3.0.0
     *
     * @param {number} [x=0] - The horizontal shadow offset.
     * @param {number} [y=0] - The vertical shadow offset.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setShadowOffset: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.shadowOffsetX = x;
        this.shadowOffsetY = y;

        return this.update(false);
    },

    /**
     * Set the shadow color.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setShadowColor
     * @since 3.0.0
     *
     * @param {string} [color='#000'] - The shadow color.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setShadowColor: function (color)
    {
        if (color === undefined) { color = '#000'; }

        this.shadowColor = color;

        return this.update(false);
    },

    /**
     * Set the shadow blur radius.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setShadowBlur
     * @since 3.0.0
     *
     * @param {number} [blur=0] - The shadow blur radius.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setShadowBlur: function (blur)
    {
        if (blur === undefined) { blur = 0; }

        this.shadowBlur = blur;

        return this.update(false);
    },

    /**
     * Enable or disable shadow stroke.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setShadowStroke
     * @since 3.0.0
     *
     * @param {boolean} enabled - Whether shadow stroke is enabled or not.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setShadowStroke: function (enabled)
    {
        this.shadowStroke = enabled;

        return this.update(false);
    },

    /**
     * Enable or disable shadow fill.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setShadowFill
     * @since 3.0.0
     *
     * @param {boolean} enabled - Whether shadow fill is enabled or not.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setShadowFill: function (enabled)
    {
        this.shadowFill = enabled;

        return this.update(false);
    },

    /**
     * Set the width (in pixels) to use for wrapping lines.
     *
     * Pass in null to remove wrapping by width.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setWordWrapWidth
     * @since 3.0.0
     *
     * @param {number} width - The maximum width of a line in pixels. Set to null to remove wrapping.
     * @param {boolean} [useAdvancedWrap=false] - Whether or not to use the advanced wrapping
     * algorithm. If true, spaces are collapsed and whitespace is trimmed from lines. If false,
     * spaces and whitespace are left as is.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setWordWrapWidth: function (width, useAdvancedWrap)
    {
        if (useAdvancedWrap === undefined) { useAdvancedWrap = false; }

        this.wordWrapWidth = width;
        this.wordWrapUseAdvanced = useAdvancedWrap;

        return this.update(false);
    },

    /**
     * Set a custom callback for wrapping lines.
     *
     * Pass in null to remove wrapping by callback.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setWordWrapCallback
     * @since 3.0.0
     *
     * @param {TextStyleWordWrapCallback} callback - A custom function that will be responsible for wrapping the
     * text. It will receive two arguments: text (the string to wrap), textObject (this Text
     * instance). It should return the wrapped lines either as an array of lines or as a string with
     * newline characters in place to indicate where breaks should happen.
     * @param {object} [scope=null] - The scope that will be applied when the callback is invoked.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setWordWrapCallback: function (callback, scope)
    {
        if (scope === undefined) { scope = null; }

        this.wordWrapCallback = callback;
        this.wordWrapCallbackScope = scope;

        return this.update(false);
    },

    /**
     * Set the text alignment.
     *
     * Expects values like `'left'`, `'right'`, `'center'` or `'justified'`.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setAlign
     * @since 3.0.0
     *
     * @param {string} align - The text alignment.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setAlign: function (align)
    {
        if (align === undefined) { align = 'left'; }

        this.align = align;

        return this.update(false);
    },

    /**
     * Set the maximum number of lines to draw.
     *
     * @method Phaser.GameObjects.Text.TextStyle#setMaxLines
     * @since 3.0.0
     *
     * @param {integer} [max=0] - The maximum number of lines to draw.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setMaxLines: function (max)
    {
        if (max === undefined) { max = 0; }

        this.maxLines = max;

        return this.update(false);
    },

    /**
     * Get the current text metrics.
     *
     * @method Phaser.GameObjects.Text.TextStyle#getTextMetrics
     * @since 3.0.0
     *
     * @return {TextMetrics} The text metrics.
     */
    getTextMetrics: function ()
    {
        var metrics = this.metrics;

        return {
            ascent: metrics.ascent,
            descent: metrics.descent,
            fontSize: metrics.fontSize
        };
    },

    /**
     * Build a JSON representation of this Text Style.
     *
     * @method Phaser.GameObjects.Text.TextStyle#toJSON
     * @since 3.0.0
     *
     * @return {object} A JSON representation of this Text Style.
     */
    toJSON: function ()
    {
        var output = {};

        for (var key in propertyMap)
        {
            output[key] = this[key];
        }

        output.metrics = this.getTextMetrics();

        return output;
    },

    /**
     * Destroy this Text Style.
     *
     * @method Phaser.GameObjects.Text.TextStyle#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.parent = undefined;
    }

});

module.exports = TextStyle;
