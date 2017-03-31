//  http://www.blackpawn.com/texts/pointinpoly/

//  points is an array of Point-like objects with public x/y properties
//  returns an array with the same number of elements as the points array
//  each element contains either true or false depending if the point lay in the Triangle or not.

var ContainsArray = function (triangle, points, out)
{
    if (out === undefined) { out = []; }

    var v0x = triangle.x3 - triangle.x1;
    var v0y = triangle.y3 - triangle.y1;

    var v1x = triangle.x2 - triangle.x1;
    var v1y = triangle.y2 - triangle.y1;

    var dot00 = (v0x * v0x) + (v0y * v0y);
    var dot01 = (v0x * v1x) + (v0y * v1y);
    var dot11 = (v1x * v1x) + (v1y * v1y);

    // Compute barycentric coordinates
    var b = ((dot00 * dot11) - (dot01 * dot01));
    var inv = (b === 0) ? 0 : (1 / b);

    var u;
    var v;
    var v2x;
    var v2y;
    var dot02;
    var dot12;

    var x1 = triangle.x1;
    var y1 = triangle.y1;

    for (var i = 0; i < points.length; i++)
    {
        v2x = points[i].x - x1;
        v2y = points[i].y - y1;

        dot02 = (v0x * v2x) + (v0y * v2y);
        dot12 = (v1x * v2x) + (v1y * v2y);

        u = ((dot11 * dot02) - (dot01 * dot12)) * inv;
        v = ((dot00 * dot12) - (dot01 * dot02)) * inv;
    
        out.push(u >= 0 && v >= 0 && (u + v < 1));
    }

    return out;
};

module.exports = ContainsArray;
