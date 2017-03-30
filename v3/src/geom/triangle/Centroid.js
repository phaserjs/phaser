//  The three medians (the lines drawn from the vertices to the bisectors of the opposite sides)
//  meet in the centroid or center of mass (center of gravity).
//  The centroid divides each median in a ratio of 2:1

var Centroid = function (triangle, out)
{
    if (out === undefined) { out = { x: 0, y: 0 }; }

    out.x = (triangle.x1 + triangle.x2 + triangle.x3) / 3;
    out.y = (triangle.y1 + triangle.y2 + triangle.y3) / 3;

    return out;
};

module.exports = Centroid;
