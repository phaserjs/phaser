var Class = require('../../utils/Class');
var GetValue = require('../../utils/object/GetValue');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var MeasureText = require('./MeasureText');

//  Key: [ Object Key, Default Value ]

var propertyMap = {
    font: [ 'font', '16px Courier' ],
    backgroundColor: [ 'backgroundColor', null ],
    fill: [ 'fill', '#fff' ],
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
    rtl: [ 'rtl', false ]
};

var TextStyle = new Class({

    initialize:

    function TextStyle (text, style)
    {
        this.parent = text;

        this.font;
        this.backgroundColor;
        this.fill;
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

        //  Set to defaults
        this.reset();

        if (style)
        {
            for (var key in propertyMap)
            {
                this[key] = GetAdvancedValue(style, propertyMap[key][0], this[key]);
            }
        }

        var metrics = GetValue(style, 'metrics', false);

        //  Provide optional TextMetrics in the style object to avoid the canvas look-up / scanning
        //  Doing this is un-done if you then change the font of this TextStyle after creation
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

    reset: function ()
    {
        for (var key in propertyMap)
        {
            this[key] = propertyMap[key][1];
        }

        return this;
    },

    syncFont: function (canvas, context)
    {
        if (this.rtl)
        {
            canvas.dir = 'rtl';
        }

        context.font = this.font;
        context.textBaseline = 'alphabetic';

        context.fillStyle = this.fill;
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
            this.metrics = MeasureText(this);
        }

        return this.parent.updateText();
    },

    setStyle: function (style)
    {
        for (var key in propertyMap)
        {
            this[key] = GetAdvancedValue(style, propertyMap[key][0], this[key]);
        }

        return this.update(true);
    },

    setFont: function (font)
    {
        this.font = font;

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
        this.fill = color;

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
        if (shadowFill === undefined) { shadowFill = false; }

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
