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
 * @classdesc
 * [description]
 *
 * @class TextStyle
 * @memberOf Phaser.GameObjects.Text
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Text} text - The Text object that this TextStyle is styling.
 * @param {object} style - [description]
 */
var TextStyle = new Class({

    initialize:

    function TextStyle (text, style)
    {
        /**
         * The Text object that this TextStyle is styling.
         *
         * @name Phaser.GameObjects.Components.TextStyle#parent
         * @type {Phaser.GameObjects.Text}
         * @since 3.0.0
         */
        this.parent = text;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#fontFamily
         * @type {string}
         * @default 'Courier'
         * @since 3.0.0
         */
        this.fontFamily;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#fontSize
         * @type {string}
         * @default '16px'
         * @since 3.0.0
         */
        this.fontSize;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#fontStyle
         * @type {string}
         * @since 3.0.0
         */
        this.fontStyle;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#backgroundColor
         * @type {string}
         * @since 3.0.0
         */
        this.backgroundColor;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#color
         * @type {string}
         * @default '#fff'
         * @since 3.0.0
         */
        this.color;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#stroke
         * @type {string}
         * @default '#fff'
         * @since 3.0.0
         */
        this.stroke;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#strokeThickness
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.strokeThickness;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#shadowOffsetX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.shadowOffsetX;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#shadowOffsetY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.shadowOffsetY;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#shadowColor
         * @type {string}
         * @default '#000'
         * @since 3.0.0
         */
        this.shadowColor;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#shadowBlur
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.shadowBlur;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#shadowStroke
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.shadowStroke;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#shadowFill
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.shadowFill;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#align
         * @type {string}
         * @default 'left'
         * @since 3.0.0
         */
        this.align;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#maxLines
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.maxLines;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#fixedWidth
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.fixedWidth;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#fixedHeight
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.fixedHeight;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#rtl
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.rtl;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#testString
         * @type {string}
         * @default '|MÉqgy'
         * @since 3.0.0
         */
        this.testString;

        /**
         * The amount of horizontal padding adding to the width of the text when calculating the font metrics.
         *
         * @name Phaser.GameObjects.Components.TextStyle#baselineX
         * @type {number}
         * @default 1.2
         * @since 3.3.0
         */
        this.baselineX;

        /**
         * The amount of vertical padding adding to the width of the text when calculating the font metrics.
         *
         * @name Phaser.GameObjects.Components.TextStyle#baselineY
         * @type {number}
         * @default 1.4
         * @since 3.3.0
         */
        this.baselineY;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Components.TextStyle#_font
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setStyle
     * @since 3.0.0
     *
     * @param {CSSStyleRule} style - [description]
     * @param {boolean} [updateText=true] - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#syncFont
     * @since 3.0.0
     *
     * @param {HTMLCanvasElement} canvas - [description]
     * @param {CanvasRenderingContext2D} context - [description]
     */
    syncFont: function (canvas, context)
    {
        context.font = this._font;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#syncStyle
     * @since 3.0.0
     *
     * @param {HTMLCanvasElement} canvas - [description]
     * @param {CanvasRenderingContext2D} context - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#syncShadow
     * @since 3.0.0
     *
     * @param {CanvasRenderingContext2D} context - [description]
     * @param {boolean} enabled - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#update
     * @since 3.0.0
     *
     * @param {boolean} recalculateMetrics - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setFont
     * @since 3.0.0
     *
     * @param {(string|object)} font - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setFontFamily
     * @since 3.0.0
     *
     * @param {string} family - [description]
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setFontFamily: function (family)
    {
        this.fontFamily = family;

        return this.update(true);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setFontStyle
     * @since 3.0.0
     *
     * @param {string} style - [description]
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setFontStyle: function (style)
    {
        this.fontStyle = style;

        return this.update(true);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setFontSize
     * @since 3.0.0
     *
     * @param {(number|string)} size - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setTestString
     * @since 3.0.0
     *
     * @param {string} string - [description]
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setTestString: function (string)
    {
        this.testString = string;

        return this.update(true);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setFixedSize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setBackgroundColor
     * @since 3.0.0
     *
     * @param {string} color - [description]
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setBackgroundColor: function (color)
    {
        this.backgroundColor = color;

        return this.update(false);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setFill
     * @since 3.0.0
     *
     * @param {string} color - [description]
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setFill: function (color)
    {
        this.color = color;

        return this.update(false);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setColor
     * @since 3.0.0
     *
     * @param {string} color - [description]
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setColor: function (color)
    {
        this.color = color;

        return this.update(false);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setStroke
     * @since 3.0.0
     *
     * @param {string} color - [description]
     * @param {number} thickness - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setShadow
     * @since 3.0.0
     *
     * @param {number} [x=0] - [description]
     * @param {number} [y=0] - [description]
     * @param {string} [color='#000'] - [description]
     * @param {number} [blur=0] - [description]
     * @param {boolean} [shadowStroke=false] - [description]
     * @param {boolean} [shadowFill=true] - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setShadowOffset
     * @since 3.0.0
     *
     * @param {number} [x=0] - [description]
     * @param {number} [y=0] - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setShadowColor
     * @since 3.0.0
     *
     * @param {string} [color='#000'] - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setShadowBlur
     * @since 3.0.0
     *
     * @param {number} [blur=0] - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setShadowStroke
     * @since 3.0.0
     *
     * @param {boolean} enabled - [description]
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setShadowStroke: function (enabled)
    {
        this.shadowStroke = enabled;

        return this.update(false);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setShadowFill
     * @since 3.0.0
     *
     * @param {boolean} enabled - [description]
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setShadowFill: function (enabled)
    {
        this.shadowFill = enabled;

        return this.update(false);
    },

    /**
     * Set the width (in pixels) to use for wrapping lines. Pass in null to remove wrapping by width.
     *
     * @method Phaser.GameObjects.Components.TextStyle#setWordWrapWidth
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
     * Set a custom callback for wrapping lines. Pass in null to remove wrapping by callback.
     *
     * @method Phaser.GameObjects.Components.TextStyle#setWordWrapCallback
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setAlign
     * @since 3.0.0
     *
     * @param {string} align - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#setMaxLines
     * @since 3.0.0
     *
     * @param {integer} [max=0] - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#getTextMetrics
     * @since 3.0.0
     *
     * @return {object} [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#toJSON
     * @since 3.0.0
     *
     * @return {object} [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Components.TextStyle#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.parent = undefined;
    }

});

module.exports = TextStyle;
