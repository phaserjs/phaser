/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetValue = require('../../utils/object/GetValue');
var MeasureText = require('./MeasureText');

//  Key: [ Object Key, Default Value ]

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
    resolution: [ 'resolution', 0 ],
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
 * A TextStyle class manages all of the style settings for a Text object.
 *
 * Text Game Objects create a TextStyle instance automatically, which is
 * accessed via the `Text.style` property. You do not normally need to
 * instantiate one yourself.
 *
 * @class TextStyle
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Text} text - The Text object that this TextStyle is styling.
 * @param {Phaser.Types.GameObjects.Text.TextStyle} style - The style settings to set.
 */
var TextStyle = new Class({

    initialize:

    function TextStyle (text, style)
    {
        /**
         * The Text object that this TextStyle is styling.
         *
         * @name Phaser.GameObjects.TextStyle#parent
         * @type {Phaser.GameObjects.Text}
         * @since 3.0.0
         */
        this.parent = text;

        /**
         * The font family.
         *
         * @name Phaser.GameObjects.TextStyle#fontFamily
         * @type {string}
         * @default 'Courier'
         * @since 3.0.0
         */
        this.fontFamily;

        /**
         * The font size.
         *
         * @name Phaser.GameObjects.TextStyle#fontSize
         * @type {(string|number)}
         * @default '16px'
         * @since 3.0.0
         */
        this.fontSize;

        /**
         * The font style.
         *
         * @name Phaser.GameObjects.TextStyle#fontStyle
         * @type {string}
         * @since 3.0.0
         */
        this.fontStyle;

        /**
         * The background color.
         *
         * @name Phaser.GameObjects.TextStyle#backgroundColor
         * @type {string}
         * @since 3.0.0
         */
        this.backgroundColor;

        /**
         * The text fill color.
         *
         * @name Phaser.GameObjects.TextStyle#color
         * @type {string}
         * @default '#fff'
         * @since 3.0.0
         */
        this.color;

        /**
         * The text stroke color.
         *
         * @name Phaser.GameObjects.TextStyle#stroke
         * @type {string}
         * @default '#fff'
         * @since 3.0.0
         */
        this.stroke;

        /**
         * The text stroke thickness.
         *
         * @name Phaser.GameObjects.TextStyle#strokeThickness
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.strokeThickness;

        /**
         * The horizontal shadow offset.
         *
         * @name Phaser.GameObjects.TextStyle#shadowOffsetX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.shadowOffsetX;

        /**
         * The vertical shadow offset.
         *
         * @name Phaser.GameObjects.TextStyle#shadowOffsetY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.shadowOffsetY;

        /**
         * The shadow color.
         *
         * @name Phaser.GameObjects.TextStyle#shadowColor
         * @type {string}
         * @default '#000'
         * @since 3.0.0
         */
        this.shadowColor;

        /**
         * The shadow blur radius.
         *
         * @name Phaser.GameObjects.TextStyle#shadowBlur
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.shadowBlur;

        /**
         * Whether shadow stroke is enabled or not.
         *
         * @name Phaser.GameObjects.TextStyle#shadowStroke
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.shadowStroke;

        /**
         * Whether shadow fill is enabled or not.
         *
         * @name Phaser.GameObjects.TextStyle#shadowFill
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.shadowFill;

        /**
         * The text alignment.
         *
         * @name Phaser.GameObjects.TextStyle#align
         * @type {string}
         * @default 'left'
         * @since 3.0.0
         */
        this.align;

        /**
         * The maximum number of lines to draw.
         *
         * @name Phaser.GameObjects.TextStyle#maxLines
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.maxLines;

        /**
         * The fixed width of the text.
         *
         * `0` means no fixed with.
         *
         * @name Phaser.GameObjects.TextStyle#fixedWidth
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
         * @name Phaser.GameObjects.TextStyle#fixedHeight
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.fixedHeight;

        /**
         * The resolution the text is rendered to its internal canvas at.
         * The default is 0, which means it will use the resolution set in the Game Config.
         *
         * @name Phaser.GameObjects.TextStyle#resolution
         * @type {number}
         * @default 0
         * @since 3.12.0
         */
        this.resolution;

        /**
         * Whether the text should render right to left.
         *
         * @name Phaser.GameObjects.TextStyle#rtl
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.rtl;

        /**
         * The test string to use when measuring the font.
         *
         * @name Phaser.GameObjects.TextStyle#testString
         * @type {string}
         * @default '|MÉqgy'
         * @since 3.0.0
         */
        this.testString;

        /**
         * The amount of horizontal padding added to the width of the text when calculating the font metrics.
         *
         * @name Phaser.GameObjects.TextStyle#baselineX
         * @type {number}
         * @default 1.2
         * @since 3.3.0
         */
        this.baselineX;

        /**
         * The amount of vertical padding added to the height of the text when calculating the font metrics.
         *
         * @name Phaser.GameObjects.TextStyle#baselineY
         * @type {number}
         * @default 1.4
         * @since 3.3.0
         */
        this.baselineY;

        /**
         * The maximum width of a line of text in pixels. Null means no line wrapping. Setting this
         * property directly will not re-run the word wrapping algorithm. To change the width and
         * re-wrap, use {@link Phaser.GameObjects.TextStyle#setWordWrapWidth}.
         *
         * @name Phaser.GameObjects.TextStyle#wordWrapWidth
         * @type {number | null}
         * @default null
         * @since 3.24.0
         */
        this.wordWrapWidth;

        /**
         * A custom function that will be responsible for wrapping the text. It will receive two
         * arguments: text (the string to wrap), textObject (this Text instance). It should return
         * the wrapped lines either as an array of lines or as a string with newline characters in
         * place to indicate where breaks should happen. Setting this directly will not re-run the
         * word wrapping algorithm. To change the callback and re-wrap, use
         * {@link Phaser.GameObjects.TextStyle#setWordWrapCallback}.
         *
         * @name Phaser.GameObjects.TextStyle#wordWrapCallback
         * @type {TextStyleWordWrapCallback | null}
         * @default null
         * @since 3.24.0
         */
        this.wordWrapCallback;

        /**
         * The scope that will be applied when the wordWrapCallback is invoked. Setting this directly will not re-run the
         * word wrapping algorithm. To change the callback and re-wrap, use
         * {@link Phaser.GameObjects.TextStyle#setWordWrapCallback}.
         *
         * @name Phaser.GameObjects.TextStyle#wordWrapCallbackScope
         * @type {object | null}
         * @default null
         * @since 3.24.0
         */
        this.wordWrapCallbackScope;

        /**
         * Whether or not to use the advanced wrapping algorithm. If true, spaces are collapsed and
         * whitespace is trimmed from lines. If false, spaces and whitespace are left as is. Setting
         * this property directly will not re-run the word wrapping algorithm. To change the
         * advanced setting and re-wrap, use {@link Phaser.GameObjects.TextStyle#setWordWrapWidth}.
         *
         * @name Phaser.GameObjects.TextStyle#wordWrapUseAdvanced
         * @type {boolean}
         * @default false
         * @since 3.24.0
         */
        this.wordWrapUseAdvanced;

        /**
         * The font style, size and family.
         *
         * @name Phaser.GameObjects.TextStyle#_font
         * @type {string}
         * @private
         * @since 3.0.0
         */
        this._font;

        //  Set to defaults + user style
        this.setStyle(style, false, true);
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
     * @method Phaser.GameObjects.TextStyle#setStyle
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.Text.TextStyle} style - The style settings to set.
     * @param {boolean} [updateText=true] - Whether to update the text immediately.
     * @param {boolean} [setDefaults=false] - Use the default values is not set, or the local values.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setStyle: function (style, updateText, setDefaults)
    {
        if (updateText === undefined) { updateText = true; }
        if (setDefaults === undefined) { setDefaults = false; }

        //  Avoid type mutation
        // eslint-disable-next-line no-prototype-builtins
        if (style && style.hasOwnProperty('fontSize') && typeof style.fontSize === 'number')
        {
            style.fontSize = style.fontSize.toString() + 'px';
        }

        for (var key in propertyMap)
        {
            var value = (setDefaults) ? propertyMap[key][1] : this[key];

            if (key === 'wordWrapCallback' || key === 'wordWrapCallbackScope')
            {
                // Callback & scope should be set without processing the values
                this[key] = GetValue(style, propertyMap[key][0], value);
            }
            else
            {
                this[key] = GetAdvancedValue(style, propertyMap[key][0], value);
            }
        }

        //  Allow for 'font' override
        var font = GetValue(style, 'font', null);

        if (font !== null)
        {
            this.setFont(font, false);
        }

        this._font = [ this.fontStyle, this.fontSize, this.fontFamily ].join(' ').trim();

        //  Allow for 'fill' to be used in place of 'color'
        var fill = GetValue(style, 'fill', null);

        if (fill !== null)
        {
            this.color = fill;
        }

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
        else if (updateText || !this.metrics)
        {
            this.metrics = MeasureText(this);
        }

        if (updateText)
        {
            return this.parent.updateText();
        }
        else
        {
            return this.parent;
        }
    },

    /**
     * Synchronize the font settings to the given Canvas Rendering Context.
     *
     * @method Phaser.GameObjects.TextStyle#syncFont
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
     * @method Phaser.GameObjects.TextStyle#syncStyle
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
     * @method Phaser.GameObjects.TextStyle#syncShadow
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
     * @method Phaser.GameObjects.TextStyle#update
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
            this._font = [ this.fontStyle, this.fontSize, this.fontFamily ].join(' ').trim();

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
     * @method Phaser.GameObjects.TextStyle#setFont
     * @since 3.0.0
     *
     * @param {(string|object)} font - The font family or font settings to set.
     * @param {boolean} [updateText=true] - Whether to update the text immediately.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setFont: function (font, updateText)
    {
        if (updateText === undefined) { updateText = true; }

        var fontFamily = font;
        var fontSize = '';
        var fontStyle = '';

        if (typeof font !== 'string')
        {
            fontFamily = GetValue(font, 'fontFamily', 'Courier');
            fontSize = GetValue(font, 'fontSize', '16px');
            fontStyle = GetValue(font, 'fontStyle', '');
        }
        else
        {
            var fontSplit = font.split(' ');

            var i = 0;

            fontStyle = (fontSplit.length > 2) ? fontSplit[i++] : '';
            fontSize = fontSplit[i++] || '16px';
            fontFamily = fontSplit[i++] || 'Courier';
        }

        if (fontFamily !== this.fontFamily || fontSize !== this.fontSize || fontStyle !== this.fontStyle)
        {
            this.fontFamily = fontFamily;
            this.fontSize = fontSize;
            this.fontStyle = fontStyle;

            if (updateText)
            {
                this.update(true);
            }
        }

        return this.parent;
    },

    /**
     * Set the font family.
     *
     * @method Phaser.GameObjects.TextStyle#setFontFamily
     * @since 3.0.0
     *
     * @param {string} family - The font family.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setFontFamily: function (family)
    {
        if (this.fontFamily !== family)
        {
            this.fontFamily = family;

            this.update(true);
        }

        return this.parent;
    },

    /**
     * Set the font style.
     *
     * @method Phaser.GameObjects.TextStyle#setFontStyle
     * @since 3.0.0
     *
     * @param {string} style - The font style.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setFontStyle: function (style)
    {
        if (this.fontStyle !== style)
        {
            this.fontStyle = style;

            this.update(true);
        }

        return this.parent;
    },

    /**
     * Set the font size. Can be a string with a valid CSS unit, i.e. `16px`, or a number.
     *
     * @method Phaser.GameObjects.TextStyle#setFontSize
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

        if (this.fontSize !== size)
        {
            this.fontSize = size;

            this.update(true);
        }

        return this.parent;
    },

    /**
     * Set the test string to use when measuring the font.
     *
     * @method Phaser.GameObjects.TextStyle#setTestString
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
     * @method Phaser.GameObjects.TextStyle#setFixedSize
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
     * @method Phaser.GameObjects.TextStyle#setBackgroundColor
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
     * @method Phaser.GameObjects.TextStyle#setFill
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
     * @method Phaser.GameObjects.TextStyle#setColor
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
     * Set the resolution used by the Text object.
     *
     * By default it will be set to match the resolution set in the Game Config,
     * but you can override it via this method. It allows for much clearer text on High DPI devices,
     * at the cost of memory because it uses larger internal Canvas textures for the Text.
     *
     * Please use with caution, as the more high res Text you have, the more memory it uses up.
     *
     * @method Phaser.GameObjects.TextStyle#setResolution
     * @since 3.12.0
     *
     * @param {number} value - The resolution for this Text object to use.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setResolution: function (value)
    {
        this.resolution = value;

        return this.update(false);
    },

    /**
     * Set the stroke settings.
     *
     * @method Phaser.GameObjects.TextStyle#setStroke
     * @since 3.0.0
     *
     * @param {string} color - The stroke color.
     * @param {number} thickness - The stroke thickness.
     *
     * @return {Phaser.GameObjects.Text} The parent Text object.
     */
    setStroke: function (color, thickness)
    {
        if (thickness === undefined) { thickness = this.strokeThickness; }

        if (color === undefined && this.strokeThickness !== 0)
        {
            //  Reset the stroke to zero (disabling it)
            this.strokeThickness = 0;

            this.update(true);
        }
        else if (this.stroke !== color || this.strokeThickness !== thickness)
        {
            this.stroke = color;
            this.strokeThickness = thickness;

            this.update(true);
        }

        return this.parent;
    },

    /**
     * Set the shadow settings.
     *
     * Calling this method always re-measures the parent Text object,
     * so only call it when you actually change the shadow settings.
     *
     * @method Phaser.GameObjects.TextStyle#setShadow
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
     * @method Phaser.GameObjects.TextStyle#setShadowOffset
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
     * @method Phaser.GameObjects.TextStyle#setShadowColor
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
     * @method Phaser.GameObjects.TextStyle#setShadowBlur
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
     * @method Phaser.GameObjects.TextStyle#setShadowStroke
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
     * @method Phaser.GameObjects.TextStyle#setShadowFill
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
     * @method Phaser.GameObjects.TextStyle#setWordWrapWidth
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
     * @method Phaser.GameObjects.TextStyle#setWordWrapCallback
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
     * Set the alignment of the text in this Text object.
     *
     * The argument can be one of: `left`, `right`, `center` or `justify`.
     *
     * Alignment only works if the Text object has more than one line of text.
     *
     * @method Phaser.GameObjects.TextStyle#setAlign
     * @since 3.0.0
     *
     * @param {string} [align='left'] - The text alignment for multi-line text.
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
     * @method Phaser.GameObjects.TextStyle#setMaxLines
     * @since 3.0.0
     *
     * @param {number} [max=0] - The maximum number of lines to draw.
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
     * @method Phaser.GameObjects.TextStyle#getTextMetrics
     * @since 3.0.0
     *
     * @return {Phaser.Types.GameObjects.Text.TextMetrics} The text metrics.
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
     * @method Phaser.GameObjects.TextStyle#toJSON
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
     * @method Phaser.GameObjects.TextStyle#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.parent = undefined;
    }

});

module.exports = TextStyle;
