var Camera = require('../../../src/cameras/2d/Camera');

describe('Camera', function ()
{
    it('should be importable', function ()
    {
        expect(Camera).toBeDefined();
    });

    describe('worldView', function ()
    {
        function makeCamera (originX, originY, zoom)
        {
            var camera = new Camera(0, 0, 800, 600);

            camera.setOrigin(originX, originY);
            camera.setZoom(zoom);
            camera.setScroll(100, 50);
            camera.preRender();

            return camera;
        }

        function screenToWorld (camera, x, y)
        {
            var point = camera.matrix.applyInverse(x, y);

            return { x: point.x, y: point.y };
        }

        it('should be centered on the camera with the default origin', function ()
        {
            var camera = makeCamera(0.5, 0.5, 2);

            expect(camera.worldView.x).toBe(300);
            expect(camera.worldView.y).toBe(200);
            expect(camera.worldView.width).toBe(400);
            expect(camera.worldView.height).toBe(300);
        });

        it('should match the area the camera renders when the origin is not centered', function ()
        {
            var origins = [ [ 0, 0 ], [ 1, 1 ], [ 0.25, 0.75 ] ];

            for (var i = 0; i < origins.length; i++)
            {
                var camera = makeCamera(origins[i][0], origins[i][1], 3);
                var topLeft = screenToWorld(camera, 0, 0);
                var bottomRight = screenToWorld(camera, 800, 600);

                expect(camera.worldView.x).toBeCloseTo(topLeft.x);
                expect(camera.worldView.y).toBeCloseTo(topLeft.y);
                expect(camera.worldView.right).toBeCloseTo(bottomRight.x);
                expect(camera.worldView.bottom).toBeCloseTo(bottomRight.y);
            }
        });
    });
});
