var AnimationFrame = require('../../src/animations/AnimationFrame');

describe('AnimationFrame', function ()
{
    var mockFrame;

    beforeEach(function ()
    {
        mockFrame = { name: 'frame0', width: 32, height: 32 };
    });

    describe('constructor', function ()
    {
        it('should create an AnimationFrame with the given values', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);

            expect(af.textureKey).toBe('atlas');
            expect(af.textureFrame).toBe('frame0');
            expect(af.index).toBe(0);
            expect(af.frame).toBe(mockFrame);
        });

        it('should default isKeyFrame to false when not provided', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);

            expect(af.isKeyFrame).toBe(false);
        });

        it('should set isKeyFrame to true when provided', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame, true);

            expect(af.isKeyFrame).toBe(true);
        });

        it('should default isFirst to false', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);

            expect(af.isFirst).toBe(false);
        });

        it('should default isLast to false', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);

            expect(af.isLast).toBe(false);
        });

        it('should default prevFrame to null', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);

            expect(af.prevFrame).toBeNull();
        });

        it('should default nextFrame to null', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);

            expect(af.nextFrame).toBeNull();
        });

        it('should default duration to 0', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);

            expect(af.duration).toBe(0);
        });

        it('should default progress to 0', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);

            expect(af.progress).toBe(0);
        });

        it('should accept a numeric textureFrame key', function ()
        {
            var af = new AnimationFrame('atlas', 3, 2, mockFrame);

            expect(af.textureFrame).toBe(3);
        });

        it('should accept a higher index value', function ()
        {
            var af = new AnimationFrame('atlas', 'frame5', 5, mockFrame);

            expect(af.index).toBe(5);
        });
    });

    describe('toJSON', function ()
    {
        it('should return an object with the correct keys', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);
            var json = af.toJSON();

            expect(json).toHaveProperty('key');
            expect(json).toHaveProperty('frame');
            expect(json).toHaveProperty('duration');
            expect(json).toHaveProperty('keyframe');
        });

        it('should return the textureKey as key', function ()
        {
            var af = new AnimationFrame('myAtlas', 'frame0', 0, mockFrame);
            var json = af.toJSON();

            expect(json.key).toBe('myAtlas');
        });

        it('should return the textureFrame as frame', function ()
        {
            var af = new AnimationFrame('atlas', 'sprite_01', 0, mockFrame);
            var json = af.toJSON();

            expect(json.frame).toBe('sprite_01');
        });

        it('should return the duration', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);
            af.duration = 200;
            var json = af.toJSON();

            expect(json.duration).toBe(200);
        });

        it('should return the default duration of 0', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);
            var json = af.toJSON();

            expect(json.duration).toBe(0);
        });

        it('should return isKeyFrame as keyframe', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame, true);
            var json = af.toJSON();

            expect(json.keyframe).toBe(true);
        });

        it('should return false for keyframe when isKeyFrame is false', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame, false);
            var json = af.toJSON();

            expect(json.keyframe).toBe(false);
        });

        it('should return a numeric textureFrame correctly', function ()
        {
            var af = new AnimationFrame('atlas', 7, 0, mockFrame);
            var json = af.toJSON();

            expect(json.frame).toBe(7);
        });

        it('should reflect updated duration after mutation', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);
            af.duration = 500;
            var json = af.toJSON();

            expect(json.duration).toBe(500);
        });
    });

    describe('destroy', function ()
    {
        it('should set frame to undefined', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);
            af.destroy();

            expect(af.frame).toBeUndefined();
        });

        it('should not affect other properties when destroyed', function ()
        {
            var af = new AnimationFrame('atlas', 'frame0', 0, mockFrame);
            af.destroy();

            expect(af.textureKey).toBe('atlas');
            expect(af.textureFrame).toBe('frame0');
            expect(af.index).toBe(0);
        });
    });
});
