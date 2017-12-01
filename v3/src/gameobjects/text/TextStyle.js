var Class = require('../../utils/Class');
var GetValue = require('../../utils/object/GetValue');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
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
    fixedWidth: [ 'fixedWidth', false ],
    fixedHeight: [ 'fixedHeight', false ],
    rtl: [ 'rtl', false ],
    testString: [ 'testString', '|MÉqgy' ]
};

var TextStyle = new Class({

    initialize:

    function TextStyle (text, style)
    {
        this.parent = text;

        this.fontFamily;
        this.fontSize;
        this.fontStyle;
        this.backgroundColor;
        this.color;
        this.stroke;
        this.strokeThickness;
        this.shadowOffsetX;
        this.shadowOffsetY;
        this.shadowColor;
        this.shadowBlur;
        this.shadowStroke;
        this.shadowFill;
        this.align;
        this.maxLines;
        this.fixedWidth;
        this.fixedHeight;
        this.rtl;
        this.testString;

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
            this[key] = GetAdvancedValue(style, propertyMap[key][0], propertyMap[key][1]);
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
            this.update(true);
        }

        return this;
    },

    syncFont: function (canvas, context)
    {
        context.font = this._font;
        context.textBaseline = 'alphabetic';

        context.fillStyle = this.color;
        context.strokeStyle = this.stroke;

        context.lineWidth = this.strokeThickness;
        context.lineCap = 'round';
        context.lineJoin = 'round';
    },

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

    update: function (recalculateMetrics)
    {
        if (recalculateMetrics)
        {
            this._font = [ this.fontStyle, this.fontSize, this.fontFamily ].join(' ');

            this.metrics = MeasureText(this);
        }

        return this.parent.updateText();
    },

    //  Allows you to set them all in a single object
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

    setFontFamily: function (family)
    {
        this.fontFamily = family;

        return this.update(true);
    },

    setFontStyle: function (style)
    {
        this.fontStyle = style;

        return this.update(true);
    },

    setFontSize: function (size)
    {
        if (typeof size === 'number')
        {
            size = size.toString() + 'px';
        }

        this.fontSize = size;

        return this.update(true);
    },

    setTestString: function (string)
    {
        this.testString = string;

        return this.update(true);
    },

    setFixedSize: function (width, height)
    {
        this.fixedWidth = width;
        this.fixedHeight = height;

        if (width)
        {
            this.text.width = width;
        }

        if (height)
        {
            this.text.height = height;
        }

        return this.update(false);
    },

    setBackgroundColor: function (color)
    {
        this.backgroundColor = color;

        return this.update(false);
    },

    setFill: function (color)
    {
        this.color = color;

        return this.update(false);
    },

    setColor: function (color)
    {
        this.color = color;

        return this.update(false);
    },

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

    setShadowOffset: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.shadowOffsetX = x;
        this.shadowOffsetY = y;

        return this.update(false);
    },

    setShadowColor: function (color)
    {
        if (color === undefined) { color = '#000'; }

        this.shadowColor = color;

        return this.update(false);
    },

    setShadowBlur: function (blur)
    {
        if (blur === undefined) { blur = 0; }

        this.shadowBlur = blur;

        return this.update(false);
    },

    setShadowStroke: function (enabled)
    {
        this.shadowStroke = enabled;

        return this.update(false);
    },

    setShadowFill: function (enabled)
    {
        this.shadowFill = enabled;

        return this.update(false);
    },

    setAlign: function (align)
    {
        if (align === undefined) { align = 'left'; }

        this.align = align;

        return this.update(false);
    },

    setMaxLines: function (max)
    {
        if (max === undefined) { max = 0; }

        this.maxLines = max;

        return this.update(false);
    },

    getTextMetrics: function ()
    {
        var metrics = this.metrics;

        return {
            ascent: metrics.ascent,
            descent: metrics.descent,
            fontSize: metrics.fontSize
        };
    },

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

    destroy: function ()
    {
        this.parent = undefined;
    }

});

module.exports = TextStyle;
