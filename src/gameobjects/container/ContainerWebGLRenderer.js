var GameObject = require('../GameObject');

var ContainerWebGLRenderer = function (renderer, container, interpolationPercentage, camera, parentMatrix)
{
    if (GameObject.RENDER_MASK !== container.renderFlags || (container.cameraFilter > 0 && (container.cameraFilter & camera._id)))
    {
        return;
    }

    var children = container.children;
    var transformMatrix = container.localTransform;
    
    if (parentMatrix === undefined)
    {
        transformMatrix.applyITRS(container.x, container.y, container.rotation, container.scaleX, container.scaleY);
    }
    else
    {
        transformMatrix.loadIdentity();
        transformMatrix.multiply(parentMatrix);
        transformMatrix.translate(container.x, container.y);
        transformMatrix.rotate(container.rotation);
        transformMatrix.scale(container.scaleX, container.scaleY);
    }

    for (var index = 0; index < children.length; ++index)
    {
        children[index].renderWebGL(renderer, children[index], interpolationPercentage, camera, transformMatrix);
    }
};

module.exports = ContainerWebGLRenderer;