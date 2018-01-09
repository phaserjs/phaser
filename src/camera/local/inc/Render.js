var Render = function (renderer, children, interpolation)
{
    var cameras = this.cameras;

    for (var i = 0, l = cameras.length; i < l; ++i)
    {
        var camera = cameras[i];

        camera.preRender();

        renderer.render(this.scene, children, interpolation, camera);
    }
};

module.exports = Render;
