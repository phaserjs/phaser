var Blend = require('../../src/filters/Blend');

function createMockCamera (getFrameResult)
{
    return {
        scene: {
            sys: {
                textures: {
                    getFrame: function (key)
                    {
                        return getFrameResult !== undefined ? getFrameResult : null;
                    }
                }
            }
        }
    };
}

function createMockFrame (glTexture)
{
    return {
        glTexture: glTexture || { id: 'mock-gl-texture' }
    };
}

describe('Blend', function ()
{
    describe('constructor', function ()
    {
        it('should set default texture key and resolve glTexture', function ()
        {
            var mockFrame = createMockFrame();
            var camera = createMockCamera(mockFrame);
            var blend = new Blend(camera);

            expect(blend.glTexture).toBe(mockFrame.glTexture);
        });

        it('should set default blendMode to 0', function ()
        {
            var camera = createMockCamera(null);
            var blend = new Blend(camera);

            expect(blend.blendMode).toBe(0);
        });

        it('should set default amount to 1', function ()
        {
            var camera = createMockCamera(null);
            var blend = new Blend(camera);

            expect(blend.amount).toBe(1);
        });

        it('should set default color to [1, 1, 1, 1]', function ()
        {
            var camera = createMockCamera(null);
            var blend = new Blend(camera);

            expect(blend.color).toEqual([ 1, 1, 1, 1 ]);
        });

        it('should accept a custom blendMode', function ()
        {
            var camera = createMockCamera(null);
            var blend = new Blend(camera, '__WHITE', 5);

            expect(blend.blendMode).toBe(5);
        });

        it('should accept a custom amount', function ()
        {
            var camera = createMockCamera(null);
            var blend = new Blend(camera, '__WHITE', 0, 0.5);

            expect(blend.amount).toBeCloseTo(0.5);
        });

        it('should accept a custom color array', function ()
        {
            var camera = createMockCamera(null);
            var customColor = [ 0.2, 0.4, 0.6, 0.8 ];
            var blend = new Blend(camera, '__WHITE', 0, 1, customColor);

            expect(blend.color).toBe(customColor);
        });

        it('should set renderNode to FilterBlend', function ()
        {
            var camera = createMockCamera(null);
            var blend = new Blend(camera);

            expect(blend.renderNode).toBe('FilterBlend');
        });

        it('should store a reference to the camera', function ()
        {
            var camera = createMockCamera(null);
            var blend = new Blend(camera);

            expect(blend.camera).toBe(camera);
        });

        it('should set active to true by default', function ()
        {
            var camera = createMockCamera(null);
            var blend = new Blend(camera);

            expect(blend.active).toBe(true);
        });

        it('should leave glTexture undefined when texture frame is not found', function ()
        {
            var camera = createMockCamera(null);
            var blend = new Blend(camera);

            expect(blend.glTexture).toBeUndefined();
        });

        it('should accept amount of 0', function ()
        {
            var camera = createMockCamera(null);
            var blend = new Blend(camera, '__WHITE', 0, 0);

            expect(blend.amount).toBe(0);
        });

        it('should accept amount outside normal range', function ()
        {
            var camera = createMockCamera(null);
            var blend = new Blend(camera, '__WHITE', 0, 2.5);

            expect(blend.amount).toBeCloseTo(2.5);
        });
    });

    describe('setTexture', function ()
    {
        it('should return this for chaining', function ()
        {
            var camera = createMockCamera(null);
            var blend = new Blend(camera);
            var result = blend.setTexture('__WHITE');

            expect(result).toBe(blend);
        });

        it('should set glTexture when the frame is found', function ()
        {
            var mockGlTexture = { id: 'new-gl-texture' };
            var mockFrame = createMockFrame(mockGlTexture);
            var camera = {
                scene: {
                    sys: {
                        textures: {
                            getFrame: function (key)
                            {
                                if (key === 'myTexture')
                                {
                                    return mockFrame;
                                }
                                return null;
                            }
                        }
                    }
                }
            };
            var blend = new Blend(camera);
            blend.setTexture('myTexture');

            expect(blend.glTexture).toBe(mockGlTexture);
        });

        it('should not change glTexture when the frame is not found', function ()
        {
            var mockGlTexture = { id: 'original-gl-texture' };
            var mockFrame = createMockFrame(mockGlTexture);
            var callCount = 0;
            var camera = {
                scene: {
                    sys: {
                        textures: {
                            getFrame: function (key)
                            {
                                callCount++;
                                if (callCount === 1)
                                {
                                    return mockFrame;
                                }
                                return null;
                            }
                        }
                    }
                }
            };
            var blend = new Blend(camera, 'firstTexture');

            expect(blend.glTexture).toBe(mockGlTexture);

            blend.setTexture('missingTexture');

            expect(blend.glTexture).toBe(mockGlTexture);
        });

        it('should update glTexture when called with a new valid texture', function ()
        {
            var firstGlTexture = { id: 'first' };
            var secondGlTexture = { id: 'second' };
            var frames = {
                'textureA': createMockFrame(firstGlTexture),
                'textureB': createMockFrame(secondGlTexture)
            };
            var camera = {
                scene: {
                    sys: {
                        textures: {
                            getFrame: function (key)
                            {
                                return frames[key] || null;
                            }
                        }
                    }
                }
            };
            var blend = new Blend(camera, 'textureA');

            expect(blend.glTexture).toBe(firstGlTexture);

            blend.setTexture('textureB');

            expect(blend.glTexture).toBe(secondGlTexture);
        });

        it('should pass undefined to getFrame when called with no argument', function ()
        {
            var mockFrame = createMockFrame();
            var requestedKey = 'sentinel';
            var camera = {
                scene: {
                    sys: {
                        textures: {
                            getFrame: function (key)
                            {
                                requestedKey = key;
                                return mockFrame;
                            }
                        }
                    }
                }
            };
            var blend = new Blend(camera);
            requestedKey = 'sentinel';
            blend.setTexture();

            expect(requestedKey).toBeUndefined();
        });
    });
});
