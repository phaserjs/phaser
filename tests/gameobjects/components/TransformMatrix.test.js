var TransformMatrix = require('../../../src/gameobjects/components/TransformMatrix');

describe('TransformMatrix', function ()
{
    describe('constructor', function ()
    {
        it('should create a matrix with default identity values', function ()
        {
            var m = new TransformMatrix();

            expect(m.a).toBe(1);
            expect(m.b).toBe(0);
            expect(m.c).toBe(0);
            expect(m.d).toBe(1);
            expect(m.e).toBe(0);
            expect(m.f).toBe(0);
        });

        it('should create a matrix with given values', function ()
        {
            var m = new TransformMatrix(2, 3, 4, 5, 6, 7);

            expect(m.a).toBe(2);
            expect(m.b).toBe(3);
            expect(m.c).toBe(4);
            expect(m.d).toBe(5);
            expect(m.e).toBe(6);
            expect(m.f).toBe(7);
        });

        it('should expose tx and ty as aliases for e and f', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 10, 20);

            expect(m.tx).toBe(10);
            expect(m.ty).toBe(20);
        });

        it('should initialize decomposedMatrix with default values', function ()
        {
            var m = new TransformMatrix();

            expect(m.decomposedMatrix.translateX).toBe(0);
            expect(m.decomposedMatrix.translateY).toBe(0);
            expect(m.decomposedMatrix.scaleX).toBe(1);
            expect(m.decomposedMatrix.scaleY).toBe(1);
            expect(m.decomposedMatrix.rotation).toBe(0);
        });

        it('should initialize matrix as a Float32Array of length 9', function ()
        {
            var m = new TransformMatrix();

            expect(m.matrix).toBeInstanceOf(Float32Array);
            expect(m.matrix.length).toBe(9);
        });

        it('should initialize quad as a Float32Array of length 8', function ()
        {
            var m = new TransformMatrix();

            expect(m.quad).toBeInstanceOf(Float32Array);
            expect(m.quad.length).toBe(8);
        });
    });

    describe('getters and setters', function ()
    {
        it('should get and set a', function ()
        {
            var m = new TransformMatrix();
            m.a = 5;
            expect(m.a).toBe(5);
            expect(m.matrix[0]).toBe(5);
        });

        it('should get and set b', function ()
        {
            var m = new TransformMatrix();
            m.b = 3;
            expect(m.b).toBe(3);
            expect(m.matrix[1]).toBe(3);
        });

        it('should get and set c', function ()
        {
            var m = new TransformMatrix();
            m.c = 7;
            expect(m.c).toBe(7);
            expect(m.matrix[2]).toBe(7);
        });

        it('should get and set d', function ()
        {
            var m = new TransformMatrix();
            m.d = 9;
            expect(m.d).toBe(9);
            expect(m.matrix[3]).toBe(9);
        });

        it('should get and set e', function ()
        {
            var m = new TransformMatrix();
            m.e = 11;
            expect(m.e).toBe(11);
            expect(m.matrix[4]).toBe(11);
        });

        it('should get and set f', function ()
        {
            var m = new TransformMatrix();
            m.f = 13;
            expect(m.f).toBe(13);
            expect(m.matrix[5]).toBe(13);
        });

        it('should return scaleX as sqrt of a^2 + b^2', function ()
        {
            var m = new TransformMatrix(3, 4, 0, 1, 0, 0);
            expect(m.scaleX).toBeCloseTo(5);
        });

        it('should return scaleY as sqrt of c^2 + d^2', function ()
        {
            var m = new TransformMatrix(1, 0, 3, 4, 0, 0);
            expect(m.scaleY).toBeCloseTo(5);
        });

        it('should return scaleX of 1 for identity matrix', function ()
        {
            var m = new TransformMatrix();
            expect(m.scaleX).toBeCloseTo(1);
        });

        it('should return scaleY of 1 for identity matrix', function ()
        {
            var m = new TransformMatrix();
            expect(m.scaleY).toBeCloseTo(1);
        });

        it('should return rotation of 0 for identity matrix', function ()
        {
            var m = new TransformMatrix();
            expect(m.rotation).toBeCloseTo(0);
        });

        it('should return correct rotationNormalized for identity matrix', function ()
        {
            var m = new TransformMatrix();
            expect(m.rotationNormalized).toBeCloseTo(0);
        });
    });

    describe('loadIdentity', function ()
    {
        it('should reset matrix to identity', function ()
        {
            var m = new TransformMatrix(2, 3, 4, 5, 6, 7);
            m.loadIdentity();

            expect(m.a).toBe(1);
            expect(m.b).toBe(0);
            expect(m.c).toBe(0);
            expect(m.d).toBe(1);
            expect(m.e).toBe(0);
            expect(m.f).toBe(0);
        });

        it('should return this for chaining', function ()
        {
            var m = new TransformMatrix();
            var result = m.loadIdentity();
            expect(result).toBe(m);
        });
    });

    describe('translate', function ()
    {
        it('should translate the matrix by x and y', function ()
        {
            var m = new TransformMatrix();
            m.translate(10, 20);

            expect(m.e).toBe(10);
            expect(m.f).toBe(20);
        });

        it('should accumulate translations', function ()
        {
            var m = new TransformMatrix();
            m.translate(10, 20);
            m.translate(5, 3);

            expect(m.e).toBe(15);
            expect(m.f).toBe(23);
        });

        it('should return this for chaining', function ()
        {
            var m = new TransformMatrix();
            var result = m.translate(1, 2);
            expect(result).toBe(m);
        });

        it('should apply translation through existing transform', function ()
        {
            var m = new TransformMatrix(2, 0, 0, 2, 0, 0);
            m.translate(5, 3);

            expect(m.e).toBe(10);
            expect(m.f).toBe(6);
        });
    });

    describe('scale', function ()
    {
        it('should scale the matrix by x and y', function ()
        {
            var m = new TransformMatrix();
            m.scale(2, 3);

            expect(m.a).toBe(2);
            expect(m.b).toBe(0);
            expect(m.c).toBe(0);
            expect(m.d).toBe(3);
        });

        it('should accumulate scales', function ()
        {
            var m = new TransformMatrix();
            m.scale(2, 3);
            m.scale(4, 5);

            expect(m.a).toBe(8);
            expect(m.d).toBe(15);
        });

        it('should return this for chaining', function ()
        {
            var m = new TransformMatrix();
            var result = m.scale(1, 1);
            expect(result).toBe(m);
        });

        it('should handle negative scale', function ()
        {
            var m = new TransformMatrix();
            m.scale(-1, 1);

            expect(m.a).toBe(-1);
            expect(m.d).toBe(1);
        });
    });

    describe('rotate', function ()
    {
        it('should rotate by PI/2', function ()
        {
            var m = new TransformMatrix();
            m.rotate(Math.PI / 2);

            expect(m.a).toBeCloseTo(0);
            expect(m.b).toBeCloseTo(1);
            expect(m.c).toBeCloseTo(-1);
            expect(m.d).toBeCloseTo(0);
        });

        it('should rotate by PI', function ()
        {
            var m = new TransformMatrix();
            m.rotate(Math.PI);

            expect(m.a).toBeCloseTo(-1);
            expect(m.b).toBeCloseTo(0);
            expect(m.c).toBeCloseTo(0);
            expect(m.d).toBeCloseTo(-1);
        });

        it('should not change translation', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 5, 10);
            m.rotate(Math.PI / 4);

            expect(m.e).toBe(5);
            expect(m.f).toBe(10);
        });

        it('should return this for chaining', function ()
        {
            var m = new TransformMatrix();
            var result = m.rotate(0);
            expect(result).toBe(m);
        });

        it('should have no effect when rotating by 0', function ()
        {
            var m = new TransformMatrix();
            m.rotate(0);

            expect(m.a).toBeCloseTo(1);
            expect(m.b).toBeCloseTo(0);
            expect(m.c).toBeCloseTo(0);
            expect(m.d).toBeCloseTo(1);
        });
    });

    describe('multiply', function ()
    {
        it('should multiply two identity matrices to produce identity', function ()
        {
            var m = new TransformMatrix();
            var rhs = new TransformMatrix();
            m.multiply(rhs);

            expect(m.a).toBeCloseTo(1);
            expect(m.b).toBeCloseTo(0);
            expect(m.c).toBeCloseTo(0);
            expect(m.d).toBeCloseTo(1);
            expect(m.e).toBeCloseTo(0);
            expect(m.f).toBeCloseTo(0);
        });

        it('should multiply and store into out matrix if provided', function ()
        {
            var m = new TransformMatrix(2, 0, 0, 2, 0, 0);
            var rhs = new TransformMatrix(3, 0, 0, 3, 0, 0);
            var out = new TransformMatrix();

            m.multiply(rhs, out);

            expect(out.a).toBeCloseTo(6);
            expect(out.d).toBeCloseTo(6);
            expect(m.a).toBe(2);
        });

        it('should combine translation correctly', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 10, 20);
            var rhs = new TransformMatrix(1, 0, 0, 1, 5, 3);
            m.multiply(rhs);

            expect(m.e).toBeCloseTo(15);
            expect(m.f).toBeCloseTo(23);
        });
    });

    describe('multiplyWithOffset', function ()
    {
        it('should multiply and apply offset to translation', function ()
        {
            var m = new TransformMatrix();
            var src = new TransformMatrix(2, 0, 0, 2, 0, 0);
            m.multiplyWithOffset(src, 5, 10);

            expect(m.e).toBeCloseTo(5);
            expect(m.f).toBeCloseTo(10);
        });

        it('should return this for chaining', function ()
        {
            var m = new TransformMatrix();
            var src = new TransformMatrix();
            var result = m.multiplyWithOffset(src, 0, 0);
            expect(result).toBe(m);
        });

        it('should combine scale from src matrix', function ()
        {
            var m = new TransformMatrix();
            var src = new TransformMatrix(3, 0, 0, 3, 0, 0);
            m.multiplyWithOffset(src, 0, 0);

            expect(m.a).toBeCloseTo(3);
            expect(m.d).toBeCloseTo(3);
        });
    });

    describe('transform', function ()
    {
        it('should apply transform to identity matrix', function ()
        {
            var m = new TransformMatrix();
            m.transform(2, 0, 0, 3, 10, 20);

            expect(m.a).toBeCloseTo(2);
            expect(m.d).toBeCloseTo(3);
            expect(m.e).toBeCloseTo(10);
            expect(m.f).toBeCloseTo(20);
        });

        it('should return this for chaining', function ()
        {
            var m = new TransformMatrix();
            var result = m.transform(1, 0, 0, 1, 0, 0);
            expect(result).toBe(m);
        });

        it('should accumulate transforms', function ()
        {
            var m = new TransformMatrix();
            m.transform(2, 0, 0, 2, 0, 0);
            m.transform(3, 0, 0, 3, 0, 0);

            expect(m.a).toBeCloseTo(6);
            expect(m.d).toBeCloseTo(6);
        });
    });

    describe('transformPoint', function ()
    {
        it('should transform a point with identity matrix', function ()
        {
            var m = new TransformMatrix();
            var result = m.transformPoint(5, 10);

            expect(result.x).toBeCloseTo(5);
            expect(result.y).toBeCloseTo(10);
        });

        it('should transform a point with translation', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 100, 200);
            var result = m.transformPoint(5, 10);

            expect(result.x).toBeCloseTo(105);
            expect(result.y).toBeCloseTo(210);
        });

        it('should transform a point with scale', function ()
        {
            var m = new TransformMatrix(2, 0, 0, 3, 0, 0);
            var result = m.transformPoint(5, 10);

            expect(result.x).toBeCloseTo(10);
            expect(result.y).toBeCloseTo(30);
        });

        it('should use provided point object', function ()
        {
            var m = new TransformMatrix();
            var pt = { x: 0, y: 0 };
            var result = m.transformPoint(3, 4, pt);

            expect(result).toBe(pt);
            expect(pt.x).toBeCloseTo(3);
            expect(pt.y).toBeCloseTo(4);
        });

        it('should create a new point if none is provided', function ()
        {
            var m = new TransformMatrix();
            var result = m.transformPoint(1, 2);

            expect(result).toBeDefined();
            expect(result.x).toBeCloseTo(1);
            expect(result.y).toBeCloseTo(2);
        });
    });

    describe('invert', function ()
    {
        it('should invert the identity matrix to itself', function ()
        {
            var m = new TransformMatrix();
            m.invert();

            expect(m.a).toBeCloseTo(1);
            expect(m.b).toBeCloseTo(0);
            expect(m.c).toBeCloseTo(0);
            expect(m.d).toBeCloseTo(1);
            expect(m.e).toBeCloseTo(0);
            expect(m.f).toBeCloseTo(0);
        });

        it('should invert a scale matrix', function ()
        {
            var m = new TransformMatrix(2, 0, 0, 4, 0, 0);
            m.invert();

            expect(m.a).toBeCloseTo(0.5);
            expect(m.d).toBeCloseTo(0.25);
        });

        it('should invert a translation matrix', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 10, 20);
            m.invert();

            expect(m.e).toBeCloseTo(-10);
            expect(m.f).toBeCloseTo(-20);
        });

        it('should return this for chaining', function ()
        {
            var m = new TransformMatrix();
            var result = m.invert();
            expect(result).toBe(m);
        });
    });

    describe('copyFrom', function ()
    {
        it('should copy values from another matrix', function ()
        {
            var src = new TransformMatrix(2, 3, 4, 5, 6, 7);
            var m = new TransformMatrix();
            m.copyFrom(src);

            expect(m.a).toBe(2);
            expect(m.b).toBe(3);
            expect(m.c).toBe(4);
            expect(m.d).toBe(5);
            expect(m.e).toBe(6);
            expect(m.f).toBe(7);
        });

        it('should return this for chaining', function ()
        {
            var src = new TransformMatrix();
            var m = new TransformMatrix();
            var result = m.copyFrom(src);
            expect(result).toBe(m);
        });

        it('should not mutate the source matrix', function ()
        {
            var src = new TransformMatrix(2, 3, 4, 5, 6, 7);
            var m = new TransformMatrix();
            m.copyFrom(src);
            m.a = 99;

            expect(src.a).toBe(2);
        });
    });

    describe('copyFromArray', function ()
    {
        it('should copy values from an array', function ()
        {
            var m = new TransformMatrix();
            m.copyFromArray([ 2, 3, 4, 5, 6, 7 ]);

            expect(m.a).toBe(2);
            expect(m.b).toBe(3);
            expect(m.c).toBe(4);
            expect(m.d).toBe(5);
            expect(m.e).toBe(6);
            expect(m.f).toBe(7);
        });

        it('should return this for chaining', function ()
        {
            var m = new TransformMatrix();
            var result = m.copyFromArray([ 1, 0, 0, 1, 0, 0 ]);
            expect(result).toBe(m);
        });
    });

    describe('copyWithScrollFactorFrom', function ()
    {
        it('should copy a, b, c, d directly from source', function ()
        {
            var src = new TransformMatrix(2, 3, 4, 5, 10, 20);
            var m = new TransformMatrix();
            m.copyWithScrollFactorFrom(src, 0, 0, 1, 1);

            expect(m.a).toBe(2);
            expect(m.b).toBe(3);
            expect(m.c).toBe(4);
            expect(m.d).toBe(5);
        });

        it('should apply scroll factor of 1 (no scroll contribution)', function ()
        {
            var src = new TransformMatrix(1, 0, 0, 1, 10, 20);
            var m = new TransformMatrix();
            m.copyWithScrollFactorFrom(src, 100, 200, 1, 1);

            expect(m.e).toBeCloseTo(10);
            expect(m.f).toBeCloseTo(20);
        });

        it('should apply scroll factor of 0 (full scroll contribution)', function ()
        {
            var src = new TransformMatrix(1, 0, 0, 1, 0, 0);
            var m = new TransformMatrix();
            m.copyWithScrollFactorFrom(src, 100, 200, 0, 0);

            expect(m.e).toBeCloseTo(100);
            expect(m.f).toBeCloseTo(200);
        });

        it('should apply partial scroll factor', function ()
        {
            var src = new TransformMatrix(1, 0, 0, 1, 0, 0);
            var m = new TransformMatrix();
            m.copyWithScrollFactorFrom(src, 100, 200, 0.5, 0.5);

            expect(m.e).toBeCloseTo(50);
            expect(m.f).toBeCloseTo(100);
        });

        it('should return this for chaining', function ()
        {
            var src = new TransformMatrix();
            var m = new TransformMatrix();
            var result = m.copyWithScrollFactorFrom(src, 0, 0, 1, 1);
            expect(result).toBe(m);
        });
    });

    describe('copyToContext', function ()
    {
        it('should call ctx.transform with the matrix values', function ()
        {
            var m = new TransformMatrix(2, 3, 4, 5, 6, 7);
            var ctx = { transform: vi.fn(), setTransform: vi.fn() };
            var result = m.copyToContext(ctx);

            expect(ctx.transform).toHaveBeenCalledWith(2, 3, 4, 5, 6, 7);
            expect(result).toBe(ctx);
        });
    });

    describe('setToContext', function ()
    {
        it('should call ctx.setTransform with the matrix values', function ()
        {
            var m = new TransformMatrix(2, 3, 4, 5, 6, 7);
            var ctx = { transform: vi.fn(), setTransform: vi.fn() };
            var result = m.setToContext(ctx);

            expect(ctx.setTransform).toHaveBeenCalledWith(2, 3, 4, 5, 6, 7);
            expect(result).toBe(ctx);
        });
    });

    describe('copyToArray', function ()
    {
        it('should create and return a new array if none provided', function ()
        {
            var m = new TransformMatrix(2, 3, 4, 5, 6, 7);
            var result = m.copyToArray();

            expect(result[0]).toBe(2);
            expect(result[1]).toBe(3);
            expect(result[2]).toBe(4);
            expect(result[3]).toBe(5);
            expect(result[4]).toBe(6);
            expect(result[5]).toBe(7);
        });

        it('should fill provided array with matrix values', function ()
        {
            var m = new TransformMatrix(2, 3, 4, 5, 6, 7);
            var arr = new Array(6);
            var result = m.copyToArray(arr);

            expect(result).toBe(arr);
            expect(arr[0]).toBe(2);
            expect(arr[5]).toBe(7);
        });
    });

    describe('setTransform', function ()
    {
        it('should set all matrix values', function ()
        {
            var m = new TransformMatrix();
            m.setTransform(2, 3, 4, 5, 6, 7);

            expect(m.a).toBe(2);
            expect(m.b).toBe(3);
            expect(m.c).toBe(4);
            expect(m.d).toBe(5);
            expect(m.e).toBe(6);
            expect(m.f).toBe(7);
        });

        it('should return this for chaining', function ()
        {
            var m = new TransformMatrix();
            var result = m.setTransform(1, 0, 0, 1, 0, 0);
            expect(result).toBe(m);
        });
    });

    describe('decomposeMatrix', function ()
    {
        it('should decompose identity matrix correctly', function ()
        {
            var m = new TransformMatrix();
            var result = m.decomposeMatrix();

            expect(result.translateX).toBeCloseTo(0);
            expect(result.translateY).toBeCloseTo(0);
            expect(result.scaleX).toBeCloseTo(1);
            expect(result.scaleY).toBeCloseTo(1);
            expect(result.rotation).toBeCloseTo(0);
        });

        it('should decompose translation correctly', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 50, 75);
            var result = m.decomposeMatrix();

            expect(result.translateX).toBe(50);
            expect(result.translateY).toBe(75);
        });

        it('should decompose scale correctly', function ()
        {
            var m = new TransformMatrix(3, 0, 0, 2, 0, 0);
            var result = m.decomposeMatrix();

            expect(result.scaleX).toBeCloseTo(3);
            expect(result.scaleY).toBeCloseTo(2);
            expect(result.rotation).toBeCloseTo(0);
        });

        it('should decompose rotation correctly', function ()
        {
            var angle = Math.PI / 4;
            var m = new TransformMatrix();
            m.rotate(angle);
            var result = m.decomposeMatrix();

            expect(result.rotation).toBeCloseTo(angle);
        });

        it('should return the decomposedMatrix object', function ()
        {
            var m = new TransformMatrix();
            var result = m.decomposeMatrix();
            expect(result).toBe(m.decomposedMatrix);
        });

        it('should handle zero matrix gracefully', function ()
        {
            var m = new TransformMatrix(0, 0, 0, 0, 0, 0);
            var result = m.decomposeMatrix();

            expect(result.rotation).toBe(0);
            expect(result.scaleX).toBe(0);
            expect(result.scaleY).toBe(0);
        });
    });

    describe('applyITRS', function ()
    {
        it('should set translation', function ()
        {
            var m = new TransformMatrix();
            m.applyITRS(100, 200, 0, 1, 1);

            expect(m.e).toBe(100);
            expect(m.f).toBe(200);
        });

        it('should set scale', function ()
        {
            var m = new TransformMatrix();
            m.applyITRS(0, 0, 0, 3, 5);

            expect(m.a).toBeCloseTo(3);
            expect(m.d).toBeCloseTo(5);
        });

        it('should set rotation', function ()
        {
            var m = new TransformMatrix();
            m.applyITRS(0, 0, Math.PI / 2, 1, 1);

            expect(m.a).toBeCloseTo(0);
            expect(m.b).toBeCloseTo(1);
            expect(m.c).toBeCloseTo(-1);
            expect(m.d).toBeCloseTo(0);
        });

        it('should return this for chaining', function ()
        {
            var m = new TransformMatrix();
            var result = m.applyITRS(0, 0, 0, 1, 1);
            expect(result).toBe(m);
        });

        it('should combine translation, rotation, and scale', function ()
        {
            var m = new TransformMatrix();
            m.applyITRS(10, 20, 0, 2, 3);

            expect(m.e).toBe(10);
            expect(m.f).toBe(20);
            expect(m.a).toBeCloseTo(2);
            expect(m.d).toBeCloseTo(3);
        });
    });

    describe('applyInverse', function ()
    {
        it('should invert a translation', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 100, 200);
            var result = m.applyInverse(150, 250);

            expect(result.x).toBeCloseTo(50);
            expect(result.y).toBeCloseTo(50);
        });

        it('should invert identity transform', function ()
        {
            var m = new TransformMatrix();
            var result = m.applyInverse(5, 10);

            expect(result.x).toBeCloseTo(5);
            expect(result.y).toBeCloseTo(10);
        });

        it('should use provided output vector', function ()
        {
            var m = new TransformMatrix();
            var out = { x: 0, y: 0 };
            var result = m.applyInverse(3, 4, out);

            expect(result).toBe(out);
        });

        it('should invert a scale transform', function ()
        {
            var m = new TransformMatrix(2, 0, 0, 2, 0, 0);
            var result = m.applyInverse(10, 20);

            expect(result.x).toBeCloseTo(5);
            expect(result.y).toBeCloseTo(10);
        });
    });

    describe('setQuad', function ()
    {
        it('should compute the four quad vertices for an identity matrix', function ()
        {
            var m = new TransformMatrix();
            var q = m.setQuad(0, 0, 100, 50);

            // top-left
            expect(q[0]).toBeCloseTo(0);
            expect(q[1]).toBeCloseTo(0);
            // bottom-left
            expect(q[2]).toBeCloseTo(0);
            expect(q[3]).toBeCloseTo(50);
            // bottom-right
            expect(q[4]).toBeCloseTo(100);
            expect(q[5]).toBeCloseTo(50);
            // top-right
            expect(q[6]).toBeCloseTo(100);
            expect(q[7]).toBeCloseTo(0);
        });

        it('should apply translation', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 10, 20);
            var q = m.setQuad(0, 0, 100, 50);

            expect(q[0]).toBeCloseTo(10);
            expect(q[1]).toBeCloseTo(20);
        });

        it('should store result in this.quad by default', function ()
        {
            var m = new TransformMatrix();
            var q = m.setQuad(0, 0, 10, 10);
            expect(q).toBe(m.quad);
        });

        it('should store result in provided Float32Array', function ()
        {
            var m = new TransformMatrix();
            var external = new Float32Array(8);
            var q = m.setQuad(0, 0, 10, 10, external);
            expect(q).toBe(external);
        });

        it('should apply scale', function ()
        {
            var m = new TransformMatrix(2, 0, 0, 3, 0, 0);
            var q = m.setQuad(0, 0, 10, 10);

            expect(q[4]).toBeCloseTo(20);
            expect(q[5]).toBeCloseTo(30);
        });
    });

    describe('getX', function ()
    {
        it('should return x * a + y * c + e', function ()
        {
            var m = new TransformMatrix(2, 0, 3, 0, 10, 0);
            expect(m.getX(5, 4)).toBeCloseTo(5 * 2 + 4 * 3 + 10);
        });

        it('should return e for zero input with identity', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 5, 10);
            expect(m.getX(0, 0)).toBeCloseTo(5);
        });
    });

    describe('getY', function ()
    {
        it('should return x * b + y * d + f', function ()
        {
            var m = new TransformMatrix(0, 2, 0, 3, 0, 10);
            expect(m.getY(5, 4)).toBeCloseTo(5 * 2 + 4 * 3 + 10);
        });

        it('should return f for zero input with identity', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 5, 10);
            expect(m.getY(0, 0)).toBeCloseTo(10);
        });
    });

    describe('getXRound', function ()
    {
        it('should return the same as getX when round is false', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 0, 0);
            expect(m.getXRound(1.5, 2.3, false)).toBeCloseTo(1.5);
        });

        it('should round the result when round is true', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 0, 0);
            expect(m.getXRound(1.4, 0, true)).toBe(1);
            expect(m.getXRound(1.5, 0, true)).toBe(2);
        });

        it('should not round when round is omitted', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 0, 0);
            expect(m.getXRound(1.7, 0)).toBeCloseTo(1.7);
        });
    });

    describe('getYRound', function ()
    {
        it('should return the same as getY when round is false', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 0, 0);
            expect(m.getYRound(0, 2.7, false)).toBeCloseTo(2.7);
        });

        it('should round the result when round is true', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 0, 0);
            expect(m.getYRound(0, 2.4, true)).toBe(2);
            expect(m.getYRound(0, 2.5, true)).toBe(3);
        });

        it('should not round when round is omitted', function ()
        {
            var m = new TransformMatrix(1, 0, 0, 1, 0, 0);
            expect(m.getYRound(0, 2.3)).toBeCloseTo(2.3);
        });
    });

    describe('getCSSMatrix', function ()
    {
        it('should return a CSS matrix string for identity', function ()
        {
            var m = new TransformMatrix();
            expect(m.getCSSMatrix()).toBe('matrix(1,0,0,1,0,0)');
        });

        it('should return the correct CSS matrix string for custom values', function ()
        {
            var m = new TransformMatrix(2, 3, 4, 5, 6, 7);
            expect(m.getCSSMatrix()).toBe('matrix(2,3,4,5,6,7)');
        });
    });

    describe('destroy', function ()
    {
        it('should null out matrix, quad, and decomposedMatrix', function ()
        {
            var m = new TransformMatrix();
            m.destroy();

            expect(m.matrix).toBeNull();
            expect(m.quad).toBeNull();
            expect(m.decomposedMatrix).toBeNull();
        });
    });
});
