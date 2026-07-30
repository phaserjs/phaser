var FilterBlocky = require('../../../../../src/renderer/webgl/renderNodes/filters/FilterBlocky');

describe('FilterBlocky', function ()
{
    var mockThis;
    var uniforms;

    beforeEach(function ()
    {
        uniforms = {};
        mockThis = {
            programManager: {
                setUniform: function (name, value)
                {
                    uniforms[name] = value;
                }
            }
        };
    });

    describe('setupUniforms', function ()
    {
        it('should set the resolution uniform from drawingContext dimensions', function ()
        {
            var controller = {
                size: { x: 4, y: 4 },
                offset: { x: 0, y: 0 }
            };
            var drawingContext = { width: 800, height: 600 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['resolution']).toEqual([ 800, 600 ]);
        });

        it('should set the uSizeAndOffset uniform with block size and offset', function ()
        {
            var controller = {
                size: { x: 8, y: 16 },
                offset: { x: 2, y: 3 }
            };
            var drawingContext = { width: 1024, height: 768 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uSizeAndOffset']).toEqual([ 8, 16, 2, 3 ]);
        });

        it('should clamp sizeX to a minimum of 1 when controller.size.x is zero', function ()
        {
            var controller = {
                size: { x: 0, y: 4 },
                offset: { x: 0, y: 0 }
            };
            var drawingContext = { width: 320, height: 240 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uSizeAndOffset'][0]).toBe(1);
        });

        it('should clamp sizeY to a minimum of 1 when controller.size.y is zero', function ()
        {
            var controller = {
                size: { x: 4, y: 0 },
                offset: { x: 0, y: 0 }
            };
            var drawingContext = { width: 320, height: 240 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uSizeAndOffset'][1]).toBe(1);
        });

        it('should clamp sizeX to a minimum of 1 when controller.size.x is negative', function ()
        {
            var controller = {
                size: { x: -10, y: 4 },
                offset: { x: 0, y: 0 }
            };
            var drawingContext = { width: 320, height: 240 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uSizeAndOffset'][0]).toBe(1);
        });

        it('should clamp sizeY to a minimum of 1 when controller.size.y is negative', function ()
        {
            var controller = {
                size: { x: 4, y: -5 },
                offset: { x: 0, y: 0 }
            };
            var drawingContext = { width: 320, height: 240 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uSizeAndOffset'][1]).toBe(1);
        });

        it('should not clamp sizeX when it is exactly 1', function ()
        {
            var controller = {
                size: { x: 1, y: 1 },
                offset: { x: 0, y: 0 }
            };
            var drawingContext = { width: 100, height: 100 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uSizeAndOffset'][0]).toBe(1);
            expect(uniforms['uSizeAndOffset'][1]).toBe(1);
        });

        it('should pass negative offsets unchanged', function ()
        {
            var controller = {
                size: { x: 4, y: 4 },
                offset: { x: -5, y: -10 }
            };
            var drawingContext = { width: 640, height: 480 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uSizeAndOffset'][2]).toBe(-5);
            expect(uniforms['uSizeAndOffset'][3]).toBe(-10);
        });

        it('should pass fractional block sizes unchanged when above 1', function ()
        {
            var controller = {
                size: { x: 2.5, y: 3.7 },
                offset: { x: 0, y: 0 }
            };
            var drawingContext = { width: 800, height: 600 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uSizeAndOffset'][0]).toBeCloseTo(2.5);
            expect(uniforms['uSizeAndOffset'][1]).toBeCloseTo(3.7);
        });

        it('should pass fractional offsets unchanged', function ()
        {
            var controller = {
                size: { x: 4, y: 4 },
                offset: { x: 0.5, y: 1.25 }
            };
            var drawingContext = { width: 800, height: 600 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(uniforms['uSizeAndOffset'][2]).toBeCloseTo(0.5);
            expect(uniforms['uSizeAndOffset'][3]).toBeCloseTo(1.25);
        });

        it('should call setUniform exactly twice', function ()
        {
            var callCount = 0;
            mockThis.programManager.setUniform = function (name, value)
            {
                callCount++;
                uniforms[name] = value;
            };

            var controller = {
                size: { x: 4, y: 4 },
                offset: { x: 0, y: 0 }
            };
            var drawingContext = { width: 100, height: 100 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(callCount).toBe(2);
        });

        it('should set resolution as an array of two numbers', function ()
        {
            var controller = {
                size: { x: 4, y: 4 },
                offset: { x: 0, y: 0 }
            };
            var drawingContext = { width: 512, height: 256 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(Array.isArray(uniforms['resolution'])).toBe(true);
            expect(uniforms['resolution'].length).toBe(2);
        });

        it('should set uSizeAndOffset as an array of four numbers', function ()
        {
            var controller = {
                size: { x: 4, y: 4 },
                offset: { x: 1, y: 2 }
            };
            var drawingContext = { width: 512, height: 256 };

            FilterBlocky.prototype.setupUniforms.call(mockThis, controller, drawingContext);

            expect(Array.isArray(uniforms['uSizeAndOffset'])).toBe(true);
            expect(uniforms['uSizeAndOffset'].length).toBe(4);
        });
    });
});
