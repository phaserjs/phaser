var Class = require('../../utils/Class');
var GetObjectValue = require('../../utils/object/GetObjectValue');
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
    fixedHeight: [ 'fixedHeight', false ]
};

var TextStyle = new Class({

    initialize:

    function TextStyle (text, style)
    {
        this.parent = text;

        this.font = propertyMap.font[1];
        this.backgroundColor = propertyMap.backgroundColor[1];
        this.fill = propertyMap.fill[1];
        this.stroke = propertyMap.stroke[1];
        this.strokeThickness = propertyMap.strokeThickness[1];
        this.shadowOffsetX = propertyMap.shadowOffsetX[1];
        this.shadowOffsetY = propertyMap.shadowOffsetY[1];
        this.shadowColor = propertyMap.shadowColor[1];
        this.shadowBlur = propertyMap.shadowBlur[1];
        this.shadowStroke = propertyMap.shadowStroke[1];
        this.shadowFill = propertyMap.shadowFill[1];
        this.align = propertyMap.align[1];
        this.maxLines = propertyMap.maxLines[1];
        this.fixedWidth = propertyMap.fixedWidth[1];
        this.fixedHeight = propertyMap.fixedHeight[1];

        if (style !== undefined)
        {
            for (var key in propertyMap)
            {
                this[key] = GetObjectValue(style, propertyMap[key][0], this[key]);
            }
        }

        this.metrics = MeasureText(this);
    },

    syncFont: function (canvas, context)
    {
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
        var style = this;

        if (enabled)
        {
            context.shadowOffsetX = style.shadowOffsetX;
            context.shadowOffsetY = style.shadowOffsetY;
            context.shadowColor = style.shadowColor;
            context.shadowBlur = style.shadowBlur;
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
            this[key] = GetObjectValue(style, propertyMap[key][0], this[key]);
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

    destroy: function ()
    {
        this.parent = undefined;
    }

});

module.exports = TextStyle;
