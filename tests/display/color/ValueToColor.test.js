var ValueToColor = require('../../../src/display/color/ValueToColor');

describe('Phaser.Display.Color.ValueToColor', function ()
{
    describe('hex string input', function ()
    {
        it('should return a Color object from a full hex string with hash prefix', function ()
        {
            var color = ValueToColor('#ff0000');

            expect(color.red).toBe(255);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
        });

        it('should return a Color object from a short hex string with hash prefix', function ()
        {
            var color = ValueToColor('#f00');

            expect(color.red).toBe(255);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
        });

        it('should return a Color object from a hex string with 0x prefix', function ()
        {
            var color = ValueToColor('0x00ff00');

            expect(color.red).toBe(0);
            expect(color.green).toBe(255);
            expect(color.blue).toBe(0);
        });

        it('should return a Color object from an unprefixed hex string', function ()
        {
            var color = ValueToColor('0000ff');

            expect(color.red).toBe(0);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(255);
        });

        it('should return a Color object for black hex string', function ()
        {
            var color = ValueToColor('#000000');

            expect(color.red).toBe(0);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
        });

        it('should return a Color object for white hex string', function ()
        {
            var color = ValueToColor('#ffffff');

            expect(color.red).toBe(255);
            expect(color.green).toBe(255);
            expect(color.blue).toBe(255);
        });

        it('should populate an existing Color object when passed as second argument', function ()
        {
            var Color = require('../../../src/display/color/Color');
            var existing = new Color();
            var result = ValueToColor('#cc3300', existing);

            expect(result).toBe(existing);
            expect(result.red).toBe(204);
            expect(result.green).toBe(51);
            expect(result.blue).toBe(0);
        });

        it('should handle mixed case hex strings', function ()
        {
            var color = ValueToColor('#FF8800');

            expect(color.red).toBe(255);
            expect(color.green).toBe(136);
            expect(color.blue).toBe(0);
        });
    });

    describe('rgb string input', function ()
    {
        it('should return a Color object from an rgb() string', function ()
        {
            var color = ValueToColor('rgb(255, 128, 0)');

            expect(color.red).toBe(255);
            expect(color.green).toBe(128);
            expect(color.blue).toBe(0);
        });

        it('should return a Color object from an rgba() string', function ()
        {
            var color = ValueToColor('rgba(100, 150, 200, 0.5)');

            expect(color.red).toBe(100);
            expect(color.green).toBe(150);
            expect(color.blue).toBe(200);
            expect(color.alpha).toBe(127);
        });

        it('should dispatch to RGBStringToColor for strings starting with RGB (uppercase)', function ()
        {
            var color = ValueToColor('RGB(10, 20, 30)');

            expect(color.red).toBe(10);
            expect(color.green).toBe(20);
            expect(color.blue).toBe(30);
        });

        it('should populate an existing Color object when passed as second argument', function ()
        {
            var Color = require('../../../src/display/color/Color');
            var existing = new Color();
            var result = ValueToColor('rgb(0, 255, 0)', existing);

            expect(result).toBe(existing);
            expect(result.red).toBe(0);
            expect(result.green).toBe(255);
            expect(result.blue).toBe(0);
        });

        it('should handle rgba with alpha of 1', function ()
        {
            var color = ValueToColor('rgba(255, 0, 0, 1)');

            expect(color.red).toBe(255);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
            expect(color.alpha).toBe(255);
        });

        it('should handle rgba with alpha of 0', function ()
        {
            var color = ValueToColor('rgba(0, 0, 0, 0)');

            expect(color.alpha).toBe(0);
        });
    });

    describe('number input', function ()
    {
        it('should return a Color object from a packed integer for red', function ()
        {
            var color = ValueToColor(0xff0000);

            expect(color.red).toBe(255);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
        });

        it('should return a Color object from a packed integer for green', function ()
        {
            var color = ValueToColor(0x00ff00);

            expect(color.red).toBe(0);
            expect(color.green).toBe(255);
            expect(color.blue).toBe(0);
        });

        it('should return a Color object from a packed integer for blue', function ()
        {
            var color = ValueToColor(0x0000ff);

            expect(color.red).toBe(0);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(255);
        });

        it('should return a Color object for black (0)', function ()
        {
            var color = ValueToColor(0);

            expect(color.red).toBe(0);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
        });

        it('should return a Color object for white (0xffffff)', function ()
        {
            var color = ValueToColor(0xffffff);

            expect(color.red).toBe(255);
            expect(color.green).toBe(255);
            expect(color.blue).toBe(255);
        });

        it('should populate an existing Color object when passed as second argument', function ()
        {
            var Color = require('../../../src/display/color/Color');
            var existing = new Color();
            var result = ValueToColor(0x336699, existing);

            expect(result).toBe(existing);
            expect(result.red).toBe(51);
            expect(result.green).toBe(102);
            expect(result.blue).toBe(153);
        });
    });

    describe('object input', function ()
    {
        it('should return a Color object from a plain r/g/b object', function ()
        {
            var color = ValueToColor({ r: 255, g: 128, b: 64 });

            expect(color.red).toBe(255);
            expect(color.green).toBe(128);
            expect(color.blue).toBe(64);
        });

        it('should return a Color object from a plain r/g/b/a object', function ()
        {
            var color = ValueToColor({ r: 10, g: 20, b: 30, a: 200 });

            expect(color.red).toBe(10);
            expect(color.green).toBe(20);
            expect(color.blue).toBe(30);
            expect(color.alpha).toBe(200);
        });

        it('should return a Color object for zeroed r/g/b object', function ()
        {
            var color = ValueToColor({ r: 0, g: 0, b: 0 });

            expect(color.red).toBe(0);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
        });

        it('should populate an existing Color object when passed as second argument', function ()
        {
            var Color = require('../../../src/display/color/Color');
            var existing = new Color();
            var result = ValueToColor({ r: 1, g: 2, b: 3 }, existing);

            expect(result).toBe(existing);
            expect(result.red).toBe(1);
            expect(result.green).toBe(2);
            expect(result.blue).toBe(3);
        });
    });

    describe('return type', function ()
    {
        it('should return an object with red, green, blue properties for hex string', function ()
        {
            var color = ValueToColor('#abcdef');

            expect(typeof color).toBe('object');
            expect(color).toHaveProperty('red');
            expect(color).toHaveProperty('green');
            expect(color).toHaveProperty('blue');
        });

        it('should return an object with red, green, blue properties for number', function ()
        {
            var color = ValueToColor(0xabcdef);

            expect(typeof color).toBe('object');
            expect(color).toHaveProperty('red');
            expect(color).toHaveProperty('green');
            expect(color).toHaveProperty('blue');
        });

        it('should return an object with red, green, blue properties for rgb string', function ()
        {
            var color = ValueToColor('rgb(1, 2, 3)');

            expect(typeof color).toBe('object');
            expect(color).toHaveProperty('red');
            expect(color).toHaveProperty('green');
            expect(color).toHaveProperty('blue');
        });

        it('should return an object with red, green, blue properties for plain object', function ()
        {
            var color = ValueToColor({ r: 1, g: 2, b: 3 });

            expect(typeof color).toBe('object');
            expect(color).toHaveProperty('red');
            expect(color).toHaveProperty('green');
            expect(color).toHaveProperty('blue');
        });
    });
});
