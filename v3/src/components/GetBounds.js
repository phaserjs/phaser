var GetBounds = function (transform)
{
    transform.updateAncestors();

    var min = Math.min;
    var max = Math.max;
    var parent = transform.parent;
    var matrix = (parent) ? parent.world : transform.world;

    var bounds = {};

    var frame = transform.gameObject.frame;
    var width = frame ? frame.cutWidth : 0;
    var height = frame ? frame.cutHeight : 0;
    var children = transform.children;

    var x0 = transform._posX + transform._pivotX;
    var y0 = transform._posY + transform._pivotY;
    var x1 = x0 + width;
    var y1 = y0 + height;

    // Apply transformation to every corner of our AABB
    var topLeftX = x0 * matrix.a + y0 * matrix.c + matrix.tx;
    var topLeftY = x0 * matrix.b + y0 * matrix.d + matrix.ty;
    var topRightX = x1 * matrix.a + y0 * matrix.c + matrix.tx;
    var topRightY = x1 * matrix.b + y0 * matrix.d + matrix.ty;
    var bottomLeftX = x0 * matrix.a + y1 * matrix.c + matrix.tx;
    var bottomLeftY = x0 * matrix.b + y1 * matrix.d + matrix.ty;
    var bottomRightX = x1 * matrix.a + y1 * matrix.c + matrix.tx;
    var bottomRightY = x1 * matrix.b + y1 * matrix.d + matrix.ty;

    // Get the minimum bounding rectangle
    var xMin = min(topLeftX, topRightX, bottomLeftX, bottomRightX);
    var xMax = max(topLeftX, topRightX, bottomLeftX, bottomRightX);
    var yMin = min(topLeftY, topRightY, bottomLeftY, bottomRightY);
    var yMax = max(topLeftY, topRightY, bottomLeftY, bottomRightY);

    var index;
    var childBounds;
    var tx;
    var ty;
    var tw;
    var th;
    var length = children.length;

    bounds.x = xMin;
    bounds.y = yMin;
    bounds.width = xMax - xMin;
    bounds.height = yMax - yMin;

    if ((width === 0 || height === 0) && length > 0)
    {
        index = 1;

        // The current game object doesn't have a size so we skip it.
        bounds = children[0].getBounds();
    }

    for (; index < length; ++index)
    {
        childBounds = children[index].getBounds();

        // Wrap around the child bounds
        tx = min(childBounds.x, bounds.x);
        ty = min(childBounds.y, bounds.y);
        tw = max(childBounds.x + childBounds.width, bounds.x + bounds.width) - tx;
        th = max(childBounds.y + childBounds.height, bounds.y + bounds.height) - ty;

        bounds.x = tx;
        bounds.y = ty;
        bounds.width = tw;
        bounds.height = th;
    }

    return bounds;
};

module.exports = GetBounds;
