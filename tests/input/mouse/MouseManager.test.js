var EventEmitter3 = require('eventemitter3');
var MouseManager = require('../../../src/input/mouse/MouseManager');

describe('MouseManager', function ()
{
    var addEventListener;
    var manager;
    var mouse;
    var target;

    function createMockManager (canvas)
    {
        return {
            canvas: canvas,
            enabled: true,
            events: new EventEmitter3(),
            game: {
                config: {
                    autoFocus: false,
                    inputWindowEvents: false
                }
            },
            onMouseDown: vi.fn(),
            onMouseMove: vi.fn(),
            onMouseUp: vi.fn(),
            onMouseWheel: vi.fn(),
            onPointerLockChange: vi.fn(),
            setCanvasOut: vi.fn(),
            setCanvasOver: vi.fn()
        };
    }

    beforeEach(function ()
    {
        target = document.createElement('canvas');
        addEventListener = vi.spyOn(target, 'addEventListener');
        manager = createMockManager(target);
        mouse = new MouseManager(manager);
        mouse.target = target;
        mouse.startListeners();
    });

    afterEach(function ()
    {
        mouse.stopListeners();
        vi.restoreAllMocks();
    });

    describe('stopListeners', function ()
    {
        it('should remove the wheel listener from the target', function ()
        {
            var onMouseWheel = mouse.onMouseWheel;
            var removeEventListener = vi.spyOn(target, 'removeEventListener');

            expect(addEventListener).toHaveBeenCalledWith('wheel', onMouseWheel, { passive: true });

            target.dispatchEvent(new Event('wheel'));

            expect(manager.onMouseWheel).toHaveBeenCalledTimes(1);

            mouse.stopListeners();
            target.dispatchEvent(new Event('wheel'));

            expect(manager.onMouseWheel).toHaveBeenCalledTimes(1);
            expect(removeEventListener).toHaveBeenCalledWith('wheel', onMouseWheel);
        });
    });
});
