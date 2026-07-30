var ShaderQuad = require('../../../../src/renderer/webgl/renderNodes/ShaderQuad');

describe('ShaderQuad', function ()
{
    it('should be importable', function ()
    {
        expect(ShaderQuad).toBeDefined();
    });

    it('should expose a prototype', function ()
    {
        expect(typeof ShaderQuad).toBe('function');
    });

    describe('setupTextures', function ()
    {
        it('should return an empty array when textures list is empty', function ()
        {
            var mockGameObject = {
                textures: []
            };

            var result = ShaderQuad.prototype.setupTextures.call({}, mockGameObject);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        it('should return an array of glTextures matching the textures list length', function ()
        {
            var mockGLTexture1 = { id: 1 };
            var mockGLTexture2 = { id: 2 };

            var mockGameObject = {
                textures: [
                    {
                        get: function ()
                        {
                            return { source: { glTexture: mockGLTexture1 } };
                        }
                    },
                    {
                        get: function ()
                        {
                            return { source: { glTexture: mockGLTexture2 } };
                        }
                    }
                ]
            };

            var result = ShaderQuad.prototype.setupTextures.call({}, mockGameObject);

            expect(result.length).toBe(2);
        });

        it('should return the correct glTexture objects from each texture entry', function ()
        {
            var mockGLTexture = { id: 42 };

            var mockGameObject = {
                textures: [
                    {
                        get: function ()
                        {
                            return { source: { glTexture: mockGLTexture } };
                        }
                    }
                ]
            };

            var result = ShaderQuad.prototype.setupTextures.call({}, mockGameObject);

            expect(result[0]).toBe(mockGLTexture);
        });

        it('should call get() on each texture entry', function ()
        {
            var getCalled = 0;

            var mockGameObject = {
                textures: [
                    {
                        get: function ()
                        {
                            getCalled++;
                            return { source: { glTexture: {} } };
                        }
                    },
                    {
                        get: function ()
                        {
                            getCalled++;
                            return { source: { glTexture: {} } };
                        }
                    },
                    {
                        get: function ()
                        {
                            getCalled++;
                            return { source: { glTexture: {} } };
                        }
                    }
                ]
            };

            ShaderQuad.prototype.setupTextures.call({}, mockGameObject);

            expect(getCalled).toBe(3);
        });

        it('should return glTextures in the same order as textures array', function ()
        {
            var mockGLTexture1 = { id: 1 };
            var mockGLTexture2 = { id: 2 };
            var mockGLTexture3 = { id: 3 };

            var mockGameObject = {
                textures: [
                    { get: function () { return { source: { glTexture: mockGLTexture1 } }; } },
                    { get: function () { return { source: { glTexture: mockGLTexture2 } }; } },
                    { get: function () { return { source: { glTexture: mockGLTexture3 } }; } }
                ]
            };

            var result = ShaderQuad.prototype.setupTextures.call({}, mockGameObject);

            expect(result[0]).toBe(mockGLTexture1);
            expect(result[1]).toBe(mockGLTexture2);
            expect(result[2]).toBe(mockGLTexture3);
        });
    });

    describe('updateShaderConfig', function ()
    {
        it('should be a function', function ()
        {
            expect(typeof ShaderQuad.prototype.updateShaderConfig).toBe('function');
        });

        it('should return undefined (NOOP)', function ()
        {
            var result = ShaderQuad.prototype.updateShaderConfig.call({}, {}, {}, {});

            expect(result).toBeUndefined();
        });

        it('should not throw when called with any arguments', function ()
        {
            expect(function ()
            {
                ShaderQuad.prototype.updateShaderConfig.call({}, null, null, null);
            }).not.toThrow();
        });

        it('should not throw when called with no arguments', function ()
        {
            expect(function ()
            {
                ShaderQuad.prototype.updateShaderConfig.call({});
            }).not.toThrow();
        });

        it('should not mutate the drawingContext argument', function ()
        {
            var drawingContext = { value: 'original' };

            ShaderQuad.prototype.updateShaderConfig.call({}, drawingContext, {}, {});

            expect(drawingContext.value).toBe('original');
        });

        it('should not mutate the gameObject argument', function ()
        {
            var gameObject = { active: true };

            ShaderQuad.prototype.updateShaderConfig.call({}, {}, gameObject, {});

            expect(gameObject.active).toBe(true);
        });
    });
});
