var ColorMatrix = require('../../src/display/ColorMatrix');

describe('ColorMatrix', function ()
{
    var cm;

    beforeEach(function ()
    {
        cm = new ColorMatrix();
    });

    describe('constructor', function ()
    {
        it('should create a ColorMatrix with default alpha of 1', function ()
        {
            expect(cm.alpha).toBe(1);
        });

        it('should initialise _matrix as a Float32Array of 20 elements', function ()
        {
            expect(cm._matrix).toBeInstanceOf(Float32Array);
            expect(cm._matrix.length).toBe(20);
        });

        it('should initialise the matrix as an identity matrix', function ()
        {
            var m = cm._matrix;
            expect(m[0]).toBe(1);
            expect(m[6]).toBe(1);
            expect(m[12]).toBe(1);
            expect(m[18]).toBe(1);
        });

        it('should set non-diagonal elements to zero', function ()
        {
            var m = cm._matrix;
            var identityIndices = [0, 6, 12, 18];
            for (var i = 0; i < 20; i++)
            {
                if (identityIndices.indexOf(i) === -1)
                {
                    expect(m[i]).toBe(0);
                }
            }
        });
    });

    describe('set', function ()
    {
        it('should set the matrix values from an array', function ()
        {
            var values = [
                1, 2, 3, 4, 5,
                6, 7, 8, 9, 10,
                11, 12, 13, 14, 15,
                16, 17, 18, 19, 20
            ];
            cm.set(values);
            for (var i = 0; i < 20; i++)
            {
                expect(cm._matrix[i]).toBe(values[i]);
            }
        });

        it('should set the matrix values from a Float32Array', function ()
        {
            var values = new Float32Array(20);
            values[0] = 0.5;
            values[5] = 0.25;
            cm.set(values);
            expect(cm._matrix[0]).toBeCloseTo(0.5);
            expect(cm._matrix[5]).toBeCloseTo(0.25);
        });

        it('should mark the matrix as dirty', function ()
        {
            cm._dirty = false;
            cm.set([1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0]);
            expect(cm._dirty).toBe(true);
        });

        it('should return the ColorMatrix instance', function ()
        {
            var result = cm.set([1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0]);
            expect(result).toBe(cm);
        });
    });

    describe('reset', function ()
    {
        it('should reset matrix to identity', function ()
        {
            cm.set([5,5,5,5,5, 5,5,5,5,5, 5,5,5,5,5, 5,5,5,5,5]);
            cm.reset();
            var m = cm._matrix;
            expect(m[0]).toBe(1);
            expect(m[6]).toBe(1);
            expect(m[12]).toBe(1);
            expect(m[18]).toBe(1);
        });

        it('should zero all non-diagonal elements after reset', function ()
        {
            cm.set([5,5,5,5,5, 5,5,5,5,5, 5,5,5,5,5, 5,5,5,5,5]);
            cm.reset();
            var m = cm._matrix;
            var identityIndices = [0, 6, 12, 18];
            for (var i = 0; i < 20; i++)
            {
                if (identityIndices.indexOf(i) === -1)
                {
                    expect(m[i]).toBe(0);
                }
            }
        });

        it('should reset alpha to 1', function ()
        {
            cm.alpha = 0.5;
            cm.reset();
            expect(cm.alpha).toBe(1);
        });

        it('should mark the matrix as dirty', function ()
        {
            cm._dirty = false;
            cm.reset();
            expect(cm._dirty).toBe(true);
        });

        it('should return the ColorMatrix instance', function ()
        {
            var result = cm.reset();
            expect(result).toBe(cm);
        });
    });

    describe('getData', function ()
    {
        it('should return a Float32Array', function ()
        {
            var data = cm.getData();
            expect(data).toBeInstanceOf(Float32Array);
        });

        it('should return a Float32Array of 20 elements', function ()
        {
            var data = cm.getData();
            expect(data.length).toBe(20);
        });

        it('should divide the addition column (indices 4,9,14,19) by 255', function ()
        {
            cm.set([1,0,0,0,255, 0,1,0,0,255, 0,0,1,0,255, 0,0,0,1,255]);
            var data = cm.getData();
            expect(data[4]).toBeCloseTo(1.0);
            expect(data[9]).toBeCloseTo(1.0);
            expect(data[14]).toBeCloseTo(1.0);
            expect(data[19]).toBeCloseTo(1.0);
        });

        it('should not divide non-addition columns by 255', function ()
        {
            var data = cm.getData();
            expect(data[0]).toBe(1);
            expect(data[6]).toBe(1);
            expect(data[12]).toBe(1);
            expect(data[18]).toBe(1);
        });

        it('should clear the dirty flag after retrieval', function ()
        {
            cm.getData();
            expect(cm._dirty).toBe(false);
        });

        it('should return the same array reference on second call when not dirty', function ()
        {
            var data1 = cm.getData();
            var data2 = cm.getData();
            expect(data1).toBe(data2);
        });

        it('should recompute data when dirty', function ()
        {
            cm.getData();
            cm.set([2,0,0,0,0, 0,2,0,0,0, 0,0,2,0,0, 0,0,0,1,0]);
            var data = cm.getData();
            expect(data[0]).toBeCloseTo(2);
        });
    });

    describe('brightness', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.brightness(0.5)).toBe(cm);
        });

        it('should default value to 0 when no argument given', function ()
        {
            cm.brightness();
            var data = cm.getData();
            expect(data[0]).toBeCloseTo(0);
        });

        it('should scale RGB channels by the brightness value', function ()
        {
            cm.brightness(0.5);
            var data = cm.getData();
            expect(data[0]).toBeCloseTo(0.5);
            expect(data[6]).toBeCloseTo(0.5);
            expect(data[12]).toBeCloseTo(0.5);
            expect(data[18]).toBe(1);
        });

        it('should set full brightness with value 1', function ()
        {
            cm.brightness(1);
            var data = cm.getData();
            expect(data[0]).toBeCloseTo(1);
            expect(data[6]).toBeCloseTo(1);
            expect(data[12]).toBeCloseTo(1);
        });
    });

    describe('saturate', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.saturate(1)).toBe(cm);
        });

        it('should default value to 0 when no argument given', function ()
        {
            cm.saturate();
            var data = cm.getData();
            // value=0 → x=1, y=0 → identity-like
            expect(data[0]).toBeCloseTo(1);
        });

        it('should produce a desaturated result with value -1', function ()
        {
            cm.saturate(-1);
            // x = (-1 * 2/3) + 1 = 1/3, y = (1/3 - 1) * -0.5 = 1/3
            var x = (-1 * 2 / 3) + 1;
            var y = (x - 1) * -0.5;
            var data = cm.getData();
            expect(data[0]).toBeCloseTo(x);
            expect(data[1]).toBeCloseTo(y);
        });
    });

    describe('desaturate', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.desaturate()).toBe(cm);
        });

        it('should produce same result as saturate(-1)', function ()
        {
            var cm2 = new ColorMatrix();
            cm.desaturate();
            cm2.saturate(-1);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('hue', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.hue(90)).toBe(cm);
        });

        it('should default rotation to 0', function ()
        {
            cm.hue();
            var cm2 = new ColorMatrix();
            cm2.hue(0);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });

        it('should produce identity-like result with 0 degree rotation', function ()
        {
            cm.hue(0);
            var data = cm.getData();
            // cos(0)=1, sin(0)=0 → identity matrix
            expect(data[0]).toBeCloseTo(1);
            expect(data[6]).toBeCloseTo(1);
            expect(data[12]).toBeCloseTo(1);
        });

        it('should produce different result with 90 degree rotation', function ()
        {
            var cm2 = new ColorMatrix();
            cm.hue(90);
            cm2.hue(0);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            var different = false;
            for (var i = 0; i < 15; i++)
            {
                if (Math.abs(d1[i] - d2[i]) > 0.001)
                {
                    different = true;
                    break;
                }
            }
            expect(different).toBe(true);
        });

        it('should preserve alpha channel', function ()
        {
            cm.hue(180);
            var data = cm.getData();
            expect(data[18]).toBeCloseTo(1);
        });
    });

    describe('grayscale', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.grayscale()).toBe(cm);
        });

        it('should default value to 1', function ()
        {
            var cm2 = new ColorMatrix();
            cm.grayscale();
            cm2.grayscale(1);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });

        it('should produce same result as saturate(-value)', function ()
        {
            var cm2 = new ColorMatrix();
            cm.grayscale(0.5);
            cm2.saturate(-0.5);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('blackWhite', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.blackWhite()).toBe(cm);
        });

        it('should apply the BLACK_WHITE constant matrix', function ()
        {
            cm.blackWhite();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.BLACK_WHITE);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });

        it('should have equal R/G/B channel weightings in the result', function ()
        {
            cm.blackWhite();
            var data = cm.getData();
            // Row 0 and row 1 should be identical
            expect(data[0]).toBeCloseTo(data[5]);
            expect(data[1]).toBeCloseTo(data[6]);
        });
    });

    describe('black', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.black()).toBe(cm);
        });

        it('should zero out RGB channels', function ()
        {
            cm.black();
            var data = cm.getData();
            expect(data[0]).toBeCloseTo(0);
            expect(data[6]).toBeCloseTo(0);
            expect(data[12]).toBeCloseTo(0);
        });

        it('should preserve alpha channel', function ()
        {
            cm.black();
            var data = cm.getData();
            expect(data[18]).toBeCloseTo(1);
        });
    });

    describe('contrast', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.contrast(0.5)).toBe(cm);
        });

        it('should default value to 0', function ()
        {
            cm.contrast();
            var data = cm.getData();
            // v=1, o=0 → identity
            expect(data[0]).toBeCloseTo(1);
        });

        it('should scale RGB equally by value+1', function ()
        {
            cm.contrast(1);
            var data = cm.getData();
            // v=2, o = -0.5*(2-1) = -0.5 → offset = -0.5/255
            expect(data[0]).toBeCloseTo(2);
            expect(data[6]).toBeCloseTo(2);
            expect(data[12]).toBeCloseTo(2);
        });

        it('should apply the offset to the addition column', function ()
        {
            cm.contrast(1);
            var data = cm.getData();
            var v = 2;
            var o = -0.5 * (v - 1);
            expect(data[4]).toBeCloseTo(o / 255);
        });
    });

    describe('negative', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.negative()).toBe(cm);
        });

        it('should apply the NEGATIVE constant matrix', function ()
        {
            cm.negative();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.NEGATIVE);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('desaturateLuminance', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.desaturateLuminance()).toBe(cm);
        });

        it('should apply the DESATURATE_LUMINANCE constant matrix', function ()
        {
            cm.desaturateLuminance();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.DESATURATE_LUMINANCE);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('sepia', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.sepia()).toBe(cm);
        });

        it('should apply the SEPIA constant matrix', function ()
        {
            cm.sepia();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.SEPIA);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('night', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.night()).toBe(cm);
        });

        it('should default intensity to 0.1', function ()
        {
            var cm2 = new ColorMatrix();
            cm.night();
            cm2.night(0.1);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });

        it('should scale with intensity', function ()
        {
            var cm2 = new ColorMatrix();
            cm.night(0.5);
            cm2.night(0.1);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            var different = false;
            for (var i = 0; i < 15; i++)
            {
                if (Math.abs(d1[i] - d2[i]) > 0.001)
                {
                    different = true;
                    break;
                }
            }
            expect(different).toBe(true);
        });
    });

    describe('lsd', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.lsd()).toBe(cm);
        });

        it('should apply the LSD constant matrix', function ()
        {
            cm.lsd();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.LSD);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('brown', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.brown()).toBe(cm);
        });

        it('should apply the BROWN constant matrix', function ()
        {
            cm.brown();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.BROWN);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('vintagePinhole', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.vintagePinhole()).toBe(cm);
        });

        it('should apply the VINTAGE constant matrix', function ()
        {
            cm.vintagePinhole();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.VINTAGE);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('kodachrome', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.kodachrome()).toBe(cm);
        });

        it('should apply the KODACHROME constant matrix', function ()
        {
            cm.kodachrome();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.KODACHROME);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('technicolor', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.technicolor()).toBe(cm);
        });

        it('should apply the TECHNICOLOR constant matrix', function ()
        {
            cm.technicolor();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.TECHNICOLOR);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('polaroid', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.polaroid()).toBe(cm);
        });

        it('should apply the POLAROID constant matrix', function ()
        {
            cm.polaroid();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.POLAROID);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('alphaToBrightness', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.alphaToBrightness()).toBe(cm);
        });

        it('should apply the ALPHA_TO_BRIGHTNESS constant matrix', function ()
        {
            cm.alphaToBrightness();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.ALPHA_TO_BRIGHTNESS);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });

        it('should set alpha output to full via the addition column', function ()
        {
            cm.alphaToBrightness();
            var data = cm.getData();
            // index 19 = 255/255 = 1
            expect(data[19]).toBeCloseTo(1);
        });
    });

    describe('alphaToBrightnessInverse', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.alphaToBrightnessInverse()).toBe(cm);
        });

        it('should apply the ALPHA_TO_BRIGHTNESS_INVERSE constant matrix', function ()
        {
            cm.alphaToBrightnessInverse();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.ALPHA_TO_BRIGHTNESS_INVERSE);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('brightnessToAlpha', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.brightnessToAlpha()).toBe(cm);
        });

        it('should apply the BRIGHTNESS_TO_ALPHA constant matrix', function ()
        {
            cm.brightnessToAlpha();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.BRIGHTNESS_TO_ALPHA);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });

        it('should preserve RGB and use brightness for alpha row', function ()
        {
            cm.brightnessToAlpha();
            var data = cm.getData();
            // RGB rows should be identity
            expect(data[0]).toBeCloseTo(1);
            expect(data[6]).toBeCloseTo(1);
            expect(data[12]).toBeCloseTo(1);
            // Alpha row uses luminance weights
            expect(data[15]).toBeCloseTo(0.3);
            expect(data[16]).toBeCloseTo(0.6);
            expect(data[17]).toBeCloseTo(0.1);
        });
    });

    describe('brightnessToAlphaInverse', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.brightnessToAlphaInverse()).toBe(cm);
        });

        it('should apply the BRIGHTNESS_TO_ALPHA_INVERSE constant matrix', function ()
        {
            cm.brightnessToAlphaInverse();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.BRIGHTNESS_TO_ALPHA_INVERSE);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });
    });

    describe('shiftToBGR', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            expect(cm.shiftToBGR()).toBe(cm);
        });

        it('should apply the SHIFT_BGR constant matrix', function ()
        {
            cm.shiftToBGR();
            var cm2 = new ColorMatrix();
            cm2.multiply(ColorMatrix.SHIFT_BGR);
            var d1 = cm.getData();
            var d2 = cm2.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(d1[i]).toBeCloseTo(d2[i]);
            }
        });

        it('should swap R and B channels', function ()
        {
            cm.shiftToBGR();
            var data = cm.getData();
            // Red row: contribution from blue (index 2 = 1)
            expect(data[0]).toBeCloseTo(0);
            expect(data[2]).toBeCloseTo(1);
            // Blue row: contribution from red (index 10 = 1)
            expect(data[10]).toBeCloseTo(1);
            expect(data[12]).toBeCloseTo(0);
        });
    });

    describe('multiply', function ()
    {
        it('should return the ColorMatrix instance', function ()
        {
            var identity = [1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0];
            expect(cm.multiply(identity)).toBe(cm);
        });

        it('should reset before multiplying when multiply=false', function ()
        {
            cm.brightness(0.5);
            var identity = [1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0];
            cm.multiply(identity, false);
            var data = cm.getData();
            expect(data[0]).toBeCloseTo(1);
        });

        it('should compound the transform when multiply=true', function ()
        {
            var scale2 = [2,0,0,0,0, 0,2,0,0,0, 0,0,2,0,0, 0,0,0,1,0];
            cm.multiply(scale2, false);
            cm.multiply(scale2, true);
            var data = cm.getData();
            expect(data[0]).toBeCloseTo(4);
            expect(data[6]).toBeCloseTo(4);
            expect(data[12]).toBeCloseTo(4);
        });

        it('should mark the matrix as dirty', function ()
        {
            cm.getData();
            expect(cm._dirty).toBe(false);
            var identity = [1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0];
            cm.multiply(identity);
            expect(cm._dirty).toBe(true);
        });

        it('should accumulate offset values in the addition column', function ()
        {
            var withOffset = [1,0,0,0,100, 0,1,0,0,50, 0,0,1,0,25, 0,0,0,1,0];
            cm.multiply(withOffset, false);
            var data = cm.getData();
            expect(data[4]).toBeCloseTo(100 / 255);
            expect(data[9]).toBeCloseTo(50 / 255);
            expect(data[14]).toBeCloseTo(25 / 255);
        });

        it('should accumulate offset from prior state when multiply=true', function ()
        {
            var withOffset = [1,0,0,0,100, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0];
            cm.multiply(withOffset, false);
            cm.multiply(withOffset, true);
            var data = cm.getData();
            // Second application: c[4]=100, a[4]=100, c[0]=1, a[0]=1
            // new[4] = (c[0]*a[4]) + ... + c[4] = (1*100) + 100 = 200
            expect(data[4]).toBeCloseTo(200 / 255);
        });

        it('should apply an identity matrix without changing values', function ()
        {
            cm.brightness(0.7);
            var dataBefore = new Float32Array(cm.getData());
            cm.multiply([1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0], true);
            var dataAfter = cm.getData();
            for (var i = 0; i < 20; i++)
            {
                expect(dataAfter[i]).toBeCloseTo(dataBefore[i]);
            }
        });
    });

    describe('static constants', function ()
    {
        it('should define BLACK as a 20-element array', function ()
        {
            expect(ColorMatrix.BLACK.length).toBe(20);
        });

        it('should define BLACK_WHITE as a 20-element array', function ()
        {
            expect(ColorMatrix.BLACK_WHITE.length).toBe(20);
        });

        it('should define NEGATIVE as a 20-element array', function ()
        {
            expect(ColorMatrix.NEGATIVE.length).toBe(20);
        });

        it('should define DESATURATE_LUMINANCE as a 20-element array', function ()
        {
            expect(ColorMatrix.DESATURATE_LUMINANCE.length).toBe(20);
        });

        it('should define SEPIA as a 20-element array', function ()
        {
            expect(ColorMatrix.SEPIA.length).toBe(20);
        });

        it('should define LSD as a 20-element array', function ()
        {
            expect(ColorMatrix.LSD.length).toBe(20);
        });

        it('should define BROWN as a 20-element array', function ()
        {
            expect(ColorMatrix.BROWN.length).toBe(20);
        });

        it('should define VINTAGE as a 20-element array', function ()
        {
            expect(ColorMatrix.VINTAGE.length).toBe(20);
        });

        it('should define KODACHROME as a 20-element array', function ()
        {
            expect(ColorMatrix.KODACHROME.length).toBe(20);
        });

        it('should define TECHNICOLOR as a 20-element array', function ()
        {
            expect(ColorMatrix.TECHNICOLOR.length).toBe(20);
        });

        it('should define POLAROID as a 20-element array', function ()
        {
            expect(ColorMatrix.POLAROID.length).toBe(20);
        });

        it('should define ALPHA_TO_BRIGHTNESS as a 20-element array', function ()
        {
            expect(ColorMatrix.ALPHA_TO_BRIGHTNESS.length).toBe(20);
        });

        it('should define ALPHA_TO_BRIGHTNESS_INVERSE as a 20-element array', function ()
        {
            expect(ColorMatrix.ALPHA_TO_BRIGHTNESS_INVERSE.length).toBe(20);
        });

        it('should define BRIGHTNESS_TO_ALPHA as a 20-element array', function ()
        {
            expect(ColorMatrix.BRIGHTNESS_TO_ALPHA.length).toBe(20);
        });

        it('should define BRIGHTNESS_TO_ALPHA_INVERSE as a 20-element array', function ()
        {
            expect(ColorMatrix.BRIGHTNESS_TO_ALPHA_INVERSE.length).toBe(20);
        });

        it('should define SHIFT_BGR as a 20-element array', function ()
        {
            expect(ColorMatrix.SHIFT_BGR.length).toBe(20);
        });

        it('BLACK should zero all RGB contribution columns', function ()
        {
            expect(ColorMatrix.BLACK[0]).toBe(0);
            expect(ColorMatrix.BLACK[6]).toBe(0);
            expect(ColorMatrix.BLACK[12]).toBe(0);
            expect(ColorMatrix.BLACK[18]).toBe(1);
        });

        it('SHIFT_BGR should swap R and B columns', function ()
        {
            expect(ColorMatrix.SHIFT_BGR[0]).toBe(0);
            expect(ColorMatrix.SHIFT_BGR[2]).toBe(1);
            expect(ColorMatrix.SHIFT_BGR[10]).toBe(1);
            expect(ColorMatrix.SHIFT_BGR[12]).toBe(0);
        });
    });
});
