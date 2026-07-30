var Threshold = require('../../src/filters/Threshold');

describe('Threshold', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = {};
    });

    describe('constructor', function ()
    {
        it('should create a Threshold with default edge values', function ()
        {
            var threshold = new Threshold(mockCamera);

            expect(threshold.edge1[0]).toBeCloseTo(0.5);
            expect(threshold.edge1[1]).toBeCloseTo(0.5);
            expect(threshold.edge1[2]).toBeCloseTo(0.5);
            expect(threshold.edge1[3]).toBeCloseTo(0.5);

            expect(threshold.edge2[0]).toBeCloseTo(0.5);
            expect(threshold.edge2[1]).toBeCloseTo(0.5);
            expect(threshold.edge2[2]).toBeCloseTo(0.5);
            expect(threshold.edge2[3]).toBeCloseTo(0.5);
        });

        it('should create a Threshold with default invert values', function ()
        {
            var threshold = new Threshold(mockCamera);

            expect(threshold.invert[0]).toBe(false);
            expect(threshold.invert[1]).toBe(false);
            expect(threshold.invert[2]).toBe(false);
            expect(threshold.invert[3]).toBe(false);
        });

        it('should accept a single number for edge1 and apply to all channels', function ()
        {
            var threshold = new Threshold(mockCamera, 0.2);

            expect(threshold.edge1[0]).toBeCloseTo(0.2);
            expect(threshold.edge1[1]).toBeCloseTo(0.2);
            expect(threshold.edge1[2]).toBeCloseTo(0.2);
            expect(threshold.edge1[3]).toBeCloseTo(0.2);
        });

        it('should accept arrays for edge1 and edge2', function ()
        {
            var threshold = new Threshold(mockCamera, [ 0.1, 0.2, 0.3, 0.4 ], [ 0.5, 0.6, 0.7, 0.8 ]);

            expect(threshold.edge1[0]).toBeCloseTo(0.1);
            expect(threshold.edge1[1]).toBeCloseTo(0.2);
            expect(threshold.edge1[2]).toBeCloseTo(0.3);
            expect(threshold.edge1[3]).toBeCloseTo(0.4);

            expect(threshold.edge2[0]).toBeCloseTo(0.5);
            expect(threshold.edge2[1]).toBeCloseTo(0.6);
            expect(threshold.edge2[2]).toBeCloseTo(0.7);
            expect(threshold.edge2[3]).toBeCloseTo(0.8);
        });

        it('should accept a single boolean for invert and apply to all channels', function ()
        {
            var threshold = new Threshold(mockCamera, 0.5, 0.5, true);

            expect(threshold.invert[0]).toBe(true);
            expect(threshold.invert[1]).toBe(true);
            expect(threshold.invert[2]).toBe(true);
            expect(threshold.invert[3]).toBe(true);
        });

        it('should accept an array for invert', function ()
        {
            var threshold = new Threshold(mockCamera, 0.5, 0.5, [ true, false, true, false ]);

            expect(threshold.invert[0]).toBe(true);
            expect(threshold.invert[1]).toBe(false);
            expect(threshold.invert[2]).toBe(true);
            expect(threshold.invert[3]).toBe(false);
        });

        it('should set the camera reference', function ()
        {
            var threshold = new Threshold(mockCamera);

            expect(threshold.camera).toBe(mockCamera);
        });

        it('should set the renderNode to FilterThreshold', function ()
        {
            var threshold = new Threshold(mockCamera);

            expect(threshold.renderNode).toBe('FilterThreshold');
        });

        it('should be active by default', function ()
        {
            var threshold = new Threshold(mockCamera);

            expect(threshold.active).toBe(true);
        });
    });

    describe('setEdge', function ()
    {
        it('should return the Threshold instance for chaining', function ()
        {
            var threshold = new Threshold(mockCamera);
            var result = threshold.setEdge(0.3, 0.7);

            expect(result).toBe(threshold);
        });

        it('should set both edges from a single number', function ()
        {
            var threshold = new Threshold(mockCamera);
            threshold.setEdge(0.3);

            expect(threshold.edge1[0]).toBeCloseTo(0.3);
            expect(threshold.edge1[1]).toBeCloseTo(0.3);
            expect(threshold.edge1[2]).toBeCloseTo(0.3);
            expect(threshold.edge1[3]).toBeCloseTo(0.3);

            expect(threshold.edge2[0]).toBeCloseTo(0.3);
            expect(threshold.edge2[1]).toBeCloseTo(0.3);
            expect(threshold.edge2[2]).toBeCloseTo(0.3);
            expect(threshold.edge2[3]).toBeCloseTo(0.3);
        });

        it('should use 0.5 as default edge1 when not provided', function ()
        {
            var threshold = new Threshold(mockCamera);
            threshold.setEdge();

            expect(threshold.edge1[0]).toBeCloseTo(0.5);
            expect(threshold.edge1[1]).toBeCloseTo(0.5);
            expect(threshold.edge1[2]).toBeCloseTo(0.5);
            expect(threshold.edge1[3]).toBeCloseTo(0.5);
        });

        it('should set edge2 to same as edge1 when edge2 is not provided', function ()
        {
            var threshold = new Threshold(mockCamera);
            threshold.setEdge(0.25);

            expect(threshold.edge2[0]).toBeCloseTo(0.25);
            expect(threshold.edge2[1]).toBeCloseTo(0.25);
            expect(threshold.edge2[2]).toBeCloseTo(0.25);
            expect(threshold.edge2[3]).toBeCloseTo(0.25);
        });

        it('should accept arrays for both edges', function ()
        {
            var threshold = new Threshold(mockCamera);
            threshold.setEdge([ 0.1, 0.2, 0.3, 0.4 ], [ 0.5, 0.6, 0.7, 0.8 ]);

            expect(threshold.edge1[0]).toBeCloseTo(0.1);
            expect(threshold.edge1[1]).toBeCloseTo(0.2);
            expect(threshold.edge1[2]).toBeCloseTo(0.3);
            expect(threshold.edge1[3]).toBeCloseTo(0.4);

            expect(threshold.edge2[0]).toBeCloseTo(0.5);
            expect(threshold.edge2[1]).toBeCloseTo(0.6);
            expect(threshold.edge2[2]).toBeCloseTo(0.7);
            expect(threshold.edge2[3]).toBeCloseTo(0.8);
        });

        it('should swap channels when edge1 is greater than edge2', function ()
        {
            var threshold = new Threshold(mockCamera);
            threshold.setEdge(0.8, 0.2);

            expect(threshold.edge1[0]).toBeCloseTo(0.2);
            expect(threshold.edge2[0]).toBeCloseTo(0.8);
        });

        it('should swap per-channel when edge1 channel is greater than edge2 channel', function ()
        {
            var threshold = new Threshold(mockCamera);
            threshold.setEdge([ 0.9, 0.1, 0.7, 0.3 ], [ 0.1, 0.9, 0.3, 0.7 ]);

            expect(threshold.edge1[0]).toBeCloseTo(0.1);
            expect(threshold.edge2[0]).toBeCloseTo(0.9);

            expect(threshold.edge1[1]).toBeCloseTo(0.1);
            expect(threshold.edge2[1]).toBeCloseTo(0.9);

            expect(threshold.edge1[2]).toBeCloseTo(0.3);
            expect(threshold.edge2[2]).toBeCloseTo(0.7);

            expect(threshold.edge1[3]).toBeCloseTo(0.3);
            expect(threshold.edge2[3]).toBeCloseTo(0.7);
        });

        it('should not swap channels when edge1 equals edge2', function ()
        {
            var threshold = new Threshold(mockCamera);
            threshold.setEdge(0.5, 0.5);

            expect(threshold.edge1[0]).toBeCloseTo(0.5);
            expect(threshold.edge2[0]).toBeCloseTo(0.5);
        });

        it('should handle edge values of 0 and 1', function ()
        {
            var threshold = new Threshold(mockCamera);
            threshold.setEdge(0, 1);

            expect(threshold.edge1[0]).toBeCloseTo(0);
            expect(threshold.edge2[0]).toBeCloseTo(1);
        });

        it('should handle reversed 0 and 1 and swap them', function ()
        {
            var threshold = new Threshold(mockCamera);
            threshold.setEdge(1, 0);

            expect(threshold.edge1[0]).toBeCloseTo(0);
            expect(threshold.edge2[0]).toBeCloseTo(1);
        });

        it('should accept a number for edge1 and array for edge2', function ()
        {
            var threshold = new Threshold(mockCamera);
            threshold.setEdge(0.2, [ 0.5, 0.6, 0.7, 0.8 ]);

            expect(threshold.edge1[0]).toBeCloseTo(0.2);
            expect(threshold.edge1[1]).toBeCloseTo(0.2);
            expect(threshold.edge1[2]).toBeCloseTo(0.2);
            expect(threshold.edge1[3]).toBeCloseTo(0.2);

            expect(threshold.edge2[0]).toBeCloseTo(0.5);
            expect(threshold.edge2[1]).toBeCloseTo(0.6);
            expect(threshold.edge2[2]).toBeCloseTo(0.7);
            expect(threshold.edge2[3]).toBeCloseTo(0.8);
        });
    });

    describe('setInvert', function ()
    {
        it('should return the Threshold instance for chaining', function ()
        {
            var threshold = new Threshold(mockCamera);
            var result = threshold.setInvert(true);

            expect(result).toBe(threshold);
        });

        it('should default all channels to false when no argument is provided', function ()
        {
            var threshold = new Threshold(mockCamera, 0.5, 0.5, true);
            threshold.setInvert();

            expect(threshold.invert[0]).toBe(false);
            expect(threshold.invert[1]).toBe(false);
            expect(threshold.invert[2]).toBe(false);
            expect(threshold.invert[3]).toBe(false);
        });

        it('should set all channels from a single boolean true', function ()
        {
            var threshold = new Threshold(mockCamera);
            threshold.setInvert(true);

            expect(threshold.invert[0]).toBe(true);
            expect(threshold.invert[1]).toBe(true);
            expect(threshold.invert[2]).toBe(true);
            expect(threshold.invert[3]).toBe(true);
        });

        it('should set all channels from a single boolean false', function ()
        {
            var threshold = new Threshold(mockCamera, 0.5, 0.5, true);
            threshold.setInvert(false);

            expect(threshold.invert[0]).toBe(false);
            expect(threshold.invert[1]).toBe(false);
            expect(threshold.invert[2]).toBe(false);
            expect(threshold.invert[3]).toBe(false);
        });

        it('should set per-channel invert from an array', function ()
        {
            var threshold = new Threshold(mockCamera);
            threshold.setInvert([ true, false, true, false ]);

            expect(threshold.invert[0]).toBe(true);
            expect(threshold.invert[1]).toBe(false);
            expect(threshold.invert[2]).toBe(true);
            expect(threshold.invert[3]).toBe(false);
        });

        it('should overwrite previously set invert values', function ()
        {
            var threshold = new Threshold(mockCamera, 0.5, 0.5, true);

            expect(threshold.invert[0]).toBe(true);

            threshold.setInvert([ false, true, false, true ]);

            expect(threshold.invert[0]).toBe(false);
            expect(threshold.invert[1]).toBe(true);
            expect(threshold.invert[2]).toBe(false);
            expect(threshold.invert[3]).toBe(true);
        });

        it('should support method chaining after setEdge', function ()
        {
            var threshold = new Threshold(mockCamera);
            var result = threshold.setEdge(0.3, 0.7).setInvert(true);

            expect(result).toBe(threshold);
            expect(threshold.invert[0]).toBe(true);
        });
    });
});
