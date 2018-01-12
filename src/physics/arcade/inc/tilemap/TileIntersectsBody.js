var TileIntersectsBody = function (tileWorldRect, body)
{
    if (body.isCircle)
    {
        return false;
    }
    else
    {
        return !(
            body.right <= tileWorldRect.left ||
            body.bottom <= tileWorldRect.top ||
            body.position.x >= tileWorldRect.right ||
            body.position.y >= tileWorldRect.bottom
        );
    }
};

module.exports = TileIntersectsBody;
