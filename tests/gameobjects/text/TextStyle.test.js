var TextStyle = require('../../../src/gameobjects/text/TextStyle');

//  MeasureText requires a Canvas, so we bypass it by always providing pre-built
//  metrics in the constructor style (which skips the MeasureText call) and by
//  overriding the `update` method on each instance so that font-change setters
//  cannot reach MeasureText either.

function createMockParent ()
{
    return {
        width: 0,
        height: 0,
        updateText: function () { return this; }
    };
}

function createStyle (parent, customStyle)
{
    var metrics = { ascent: 10, descent: 2, fontSize: 12 };
    var initStyle = Object.assign({ metrics: metrics }, customStyle || {});
    var style = new TextStyle(parent, initStyle);

    //  Prevent any subsequent call from reaching MeasureText
    style.update = function (recalculateMetrics)
    {
        if (recalculateMetrics)
        {
            this._font = [ this.fontStyle, this.fontSize, this.fontFamily ].join(' ').trim();
        }
        return this.parent.updateText();
    };

    return style;
}

function createMockContext ()
{
    return {
        font: '',
        textBaseline: '',
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 0,
        lineCap: '',
        lineJoin: '',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: '',
        shadowBlur: 0
    };
}

describe('TextStyle', function ()
{
    var parent;

    beforeEach(function ()
    {
        parent = createMockParent();
    });

    describe('constructor', function ()
    {
        it('should set default property values when no style is provided', function ()
        {
            var style = createStyle(parent);

            expect(style.fontFamily).toBe('Courier');
            expect(style.fontSize).toBe('16px');
            expect(style.fontStyle).toBe('');
            expect(style.color).toBe('#fff');
            expect(style.stroke).toBe('#fff');
            expect(style.strokeThickness).toBe(0);
            expect(style.align).toBe('left');
            expect(style.maxLines).toBe(0);
            expect(style.fixedWidth).toBe(0);
            expect(style.fixedHeight).toBe(0);
            expect(style.resolution).toBe(0);
            expect(style.rtl).toBe(false);
            expect(style.backgroundColor).toBeNull();
        });

        it('should set shadow defaults', function ()
        {
            var style = createStyle(parent);

            expect(style.shadowOffsetX).toBe(0);
            expect(style.shadowOffsetY).toBe(0);
            expect(style.shadowColor).toBe('#000');
            expect(style.shadowBlur).toBe(0);
            expect(style.shadowStroke).toBe(false);
            expect(style.shadowFill).toBe(false);
        });

        it('should set word wrap defaults', function ()
        {
            var style = createStyle(parent);

            expect(style.wordWrapWidth).toBeNull();
            expect(style.wordWrapCallback).toBeNull();
            expect(style.wordWrapCallbackScope).toBeNull();
            expect(style.wordWrapUseAdvanced).toBe(false);
        });

        it('should apply custom style values from the style object', function ()
        {
            var style = createStyle(parent, {
                fontFamily: 'Arial',
                fontSize: '32px',
                fontStyle: 'bold',
                color: '#ff0000',
                align: 'center',
                maxLines: 5
            });

            expect(style.fontFamily).toBe('Arial');
            expect(style.fontSize).toBe('32px');
            expect(style.fontStyle).toBe('bold');
            expect(style.color).toBe('#ff0000');
            expect(style.align).toBe('center');
            expect(style.maxLines).toBe(5);
        });

        it('should convert a numeric fontSize to a px string', function ()
        {
            var style = createStyle(parent, { fontSize: 24 });

            expect(style.fontSize).toBe('24px');
        });

        it('should store provided metrics without calling MeasureText', function ()
        {
            var style = createStyle(parent, {
                metrics: { ascent: 20, descent: 5, fontSize: 25 }
            });

            expect(style.metrics.ascent).toBe(20);
            expect(style.metrics.descent).toBe(5);
            expect(style.metrics.fontSize).toBe(25);
        });

        it('should store a reference to the parent object', function ()
        {
            var style = createStyle(parent);

            expect(style.parent).toBe(parent);
        });

        it('should build the _font string from fontStyle, fontSize and fontFamily', function ()
        {
            var style = createStyle(parent, {
                fontStyle: 'italic',
                fontSize: '20px',
                fontFamily: 'Arial'
            });

            expect(style._font).toBe('italic 20px Arial');
        });

        it('should omit fontStyle from _font when it is empty', function ()
        {
            var style = createStyle(parent, {
                fontStyle: '',
                fontSize: '16px',
                fontFamily: 'Courier'
            });

            expect(style._font).toBe('16px Courier');
        });

        it('should allow fill as an alias for color', function ()
        {
            var style = createStyle(parent, { fill: '#123456' });

            expect(style.color).toBe('#123456');
        });
    });

    describe('setStyle', function ()
    {
        it('should update properties and return the parent', function ()
        {
            var style = createStyle(parent);
            var result = style.setStyle({ color: '#aabbcc' }, false);

            expect(style.color).toBe('#aabbcc');
            expect(result).toBe(parent);
        });

        it('should not call parent.updateText when updateText is false', function ()
        {
            var style = createStyle(parent);
            var callCount = 0;
            parent.updateText = function () { callCount++; return parent; };

            style.setStyle({ color: '#aabbcc' }, false);

            expect(callCount).toBe(0);
        });
    });

    describe('setFont', function ()
    {
        it('should parse a two-part string into fontSize and fontFamily', function ()
        {
            var style = createStyle(parent);
            style.setFont('16px Arial', false);

            expect(style.fontFamily).toBe('Arial');
            expect(style.fontSize).toBe('16px');
            expect(style.fontStyle).toBe('');
        });

        it('should parse a three-part string into fontStyle, fontSize and fontFamily', function ()
        {
            var style = createStyle(parent);
            style.setFont('bold 24px Georgia', false);

            expect(style.fontStyle).toBe('bold');
            expect(style.fontSize).toBe('24px');
            expect(style.fontFamily).toBe('Georgia');
        });

        it('should accept an object with fontFamily, fontSize and fontStyle', function ()
        {
            var style = createStyle(parent);
            style.setFont({ fontFamily: 'Verdana', fontSize: '18px', fontStyle: 'italic' }, false);

            expect(style.fontFamily).toBe('Verdana');
            expect(style.fontSize).toBe('18px');
            expect(style.fontStyle).toBe('italic');
        });

        it('should return the parent object', function ()
        {
            var style = createStyle(parent);
            var result = style.setFont('16px Courier', false);

            expect(result).toBe(parent);
        });
    });

    describe('setFontSize', function ()
    {
        it('should convert a number to a px string', function ()
        {
            var style = createStyle(parent);
            style.setFontSize(48);

            expect(style.fontSize).toBe('48px');
        });

        it('should accept a string with a CSS unit directly', function ()
        {
            var style = createStyle(parent);
            style.setFontSize('2em');

            expect(style.fontSize).toBe('2em');
        });
    });

    describe('setColor and setFill', function ()
    {
        it('setColor should update the color property', function ()
        {
            var style = createStyle(parent);
            style.setColor('#ff00ff');

            expect(style.color).toBe('#ff00ff');
        });

        it('setFill should also update the color property', function ()
        {
            var style = createStyle(parent);
            style.setFill('rgba(0,255,0,0.5)');

            expect(style.color).toBe('rgba(0,255,0,0.5)');
        });
    });

    describe('setBackgroundColor', function ()
    {
        it('should set the backgroundColor property', function ()
        {
            var style = createStyle(parent);
            style.setBackgroundColor('#336699');

            expect(style.backgroundColor).toBe('#336699');
        });
    });

    describe('setResolution', function ()
    {
        it('should set the resolution property', function ()
        {
            var style = createStyle(parent);
            style.setResolution(2);

            expect(style.resolution).toBe(2);
        });
    });

    describe('setStroke', function ()
    {
        it('should set stroke color and thickness', function ()
        {
            var style = createStyle(parent);
            style.setStroke('#ff0000', 4);

            expect(style.stroke).toBe('#ff0000');
            expect(style.strokeThickness).toBe(4);
        });

        it('should reset strokeThickness to zero when called with no arguments and thickness was non-zero', function ()
        {
            var style = createStyle(parent, { stroke: '#ff0000', strokeThickness: 4 });
            style.setStroke();

            expect(style.strokeThickness).toBe(0);
        });
    });

    describe('setShadow', function ()
    {
        it('should set all shadow properties', function ()
        {
            var style = createStyle(parent);
            style.setShadow(5, 10, '#ff0000', 8, true, false);

            expect(style.shadowOffsetX).toBe(5);
            expect(style.shadowOffsetY).toBe(10);
            expect(style.shadowColor).toBe('#ff0000');
            expect(style.shadowBlur).toBe(8);
            expect(style.shadowStroke).toBe(true);
            expect(style.shadowFill).toBe(false);
        });

        it('should use defaults when called with no arguments', function ()
        {
            var style = createStyle(parent);
            style.setShadow();

            expect(style.shadowOffsetX).toBe(0);
            expect(style.shadowOffsetY).toBe(0);
            expect(style.shadowColor).toBe('#000');
            expect(style.shadowBlur).toBe(0);
            expect(style.shadowStroke).toBe(false);
            expect(style.shadowFill).toBe(true);
        });

        it('should return the parent object', function ()
        {
            var style = createStyle(parent);
            var result = style.setShadow(1, 1, '#000', 0);

            expect(result).toBe(parent);
        });
    });

    describe('setShadowOffset', function ()
    {
        it('should apply a single argument to both x and y', function ()
        {
            var style = createStyle(parent);
            style.setShadowOffset(7);

            expect(style.shadowOffsetX).toBe(7);
            expect(style.shadowOffsetY).toBe(7);
        });

        it('should set x and y independently', function ()
        {
            var style = createStyle(parent);
            style.setShadowOffset(3, 9);

            expect(style.shadowOffsetX).toBe(3);
            expect(style.shadowOffsetY).toBe(9);
        });
    });

    describe('setShadowColor', function ()
    {
        it('should set the shadowColor property', function ()
        {
            var style = createStyle(parent);
            style.setShadowColor('#aabbcc');

            expect(style.shadowColor).toBe('#aabbcc');
        });

        it('should default to #000 when called with no argument', function ()
        {
            var style = createStyle(parent);
            style.setShadowColor();

            expect(style.shadowColor).toBe('#000');
        });
    });

    describe('setShadowBlur', function ()
    {
        it('should set the shadowBlur property', function ()
        {
            var style = createStyle(parent);
            style.setShadowBlur(12);

            expect(style.shadowBlur).toBe(12);
        });

        it('should default to zero when called with no argument', function ()
        {
            var style = createStyle(parent);
            style.setShadowBlur();

            expect(style.shadowBlur).toBe(0);
        });
    });

    describe('setShadowStroke and setShadowFill', function ()
    {
        it('setShadowStroke should set the shadowStroke property', function ()
        {
            var style = createStyle(parent);
            style.setShadowStroke(true);

            expect(style.shadowStroke).toBe(true);
        });

        it('setShadowFill should set the shadowFill property', function ()
        {
            var style = createStyle(parent);
            style.setShadowFill(true);

            expect(style.shadowFill).toBe(true);
        });
    });

    describe('setWordWrapWidth', function ()
    {
        it('should set the word wrap width with basic wrapping', function ()
        {
            var style = createStyle(parent);
            style.setWordWrapWidth(300);

            expect(style.wordWrapWidth).toBe(300);
            expect(style.wordWrapUseAdvanced).toBe(false);
        });

        it('should enable advanced wrapping when the flag is true', function ()
        {
            var style = createStyle(parent);
            style.setWordWrapWidth(200, true);

            expect(style.wordWrapWidth).toBe(200);
            expect(style.wordWrapUseAdvanced).toBe(true);
        });

        it('should accept null to disable wrapping', function ()
        {
            var style = createStyle(parent);
            style.setWordWrapWidth(null);

            expect(style.wordWrapWidth).toBeNull();
        });
    });

    describe('setWordWrapCallback', function ()
    {
        it('should set a callback and its scope', function ()
        {
            var style = createStyle(parent);
            var cb = function () {};
            var scope = { foo: 'bar' };
            style.setWordWrapCallback(cb, scope);

            expect(style.wordWrapCallback).toBe(cb);
            expect(style.wordWrapCallbackScope).toBe(scope);
        });

        it('should default scope to null', function ()
        {
            var style = createStyle(parent);
            style.setWordWrapCallback(function () {});

            expect(style.wordWrapCallbackScope).toBeNull();
        });
    });

    describe('setAlign', function ()
    {
        it('should set the align property', function ()
        {
            var style = createStyle(parent);
            style.setAlign('center');

            expect(style.align).toBe('center');
        });

        it('should default to left when called with no argument', function ()
        {
            var style = createStyle(parent, { align: 'right' });
            style.setAlign();

            expect(style.align).toBe('left');
        });
    });

    describe('setMaxLines', function ()
    {
        it('should set the maxLines property', function ()
        {
            var style = createStyle(parent);
            style.setMaxLines(10);

            expect(style.maxLines).toBe(10);
        });

        it('should default to zero when called with no argument', function ()
        {
            var style = createStyle(parent, { maxLines: 5 });
            style.setMaxLines();

            expect(style.maxLines).toBe(0);
        });
    });

    describe('setFixedSize', function ()
    {
        it('should set fixedWidth and fixedHeight', function ()
        {
            var style = createStyle(parent);
            style.setFixedSize(200, 100);

            expect(style.fixedWidth).toBe(200);
            expect(style.fixedHeight).toBe(100);
        });

        it('should update parent width and height when values are non-zero', function ()
        {
            var style = createStyle(parent);
            style.setFixedSize(400, 300);

            expect(parent.width).toBe(400);
            expect(parent.height).toBe(300);
        });

        it('should not override parent dimensions when values are zero', function ()
        {
            parent.width = 50;
            parent.height = 50;

            var style = createStyle(parent);
            style.setFixedSize(0, 0);

            expect(parent.width).toBe(50);
            expect(parent.height).toBe(50);
        });
    });

    describe('syncFont', function ()
    {
        it('should set context.font to the internal _font string', function ()
        {
            var style = createStyle(parent, {
                fontStyle: 'bold',
                fontSize: '20px',
                fontFamily: 'Arial'
            });
            var ctx = createMockContext();
            style.syncFont(null, ctx);

            expect(ctx.font).toBe('bold 20px Arial');
        });
    });

    describe('syncStyle', function ()
    {
        it('should set fill, stroke and line properties on the context', function ()
        {
            var style = createStyle(parent, {
                color: '#aabbcc',
                stroke: '#112233',
                strokeThickness: 3
            });
            var ctx = createMockContext();
            style.syncStyle(null, ctx);

            expect(ctx.textBaseline).toBe('alphabetic');
            expect(ctx.fillStyle).toBe('#aabbcc');
            expect(ctx.strokeStyle).toBe('#112233');
            expect(ctx.lineWidth).toBe(3);
            expect(ctx.lineCap).toBe('round');
            expect(ctx.lineJoin).toBe('round');
        });
    });

    describe('syncShadow', function ()
    {
        it('should apply shadow settings to context when enabled', function ()
        {
            var style = createStyle(parent);
            style.setShadow(4, 6, '#ff0000', 10);

            var ctx = createMockContext();
            style.syncShadow(ctx, true);

            expect(ctx.shadowOffsetX).toBe(4);
            expect(ctx.shadowOffsetY).toBe(6);
            expect(ctx.shadowColor).toBe('#ff0000');
            expect(ctx.shadowBlur).toBe(10);
        });

        it('should zero out shadow settings when disabled', function ()
        {
            var style = createStyle(parent);

            var ctx = createMockContext();
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 8;

            style.syncShadow(ctx, false);

            expect(ctx.shadowOffsetX).toBe(0);
            expect(ctx.shadowOffsetY).toBe(0);
            expect(ctx.shadowColor).toBe(0);
            expect(ctx.shadowBlur).toBe(0);
        });
    });

    describe('getTextMetrics', function ()
    {
        it('should return an object with ascent, descent and fontSize', function ()
        {
            var style = createStyle(parent, {
                metrics: { ascent: 15, descent: 3, fontSize: 18 }
            });
            var metrics = style.getTextMetrics();

            expect(metrics.ascent).toBe(15);
            expect(metrics.descent).toBe(3);
            expect(metrics.fontSize).toBe(18);
        });

        it('should return a copy, not the original metrics object', function ()
        {
            var style = createStyle(parent, {
                metrics: { ascent: 10, descent: 2, fontSize: 12 }
            });
            var metrics = style.getTextMetrics();
            metrics.ascent = 999;

            expect(style.metrics.ascent).toBe(10);
        });
    });

    describe('toJSON', function ()
    {
        it('should include all property map keys in the output', function ()
        {
            var style = createStyle(parent);
            var json = style.toJSON();

            expect(json.fontFamily).toBe('Courier');
            expect(json.fontSize).toBe('16px');
            expect(json.color).toBe('#fff');
            expect(json.align).toBe('left');
            expect(json.maxLines).toBe(0);
            expect(json.shadowStroke).toBe(false);
            expect(json.wordWrapWidth).toBeNull();
        });

        it('should include a metrics object in the output', function ()
        {
            var style = createStyle(parent, {
                metrics: { ascent: 10, descent: 2, fontSize: 12 }
            });
            var json = style.toJSON();

            expect(json.metrics).toBeDefined();
            expect(json.metrics.ascent).toBe(10);
            expect(json.metrics.descent).toBe(2);
            expect(json.metrics.fontSize).toBe(12);
        });
    });

    describe('destroy', function ()
    {
        it('should set parent to undefined', function ()
        {
            var style = createStyle(parent);
            style.destroy();

            expect(style.parent).toBeUndefined();
        });
    });
});
