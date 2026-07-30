var ImageLight = require('../../src/filters/ImageLight');

function makeMockGlTexture ()
{
    return { id: Math.random() };
}

function makeMockCamera (glTexture)
{
    var resolvedGlTexture = glTexture || makeMockGlTexture();
    return {
        scene: {
            sys: {
                textures: {
                    getFrame: function (key)
                    {
                        return { glTexture: resolvedGlTexture };
                    }
                }
            }
        }
    };
}

function makeInstance (configOverrides)
{
    var camera = makeMockCamera();
    var config = Object.assign({}, configOverrides || {});
    return new ImageLight(camera, config);
}

describe('ImageLight', function ()
{
    describe('constructor', function ()
    {
        it('should set modelRotation to 0 when not provided', function ()
        {
            var filter = makeInstance();
            expect(filter.modelRotation).toBe(0);
        });

        it('should set modelRotation from config', function ()
        {
            var filter = makeInstance({ modelRotation: 1.5 });
            expect(filter.modelRotation).toBe(1.5);
        });

        it('should set modelRotationSource to null when not provided', function ()
        {
            var filter = makeInstance();
            expect(filter.modelRotationSource).toBeNull();
        });

        it('should set modelRotationSource from config', function ()
        {
            var source = function () { return 0.5; };
            var filter = makeInstance({ modelRotationSource: source });
            expect(filter.modelRotationSource).toBe(source);
        });

        it('should set bulge to 0 when not provided', function ()
        {
            var filter = makeInstance();
            expect(filter.bulge).toBe(0);
        });

        it('should set bulge from config', function ()
        {
            var filter = makeInstance({ bulge: 0.1 });
            expect(filter.bulge).toBeCloseTo(0.1);
        });

        it('should set colorFactor to [1, 1, 1] when not provided', function ()
        {
            var filter = makeInstance();
            expect(filter.colorFactor).toEqual([ 1, 1, 1 ]);
        });

        it('should set colorFactor from config', function ()
        {
            var cf = [ 2, 0.5, 1.2 ];
            var filter = makeInstance({ colorFactor: cf });
            expect(filter.colorFactor).toBe(cf);
        });

        it('should create a viewMatrix instance', function ()
        {
            var filter = makeInstance();
            expect(filter.viewMatrix).toBeDefined();
            expect(typeof filter.viewMatrix).toBe('object');
        });

        it('should set environmentGlTexture via setEnvironmentMap during construction', function ()
        {
            var glTexture = makeMockGlTexture();
            var camera = makeMockCamera(glTexture);
            var filter = new ImageLight(camera, {});
            expect(filter.environmentGlTexture).toBe(glTexture);
        });

        it('should set normalGlTexture via setNormalMap during construction', function ()
        {
            var glTexture = makeMockGlTexture();
            var camera = makeMockCamera(glTexture);
            var filter = new ImageLight(camera, {});
            expect(filter.normalGlTexture).toBe(glTexture);
        });

        it('should set the renderNode type', function ()
        {
            var filter = makeInstance();
            expect(filter.renderNode).toBe('FilterImageLight');
        });

        it('should store a reference to the camera', function ()
        {
            var camera = makeMockCamera();
            var filter = new ImageLight(camera, {});
            expect(filter.camera).toBe(camera);
        });
    });

    describe('setEnvironmentMap', function ()
    {
        it('should return this for chaining', function ()
        {
            var filter = makeInstance();
            var result = filter.setEnvironmentMap('myTexture');
            expect(result).toBe(filter);
        });

        it('should set environmentGlTexture when given a string key', function ()
        {
            var glTexture = makeMockGlTexture();
            var camera = makeMockCamera(glTexture);
            var filter = new ImageLight(camera, {});
            var newGlTexture = makeMockGlTexture();
            camera.scene.sys.textures.getFrame = function () { return { glTexture: newGlTexture }; };
            filter.setEnvironmentMap('newMap');
            expect(filter.environmentGlTexture).toBe(newGlTexture);
        });

        it('should not change environmentGlTexture when getFrame returns null', function ()
        {
            var glTexture = makeMockGlTexture();
            var camera = makeMockCamera(glTexture);
            var filter = new ImageLight(camera, {});
            var previousGlTexture = filter.environmentGlTexture;
            camera.scene.sys.textures.getFrame = function () { return null; };
            filter.setEnvironmentMap('missing');
            expect(filter.environmentGlTexture).toBe(previousGlTexture);
        });

        it.todo('should use glTexture directly when given a Phaser.Textures.Texture instance', function ()
        {
            var filter = makeInstance();
            var glTexture = makeMockGlTexture();
            var phaserTexture = new global.Phaser.Textures.Texture(glTexture);
            filter.setEnvironmentMap(phaserTexture);
            expect(filter.environmentGlTexture).toBe(glTexture);
        });
    });

    describe('setNormalMap', function ()
    {
        it('should return this for chaining', function ()
        {
            var filter = makeInstance();
            var result = filter.setNormalMap('myNormal');
            expect(result).toBe(filter);
        });

        it('should set normalGlTexture when given a string key', function ()
        {
            var glTexture = makeMockGlTexture();
            var camera = makeMockCamera(glTexture);
            var filter = new ImageLight(camera, {});
            var newGlTexture = makeMockGlTexture();
            camera.scene.sys.textures.getFrame = function () { return { glTexture: newGlTexture }; };
            filter.setNormalMap('newNormal');
            expect(filter.normalGlTexture).toBe(newGlTexture);
        });

        it('should not change normalGlTexture when getFrame returns null', function ()
        {
            var glTexture = makeMockGlTexture();
            var camera = makeMockCamera(glTexture);
            var filter = new ImageLight(camera, {});
            var previousGlTexture = filter.normalGlTexture;
            camera.scene.sys.textures.getFrame = function () { return null; };
            filter.setNormalMap('missing');
            expect(filter.normalGlTexture).toBe(previousGlTexture);
        });

        it.todo('should use glTexture directly when given a Phaser.Textures.Texture instance as normal map', function ()
        {
            var filter = makeInstance();
            var glTexture = makeMockGlTexture();
            var phaserTexture = new global.Phaser.Textures.Texture(glTexture);
            filter.setNormalMap(phaserTexture);
            expect(filter.normalGlTexture).toBe(glTexture);
        });
    });

    describe('setNormalMapFromGameObject', function ()
    {
        it('should return this for chaining', function ()
        {
            var filter = makeInstance();
            var glTexture = makeMockGlTexture();
            var gameObject = {
                texture: {
                    dataSource: [ { glTexture: glTexture } ]
                }
            };
            var result = filter.setNormalMapFromGameObject(gameObject);
            expect(result).toBe(filter);
        });

        it('should set normalGlTexture from the first dataSource of the game object texture', function ()
        {
            var filter = makeInstance();
            var glTexture = makeMockGlTexture();
            var gameObject = {
                texture: {
                    dataSource: [ { glTexture: glTexture } ]
                }
            };
            filter.setNormalMapFromGameObject(gameObject);
            expect(filter.normalGlTexture).toBe(glTexture);
        });

        it('should not change normalGlTexture when dataSource is empty', function ()
        {
            var glTexture = makeMockGlTexture();
            var camera = makeMockCamera(glTexture);
            var filter = new ImageLight(camera, {});
            var previousGlTexture = filter.normalGlTexture;
            var gameObject = {
                texture: {
                    dataSource: []
                }
            };
            filter.setNormalMapFromGameObject(gameObject);
            expect(filter.normalGlTexture).toBe(previousGlTexture);
        });

        it('should not change normalGlTexture when dataSource[0] is undefined', function ()
        {
            var glTexture = makeMockGlTexture();
            var camera = makeMockCamera(glTexture);
            var filter = new ImageLight(camera, {});
            var previousGlTexture = filter.normalGlTexture;
            var gameObject = {
                texture: {
                    dataSource: [ undefined ]
                }
            };
            filter.setNormalMapFromGameObject(gameObject);
            expect(filter.normalGlTexture).toBe(previousGlTexture);
        });
    });

    describe('getModelRotation', function ()
    {
        it('should return modelRotation when modelRotationSource is null', function ()
        {
            var filter = makeInstance({ modelRotation: 1.23 });
            expect(filter.getModelRotation()).toBeCloseTo(1.23);
        });

        it('should return 0 when modelRotation is 0 and no source is set', function ()
        {
            var filter = makeInstance({ modelRotation: 0 });
            expect(filter.getModelRotation()).toBe(0);
        });

        it('should call modelRotationSource when it is a function', function ()
        {
            var filter = makeInstance();
            filter.modelRotationSource = function () { return 2.5; };
            expect(filter.getModelRotation()).toBeCloseTo(2.5);
        });

        it('should return the value from the modelRotationSource function', function ()
        {
            var filter = makeInstance({ modelRotation: 99 });
            filter.modelRotationSource = function () { return 0.42; };
            expect(filter.getModelRotation()).toBeCloseTo(0.42);
        });

        it('should invoke the function each time getModelRotation is called', function ()
        {
            var filter = makeInstance();
            var callCount = 0;
            filter.modelRotationSource = function () { callCount++; return 1.0; };
            filter.getModelRotation();
            filter.getModelRotation();
            expect(callCount).toBe(2);
        });

        it('should get rotationNormalized from a game object with hasTransformComponent', function ()
        {
            var filter = makeInstance();
            var mockMatrix = { rotationNormalized: 0.77 };
            filter.modelRotationSource = {
                hasTransformComponent: true,
                getWorldTransformMatrix: function (tempMatrix, tempParentMatrix)
                {
                    return mockMatrix;
                }
            };
            expect(filter.getModelRotation()).toBeCloseTo(0.77);
        });

        it('should pass _tempMatrix and _tempParentMatrix to getWorldTransformMatrix', function ()
        {
            var filter = makeInstance();
            var capturedArgs = [];
            filter.modelRotationSource = {
                hasTransformComponent: true,
                getWorldTransformMatrix: function (a, b)
                {
                    capturedArgs.push(a, b);
                    return { rotationNormalized: 0 };
                }
            };
            filter.getModelRotation();
            expect(capturedArgs[0]).toBe(filter._tempMatrix);
            expect(capturedArgs[1]).toBe(filter._tempParentMatrix);
        });

        it('should fall through to modelRotation when source has no hasTransformComponent and is not a function', function ()
        {
            var filter = makeInstance({ modelRotation: 3.14 });
            // An object that is truthy but not a function and lacks hasTransformComponent.
            filter.modelRotationSource = { hasTransformComponent: false };
            expect(filter.getModelRotation()).toBeCloseTo(3.14);
        });
    });
});
