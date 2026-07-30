var CameraManager = require('../../../src/cameras/2d/CameraManager');

describe('CameraManager', function ()
{
    var manager;
    var mockScene;

    function createMockScene (roundPixels)
    {
        var scene = {};

        scene.sys = {
            game: {
                config: { roundPixels: roundPixels !== undefined ? roundPixels : false },
                scale: {
                    on: vi.fn(),
                    off: vi.fn()
                },
                scene: {
                    customViewports: 0
                }
            },
            scale: { width: 800, height: 600 },
            settings: {},
            cameras: null,
            events: {
                once: vi.fn(),
                on: vi.fn(),
                off: vi.fn(),
                emit: vi.fn()
            }
        };

        return scene;
    }

    function createMockCamera (options)
    {
        options = options || {};

        var cam = {
            id: options.id !== undefined ? options.id : 0,
            name: options.name || '',
            x: options.x !== undefined ? options.x : 0,
            y: options.y !== undefined ? options.y : 0,
            _x: options.x !== undefined ? options.x : 0,
            _y: options.y !== undefined ? options.y : 0,
            width: options.width !== undefined ? options.width : 800,
            height: options.height !== undefined ? options.height : 600,
            _width: options.width !== undefined ? options.width : 800,
            _height: options.height !== undefined ? options.height : 600,
            visible: options.visible !== undefined ? options.visible : true,
            alpha: options.alpha !== undefined ? options.alpha : 1,
            inputEnabled: options.inputEnabled !== undefined ? options.inputEnabled : true,
            roundPixels: false,
            renderList: [],
            setRoundPixels: function (v) { this.roundPixels = v; },
            setSize: vi.fn(function (w, h) { this._width = w; this._height = h; }),
            destroy: vi.fn(),
            update: vi.fn(),
            preRender: vi.fn()
        };

        return cam;
    }

    beforeEach(function ()
    {
        mockScene = createMockScene();
        manager = new CameraManager(mockScene);
        mockScene.sys.cameras = manager;
    });

    describe('constructor', function ()
    {
        it('should set the scene reference', function ()
        {
            expect(manager.scene).toBe(mockScene);
        });

        it('should set the systems reference', function ()
        {
            expect(manager.systems).toBe(mockScene.sys);
        });

        it('should set roundPixels to false from game config', function ()
        {
            expect(manager.roundPixels).toBe(false);
        });

        it('should set roundPixels to true when game config has roundPixels true', function ()
        {
            var scene = createMockScene(true);
            var mgr = new CameraManager(scene);

            expect(mgr.roundPixels).toBe(true);
        });

        it('should initialize cameras as an empty array', function ()
        {
            expect(Array.isArray(manager.cameras)).toBe(true);
            expect(manager.cameras.length).toBe(0);
        });

        it('should register a BOOT event listener on sys events', function ()
        {
            expect(mockScene.sys.events.once).toHaveBeenCalled();
        });

        it('should register a START event listener on sys events', function ()
        {
            expect(mockScene.sys.events.on).toHaveBeenCalled();
        });
    });

    describe('add', function ()
    {
        it('should add a camera and return it', function ()
        {
            var cam = manager.add(0, 0, 800, 600);

            expect(cam).toBeDefined();
            expect(manager.cameras.length).toBe(1);
            expect(manager.cameras[0]).toBe(cam);
        });

        it('should use default x and y of 0 when not specified', function ()
        {
            var cam = manager.add();

            expect(cam._x).toBe(0);
            expect(cam._y).toBe(0);
        });

        it('should use scene scale width and height as defaults', function ()
        {
            var cam = manager.add();

            expect(cam._width).toBe(800);
            expect(cam._height).toBe(600);
        });

        it('should use provided x, y, width and height', function ()
        {
            var cam = manager.add(10, 20, 320, 240);

            expect(cam._x).toBe(10);
            expect(cam._y).toBe(20);
            expect(cam._width).toBe(320);
            expect(cam._height).toBe(240);
        });

        it('should set main to the new camera when makeMain is true', function ()
        {
            var cam = manager.add(0, 0, 800, 600, true);

            expect(manager.main).toBe(cam);
        });

        it('should not set main when makeMain is false', function ()
        {
            var cam = manager.add(0, 0, 800, 600, false);

            expect(manager.main).not.toBe(cam);
        });

        it('should set the camera name', function ()
        {
            var cam = manager.add(0, 0, 800, 600, false, 'myCam');

            expect(cam.name).toBe('myCam');
        });

        it('should assign a non-zero id to the first camera', function ()
        {
            var cam = manager.add();

            expect(cam.id).not.toBe(0);
        });

        it('should assign unique ids to multiple cameras', function ()
        {
            var cam1 = manager.add();
            var cam2 = manager.add();
            var cam3 = manager.add();

            expect(cam1.id).not.toBe(cam2.id);
            expect(cam2.id).not.toBe(cam3.id);
            expect(cam1.id).not.toBe(cam3.id);
        });

        it('should add multiple cameras to the cameras array', function ()
        {
            manager.add();
            manager.add();
            manager.add();

            expect(manager.cameras.length).toBe(3);
        });

        it('should assign id 0 after 32 cameras have been created', function ()
        {
            for (var i = 0; i < 32; i++)
            {
                manager.add();
            }

            var overflow = manager.add();

            expect(overflow.id).toBe(0);
        });
    });

    describe('addExisting', function ()
    {
        it('should add a new camera and return it', function ()
        {
            var cam = createMockCamera();
            var result = manager.addExisting(cam);

            expect(result).toBe(cam);
            expect(manager.cameras.length).toBe(1);
        });

        it('should return null if the camera already exists in the manager', function ()
        {
            var cam = createMockCamera();
            manager.addExisting(cam);

            var result = manager.addExisting(cam);

            expect(result).toBeNull();
        });

        it('should not add a duplicate camera', function ()
        {
            var cam = createMockCamera();
            manager.addExisting(cam);
            manager.addExisting(cam);

            expect(manager.cameras.length).toBe(1);
        });

        it('should set main to the camera when makeMain is true', function ()
        {
            var cam = createMockCamera();
            manager.addExisting(cam, true);

            expect(manager.main).toBe(cam);
        });

        it('should not set main when makeMain is false', function ()
        {
            var cam = createMockCamera();
            manager.addExisting(cam, false);

            expect(manager.main).not.toBe(cam);
        });

        it('should assign a non-zero id to the added camera', function ()
        {
            var cam = createMockCamera({ id: 0 });
            manager.addExisting(cam);

            expect(cam.id).not.toBe(0);
        });

        it('should set roundPixels on the added camera', function ()
        {
            manager.roundPixels = true;

            var cam = createMockCamera();
            manager.addExisting(cam);

            expect(cam.roundPixels).toBe(true);
        });
    });

    describe('getTotal', function ()
    {
        it('should return 0 when no cameras exist', function ()
        {
            expect(manager.getTotal()).toBe(0);
        });

        it('should return the total number of cameras', function ()
        {
            manager.cameras.push(createMockCamera());
            manager.cameras.push(createMockCamera());
            manager.cameras.push(createMockCamera());

            expect(manager.getTotal()).toBe(3);
        });

        it('should count all cameras regardless of visibility when isVisible is false', function ()
        {
            manager.cameras.push(createMockCamera({ visible: true }));
            manager.cameras.push(createMockCamera({ visible: false }));
            manager.cameras.push(createMockCamera({ visible: false }));

            expect(manager.getTotal(false)).toBe(3);
        });

        it('should count only visible cameras when isVisible is true', function ()
        {
            manager.cameras.push(createMockCamera({ visible: true }));
            manager.cameras.push(createMockCamera({ visible: false }));
            manager.cameras.push(createMockCamera({ visible: true }));

            expect(manager.getTotal(true)).toBe(2);
        });

        it('should return 0 when isVisible is true and no cameras are visible', function ()
        {
            manager.cameras.push(createMockCamera({ visible: false }));
            manager.cameras.push(createMockCamera({ visible: false }));

            expect(manager.getTotal(true)).toBe(0);
        });
    });

    describe('fromJSON', function ()
    {
        it('should return this for chaining', function ()
        {
            var result = manager.fromJSON({ x: 0, y: 0, width: 800, height: 600 });

            expect(result).toBe(manager);
        });

        it('should create a camera from a single config object', function ()
        {
            manager.fromJSON({ x: 10, y: 20, width: 400, height: 300 });

            expect(manager.cameras.length).toBe(1);
        });

        it('should create cameras from an array of config objects', function ()
        {
            manager.fromJSON([
                { x: 0, y: 0, width: 400, height: 300 },
                { x: 400, y: 0, width: 400, height: 300 }
            ]);

            expect(manager.cameras.length).toBe(2);
        });

        it('should set camera name from config', function ()
        {
            manager.fromJSON({ name: 'testCam' });

            expect(manager.cameras[0].name).toBe('testCam');
        });

        it('should set camera zoom from config', function ()
        {
            manager.fromJSON({ zoom: 2 });

            expect(manager.cameras[0].zoom).toBe(2);
        });

        it('should set camera rotation from config', function ()
        {
            manager.fromJSON({ rotation: 1.5 });

            expect(manager.cameras[0].rotation).toBeCloseTo(1.5);
        });

        it('should set camera scrollX from config', function ()
        {
            manager.fromJSON({ scrollX: 100 });

            expect(manager.cameras[0].scrollX).toBe(100);
        });

        it('should set camera scrollY from config', function ()
        {
            manager.fromJSON({ scrollY: 200 });

            expect(manager.cameras[0].scrollY).toBe(200);
        });

        it('should set camera visible from config', function ()
        {
            manager.fromJSON({ visible: false });

            expect(manager.cameras[0].visible).toBe(false);
        });

        it('should use game width and height as defaults when not specified', function ()
        {
            manager.fromJSON({});

            expect(manager.cameras[0]._width).toBe(800);
            expect(manager.cameras[0]._height).toBe(600);
        });

        it('should use specified x and y from config', function ()
        {
            manager.fromJSON({ x: 50, y: 75 });

            expect(manager.cameras[0]._x).toBe(50);
            expect(manager.cameras[0]._y).toBe(75);
        });
    });

    describe('getCamera', function ()
    {
        it('should return a camera by name', function ()
        {
            var cam = createMockCamera({ name: 'myCamera' });
            manager.cameras.push(cam);

            expect(manager.getCamera('myCamera')).toBe(cam);
        });

        it('should return null when no camera with that name exists', function ()
        {
            var cam = createMockCamera({ name: 'foo' });
            manager.cameras.push(cam);

            expect(manager.getCamera('bar')).toBeNull();
        });

        it('should return null when cameras array is empty', function ()
        {
            expect(manager.getCamera('anything')).toBeNull();
        });

        it('should return the first camera when multiple cameras share a name', function ()
        {
            var cam1 = createMockCamera({ name: 'same' });
            var cam2 = createMockCamera({ name: 'same' });
            manager.cameras.push(cam1);
            manager.cameras.push(cam2);

            expect(manager.getCamera('same')).toBe(cam1);
        });
    });

    describe('getCamerasBelowPointer', function ()
    {
        it('should return cameras that contain the pointer position', function ()
        {
            var cam = createMockCamera({ x: 0, y: 0, width: 800, height: 600 });
            manager.cameras.push(cam);

            var pointer = { x: 400, y: 300 };
            var result = manager.getCamerasBelowPointer(pointer);

            expect(result.length).toBe(1);
            expect(result[0]).toBe(cam);
        });

        it('should return an empty array when pointer is outside all cameras', function ()
        {
            var cam = createMockCamera({ x: 0, y: 0, width: 400, height: 300 });
            manager.cameras.push(cam);

            var pointer = { x: 700, y: 500 };
            var result = manager.getCamerasBelowPointer(pointer);

            expect(result.length).toBe(0);
        });

        it('should not include invisible cameras', function ()
        {
            var cam = createMockCamera({ x: 0, y: 0, width: 800, height: 600, visible: false });
            manager.cameras.push(cam);

            var pointer = { x: 400, y: 300 };
            var result = manager.getCamerasBelowPointer(pointer);

            expect(result.length).toBe(0);
        });

        it('should not include cameras with inputEnabled false', function ()
        {
            var cam = createMockCamera({ x: 0, y: 0, width: 800, height: 600, inputEnabled: false });
            manager.cameras.push(cam);

            var pointer = { x: 400, y: 300 };
            var result = manager.getCamerasBelowPointer(pointer);

            expect(result.length).toBe(0);
        });

        it('should return top-most camera first (unshift order)', function ()
        {
            var cam1 = createMockCamera({ x: 0, y: 0, width: 800, height: 600 });
            var cam2 = createMockCamera({ x: 0, y: 0, width: 800, height: 600 });
            manager.cameras.push(cam1);
            manager.cameras.push(cam2);

            var pointer = { x: 400, y: 300 };
            var result = manager.getCamerasBelowPointer(pointer);

            expect(result.length).toBe(2);
            expect(result[0]).toBe(cam2);
            expect(result[1]).toBe(cam1);
        });

        it('should return multiple cameras that overlap the pointer', function ()
        {
            var cam1 = createMockCamera({ x: 0, y: 0, width: 800, height: 600 });
            var cam2 = createMockCamera({ x: 100, y: 100, width: 400, height: 300 });
            var cam3 = createMockCamera({ x: 600, y: 400, width: 200, height: 200 });
            manager.cameras.push(cam1);
            manager.cameras.push(cam2);
            manager.cameras.push(cam3);

            var pointer = { x: 200, y: 200 };
            var result = manager.getCamerasBelowPointer(pointer);

            expect(result.length).toBe(2);
        });
    });

    describe('remove', function ()
    {
        it('should remove a single camera and return 1', function ()
        {
            var cam = createMockCamera();
            manager.cameras.push(cam);

            var total = manager.remove(cam);

            expect(total).toBe(1);
            expect(manager.cameras.length).toBe(0);
        });

        it('should remove an array of cameras and return the count', function ()
        {
            var cam1 = createMockCamera();
            var cam2 = createMockCamera();
            manager.cameras.push(cam1);
            manager.cameras.push(cam2);

            var total = manager.remove([ cam1, cam2 ]);

            expect(total).toBe(2);
            expect(manager.cameras.length).toBe(0);
        });

        it('should return 0 when camera is not in the manager', function ()
        {
            var cam = createMockCamera();
            var outsideCam = createMockCamera();
            manager.cameras.push(cam);

            var total = manager.remove(outsideCam);

            expect(total).toBe(0);
            expect(manager.cameras.length).toBe(1);
        });

        it('should call destroy on the camera by default', function ()
        {
            var cam = createMockCamera();
            manager.cameras.push(cam);

            manager.remove(cam);

            expect(cam.destroy).toHaveBeenCalledOnce();
        });

        it('should not call destroy when runDestroy is false', function ()
        {
            var cam = createMockCamera();
            manager.cameras.push(cam);

            manager.remove(cam, false);

            expect(cam.destroy).not.toHaveBeenCalled();
        });

        it('should clear renderList instead of destroying when runDestroy is false', function ()
        {
            var cam = createMockCamera();
            cam.renderList = [ {}, {}, {} ];
            manager.cameras.push(cam);

            manager.remove(cam, false);

            expect(cam.renderList).toEqual([]);
        });

        it('should only remove cameras that exist in the manager from an array', function ()
        {
            var cam1 = createMockCamera();
            var cam2 = createMockCamera();
            var outsideCam = createMockCamera();
            manager.cameras.push(cam1);
            manager.cameras.push(cam2);

            var total = manager.remove([ cam1, outsideCam ]);

            expect(total).toBe(1);
            expect(manager.cameras.length).toBe(1);
        });
    });

    describe('getVisibleChildren', function ()
    {
        it('should return children that willRender returns true for', function ()
        {
            var cam = createMockCamera();
            var child1 = { willRender: function () { return true; } };
            var child2 = { willRender: function () { return false; } };
            var child3 = { willRender: function () { return true; } };

            var result = manager.getVisibleChildren([ child1, child2, child3 ], cam);

            expect(result.length).toBe(2);
            expect(result[0]).toBe(child1);
            expect(result[1]).toBe(child3);
        });

        it('should return an empty array when no children pass willRender', function ()
        {
            var cam = createMockCamera();
            var child1 = { willRender: function () { return false; } };

            var result = manager.getVisibleChildren([ child1 ], cam);

            expect(result.length).toBe(0);
        });

        it('should return all children when all pass willRender', function ()
        {
            var cam = createMockCamera();
            var children = [
                { willRender: function () { return true; } },
                { willRender: function () { return true; } }
            ];

            var result = manager.getVisibleChildren(children, cam);

            expect(result.length).toBe(2);
        });

        it('should return an empty array when given an empty children array', function ()
        {
            var cam = createMockCamera();

            var result = manager.getVisibleChildren([], cam);

            expect(result.length).toBe(0);
        });

        it('should pass the camera to each child willRender call', function ()
        {
            var cam = createMockCamera();
            var receivedCam;
            var child = {
                willRender: function (c)
                {
                    receivedCam = c;
                    return true;
                }
            };

            manager.getVisibleChildren([ child ], cam);

            expect(receivedCam).toBe(cam);
        });
    });

    describe('render', function ()
    {
        it('should call renderer.render for visible cameras with alpha > 0', function ()
        {
            var cam = createMockCamera({ visible: true, alpha: 1 });
            manager.cameras.push(cam);

            var visibleChild = { willRender: function () { return true; } };
            var mockRenderer = { render: vi.fn() };
            var mockDisplayList = { getChildren: vi.fn().mockReturnValue([ visibleChild ]) };

            manager.render(mockRenderer, mockDisplayList);

            expect(mockRenderer.render).toHaveBeenCalledOnce();
        });

        it('should not call renderer.render for invisible cameras', function ()
        {
            var cam = createMockCamera({ visible: false, alpha: 1 });
            manager.cameras.push(cam);

            var mockRenderer = { render: vi.fn() };
            var mockDisplayList = { getChildren: vi.fn().mockReturnValue([]) };

            manager.render(mockRenderer, mockDisplayList);

            expect(mockRenderer.render).not.toHaveBeenCalled();
        });

        it('should not call renderer.render for cameras with alpha of 0', function ()
        {
            var cam = createMockCamera({ visible: true, alpha: 0 });
            manager.cameras.push(cam);

            var mockRenderer = { render: vi.fn() };
            var mockDisplayList = { getChildren: vi.fn().mockReturnValue([]) };

            manager.render(mockRenderer, mockDisplayList);

            expect(mockRenderer.render).not.toHaveBeenCalled();
        });

        it('should call preRender on each visible camera', function ()
        {
            var cam = createMockCamera({ visible: true, alpha: 1 });
            manager.cameras.push(cam);

            var mockRenderer = { render: vi.fn() };
            var mockDisplayList = { getChildren: vi.fn().mockReturnValue([]) };

            manager.render(mockRenderer, mockDisplayList);

            expect(cam.preRender).toHaveBeenCalledOnce();
        });

        it('should pass the scene and visible children to the renderer', function ()
        {
            var cam = createMockCamera({ visible: true, alpha: 1 });
            manager.cameras.push(cam);

            var child = { willRender: function () { return true; } };
            var mockRenderer = { render: vi.fn() };
            var mockDisplayList = { getChildren: vi.fn().mockReturnValue([ child ]) };

            manager.render(mockRenderer, mockDisplayList);

            expect(mockRenderer.render).toHaveBeenCalledWith(mockScene, [ child ], cam);
        });

        it('should call renderer.render once per visible camera', function ()
        {
            manager.cameras.push(createMockCamera({ visible: true, alpha: 1 }));
            manager.cameras.push(createMockCamera({ visible: true, alpha: 1 }));
            manager.cameras.push(createMockCamera({ visible: false, alpha: 1 }));

            var mockRenderer = { render: vi.fn() };
            var mockDisplayList = { getChildren: vi.fn().mockReturnValue([]) };

            manager.render(mockRenderer, mockDisplayList);

            expect(mockRenderer.render).toHaveBeenCalledTimes(2);
        });
    });

    describe('resetAll', function ()
    {
        it('should clear all existing cameras', function ()
        {
            var cam1 = createMockCamera();
            var cam2 = createMockCamera();
            manager.cameras.push(cam1);
            manager.cameras.push(cam2);

            manager.resetAll();

            expect(manager.cameras.length).toBe(1);
        });

        it('should destroy all existing cameras', function ()
        {
            var cam1 = createMockCamera();
            var cam2 = createMockCamera();
            manager.cameras.push(cam1);
            manager.cameras.push(cam2);

            manager.resetAll();

            expect(cam1.destroy).toHaveBeenCalledOnce();
            expect(cam2.destroy).toHaveBeenCalledOnce();
        });

        it('should set main to the new camera', function ()
        {
            var result = manager.resetAll();

            expect(manager.main).toBe(result);
        });

        it('should return the new main camera', function ()
        {
            var result = manager.resetAll();

            expect(result).toBeDefined();
            expect(result).toBe(manager.cameras[0]);
        });
    });

    describe('update', function ()
    {
        it('should call update on all cameras', function ()
        {
            var cam1 = createMockCamera();
            var cam2 = createMockCamera();
            manager.cameras.push(cam1);
            manager.cameras.push(cam2);

            manager.update(1000, 16);

            expect(cam1.update).toHaveBeenCalledOnce();
            expect(cam2.update).toHaveBeenCalledOnce();
        });

        it('should pass time and delta to each camera update', function ()
        {
            var cam = createMockCamera();
            manager.cameras.push(cam);

            manager.update(5000, 32);

            expect(cam.update).toHaveBeenCalledWith(5000, 32);
        });

        it('should not throw when cameras array is empty', function ()
        {
            expect(function ()
            {
                manager.update(1000, 16);
            }).not.toThrow();
        });
    });

    describe('onResize', function ()
    {
        it('should resize cameras that are at 0,0 and match previous dimensions', function ()
        {
            var cam = createMockCamera({ x: 0, y: 0, width: 800, height: 600 });
            manager.cameras.push(cam);

            var gameSize = {};
            var baseSize = { width: 1024, height: 768 };

            manager.onResize(gameSize, baseSize, null, 800, 600);

            expect(cam.setSize).toHaveBeenCalledWith(1024, 768);
        });

        it('should not resize cameras that are not at 0,0', function ()
        {
            var cam = createMockCamera({ x: 100, y: 0, width: 800, height: 600 });
            manager.cameras.push(cam);

            var gameSize = {};
            var baseSize = { width: 1024, height: 768 };

            manager.onResize(gameSize, baseSize, null, 800, 600);

            expect(cam.setSize).not.toHaveBeenCalled();
        });

        it('should not resize cameras whose size does not match previousWidth/previousHeight', function ()
        {
            var cam = createMockCamera({ x: 0, y: 0, width: 400, height: 300 });
            manager.cameras.push(cam);

            var gameSize = {};
            var baseSize = { width: 1024, height: 768 };

            manager.onResize(gameSize, baseSize, null, 800, 600);

            expect(cam.setSize).not.toHaveBeenCalled();
        });

        it('should resize multiple matching cameras', function ()
        {
            var cam1 = createMockCamera({ x: 0, y: 0, width: 800, height: 600 });
            var cam2 = createMockCamera({ x: 0, y: 0, width: 800, height: 600 });
            var cam3 = createMockCamera({ x: 50, y: 0, width: 800, height: 600 });
            manager.cameras.push(cam1);
            manager.cameras.push(cam2);
            manager.cameras.push(cam3);

            var gameSize = {};
            var baseSize = { width: 1024, height: 768 };

            manager.onResize(gameSize, baseSize, null, 800, 600);

            expect(cam1.setSize).toHaveBeenCalledWith(1024, 768);
            expect(cam2.setSize).toHaveBeenCalledWith(1024, 768);
            expect(cam3.setSize).not.toHaveBeenCalled();
        });
    });

    describe('resize', function ()
    {
        it('should call setSize on all cameras', function ()
        {
            var cam1 = createMockCamera();
            var cam2 = createMockCamera();
            manager.cameras.push(cam1);
            manager.cameras.push(cam2);

            manager.resize(1024, 768);

            expect(cam1.setSize).toHaveBeenCalledWith(1024, 768);
            expect(cam2.setSize).toHaveBeenCalledWith(1024, 768);
        });

        it('should not throw when cameras array is empty', function ()
        {
            expect(function ()
            {
                manager.resize(1024, 768);
            }).not.toThrow();
        });

        it('should pass the correct dimensions to setSize', function ()
        {
            var cam = createMockCamera();
            manager.cameras.push(cam);

            manager.resize(320, 240);

            expect(cam.setSize).toHaveBeenCalledWith(320, 240);
        });
    });
});
