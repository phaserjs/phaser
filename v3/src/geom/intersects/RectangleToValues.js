var RectangleToValues = function (rect, left, right, top, bottom, tolerance)
{
    if (tolerance === undefined) { tolerance = 0; }

    return !(
        left > rect.right + tolerance ||
        right < rect.left - tolerance ||
        top > rect.bottom + tolerance ||
        bottom < rect.top - tolerance
    );
};

module.exports = RectangleToValues;
