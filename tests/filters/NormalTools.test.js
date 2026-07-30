var NormalTools = require('../../src/filters/NormalTools');

describe('NormalTools', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = {};
    });

    describe('constructor', function ()
    {
        it('should create an instance with default values when no config is provided', function ()
        {
            var filter = new NormalTools(mockCamera);

            expect(filter.active).toBe(true);
            expect(filter.camera).toBe(mockCamera);
            expect(filter.renderNode).toBe('FilterNormalTools');
            expect(filter.facingPower).toBe(1);
            expect(filter.outputRatio).toBe(false);
            expect(filter.ratioRadius).toBe(1);
            expect(filter.rotationSource).toBeNull();
        });

        it('should create an instance with default values when empty config is provided', function ()
        {
            var filter = new NormalTools(mockCamera, {});

            expect(filter.facingPower).toBe(1);
            expect(filter.outputRatio).toBe(false);
            expect(filter.ratioRadius).toBe(1);
            expect(filter.rotationSource).toBeNull();
        });

        it('should set _rotation to 0 by default', function ()
        {
            var filter = new NormalTools(mockCamera);

            expect(filter._rotation).toBe(0);
        });

        it('should create a viewMatrix property', function ()
        {
            var filter = new NormalTools(mockCamera);

            expect(filter.viewMatrix).toBeDefined();
            expect(typeof filter.viewMatrix).toBe('object');
        });

        it('should create a ratioVector defaulting to (0, 0, 1)', function ()
        {
            var filter = new NormalTools(mockCamera);

            expect(filter.ratioVector.x).toBe(0);
            expect(filter.ratioVector.y).toBe(0);
            expect(filter.ratioVector.z).toBe(1);
        });

        it('should apply config.rotation', function ()
        {
            var filter = new NormalTools(mockCamera, { rotation: 1.5 });

            expect(filter._rotation).toBe(1.5);
        });

        it('should apply config.facingPower', function ()
        {
            var filter = new NormalTools(mockCamera, { facingPower: 3 });

            expect(filter.facingPower).toBe(3);
        });

        it('should apply config.outputRatio', function ()
        {
            var filter = new NormalTools(mockCamera, { outputRatio: true });

            expect(filter.outputRatio).toBe(true);
        });

        it('should apply config.ratioRadius', function ()
        {
            var filter = new NormalTools(mockCamera, { ratioRadius: 0.5 });

            expect(filter.ratioRadius).toBe(0.5);
        });

        it('should apply config.ratioVector', function ()
        {
            var filter = new NormalTools(mockCamera, { ratioVector: [ 1, 0.5, 0 ] });

            expect(filter.ratioVector.x).toBe(1);
            expect(filter.ratioVector.y).toBe(0.5);
            expect(filter.ratioVector.z).toBe(0);
        });

        it('should apply config.rotationSource as a function', function ()
        {
            var src = function () { return 0.7; };
            var filter = new NormalTools(mockCamera, { rotationSource: src });

            expect(filter.rotationSource).toBe(src);
        });

        it('should apply config.rotationSource as an object', function ()
        {
            var src = { hasTransformComponent: true };
            var filter = new NormalTools(mockCamera, { rotationSource: src });

            expect(filter.rotationSource).toBe(src);
        });
    });

    describe('getRotation', function ()
    {
        it('should return _rotation when no rotationSource is set', function ()
        {
            var filter = new NormalTools(mockCamera, { rotation: 1.2 });

            expect(filter.getRotation()).toBe(1.2);
        });

        it('should return 0 when rotation was not configured', function ()
        {
            var filter = new NormalTools(mockCamera);

            expect(filter.getRotation()).toBe(0);
        });

        it('should call a function rotationSource and return its result', function ()
        {
            var filter = new NormalTools(mockCamera, {
                rotationSource: function () { return 2.5; }
            });

            expect(filter.getRotation()).toBe(2.5);
        });

        it('should call function rotationSource each time', function ()
        {
            var callCount = 0;
            var filter = new NormalTools(mockCamera, {
                rotationSource: function () { callCount++; return 0.1; }
            });

            filter.getRotation();
            filter.getRotation();

            expect(callCount).toBe(2);
        });

        it('should read rotationNormalized from a GameObject rotationSource with hasTransformComponent', function ()
        {
            var mockMatrix = { rotationNormalized: 3.14 };
            var mockGameObject = {
                hasTransformComponent: true,
                getWorldTransformMatrix: function () { return mockMatrix; }
            };
            var filter = new NormalTools(mockCamera, { rotationSource: mockGameObject });

            expect(filter.getRotation()).toBeCloseTo(3.14);
        });

        it('should return _rotation when rotationSource is an object without hasTransformComponent', function ()
        {
            var filter = new NormalTools(mockCamera, { rotation: 0.9 });
            filter.rotationSource = { hasTransformComponent: false };

            expect(filter.getRotation()).toBe(0.9);
        });
    });

    describe('setRotation', function ()
    {
        it('should set _rotation to the given value', function ()
        {
            var filter = new NormalTools(mockCamera);
            filter.setRotation(1.0);

            expect(filter._rotation).toBe(1.0);
        });

        it('should return the NormalTools instance for chaining', function ()
        {
            var filter = new NormalTools(mockCamera);
            var result = filter.setRotation(0.5);

            expect(result).toBe(filter);
        });

        it('should update the viewMatrix', function ()
        {
            var filter = new NormalTools(mockCamera);
            var matrixBefore = filter.viewMatrix.val.slice();

            filter.setRotation(Math.PI / 2);

            var matrixAfter = filter.viewMatrix.val;
            var changed = false;

            for (var i = 0; i < matrixBefore.length; i++)
            {
                if (Math.abs(matrixBefore[i] - matrixAfter[i]) > 0.0001)
                {
                    changed = true;
                    break;
                }
            }

            expect(changed).toBe(true);
        });

        it('should produce a near-identity viewMatrix when rotation is 0', function ()
        {
            var filter = new NormalTools(mockCamera);
            filter.setRotation(0);

            var val = filter.viewMatrix.val;

            // Column-major: [0]=m00, [5]=m11, [10]=m22, [15]=m33 are the diagonal
            expect(val[0]).toBeCloseTo(1);
            expect(val[5]).toBeCloseTo(1);
            expect(val[10]).toBeCloseTo(1);
            expect(val[15]).toBeCloseTo(1);
        });

        it('should encode a 90-degree rotation around Z in the viewMatrix', function ()
        {
            var filter = new NormalTools(mockCamera);
            filter.setRotation(Math.PI / 2);

            var val = filter.viewMatrix.val;

            // rotateZ(PI/2): cos=0, sin=1
            // Column 0: (cos, sin, 0, 0) = (0, 1, 0, 0)
            // Column 1: (-sin, cos, 0, 0) = (-1, 0, 0, 0)
            expect(val[0]).toBeCloseTo(0);
            expect(val[1]).toBeCloseTo(1);
            expect(val[4]).toBeCloseTo(-1);
            expect(val[5]).toBeCloseTo(0);
        });

        it('should work with negative rotation values', function ()
        {
            var filter = new NormalTools(mockCamera);
            filter.setRotation(-Math.PI / 4);

            expect(filter._rotation).toBe(-Math.PI / 4);
        });

        it('should work with large rotation values', function ()
        {
            var filter = new NormalTools(mockCamera);
            filter.setRotation(10 * Math.PI);

            expect(filter._rotation).toBe(10 * Math.PI);
        });

        it('should allow overwriting a previous rotation', function ()
        {
            var filter = new NormalTools(mockCamera, { rotation: 1.0 });
            filter.setRotation(2.0);

            expect(filter._rotation).toBe(2.0);
            expect(filter.getRotation()).toBe(2.0);
        });
    });

    describe('updateRotation', function ()
    {
        it('should return the NormalTools instance for chaining', function ()
        {
            var filter = new NormalTools(mockCamera);
            var result = filter.updateRotation();

            expect(result).toBe(filter);
        });

        it('should do nothing when rotationSource is null', function ()
        {
            var filter = new NormalTools(mockCamera, { rotation: 1.5 });
            filter.updateRotation();

            expect(filter._rotation).toBe(1.5);
        });

        it('should update _rotation from a function rotationSource', function ()
        {
            var filter = new NormalTools(mockCamera, {
                rotation: 0,
                rotationSource: function () { return 2.0; }
            });

            filter.updateRotation();

            expect(filter._rotation).toBe(2.0);
        });

        it('should update viewMatrix from a function rotationSource', function ()
        {
            var filter = new NormalTools(mockCamera, {
                rotation: 0,
                rotationSource: function () { return Math.PI / 2; }
            });

            filter.updateRotation();

            var val = filter.viewMatrix.val;

            expect(val[0]).toBeCloseTo(0);
            expect(val[1]).toBeCloseTo(1);
        });

        it('should update _rotation from a GameObject rotationSource', function ()
        {
            var mockMatrix = { rotationNormalized: 1.1 };
            var mockGameObject = {
                hasTransformComponent: true,
                getWorldTransformMatrix: function () { return mockMatrix; }
            };
            var filter = new NormalTools(mockCamera, { rotation: 0, rotationSource: mockGameObject });

            filter.updateRotation();

            expect(filter._rotation).toBeCloseTo(1.1);
        });

        it('should not modify _rotation when rotationSource lacks hasTransformComponent', function ()
        {
            var filter = new NormalTools(mockCamera, { rotation: 0.3 });
            filter.rotationSource = { hasTransformComponent: false };

            filter.updateRotation();

            // getRotation() falls back to _rotation (0.3), so updateRotation sets _rotation = 0.3
            expect(filter._rotation).toBe(0.3);
        });

        it('should call rotationSource function each time updateRotation is called', function ()
        {
            var callCount = 0;
            var filter = new NormalTools(mockCamera, {
                rotationSource: function () { callCount++; return 0; }
            });

            filter.updateRotation();
            filter.updateRotation();
            filter.updateRotation();

            expect(callCount).toBe(3);
        });
    });
});
