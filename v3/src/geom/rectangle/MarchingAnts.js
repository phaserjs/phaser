var Perimeter = require('./Perimeter');

//  Return an array of points from the perimeter of the rectangle
//  each spaced out based on the quantity required

//  Add option to set a starting offset?

var MarchingAnts = function (rect, quantity, out)
{
    if (out === undefined) { out = []; }

    var step = Perimeter(rect) / quantity;

    var x = rect.x;
    var y = rect.y;
    var face = 0;

    //  Loop across each face of the rectangle

    for (var i = 0; i < quantity; i++)
    {
        out.push({ x: x, y: y });

        switch (face)
        {
            //  Top face
            case 0:
                x += step;

                if (x >= rect.right)
                {
                    face = 1;
                    y += (x - rect.right);
                    x = rect.right;
                }
                break;

            //  Right face
            case 1:
                y += step;

                if (y >= rect.bottom)
                {
                    face = 2;
                    x -= (y - rect.bottom);
                    y = rect.bottom;
                }
                break;

            //  Bottom face
            case 2:
                x -= step;

                if (x <= rect.left)
                {
                    face = 3;
                    y -= (rect.left - x);
                    x = rect.left;
                }
                break;

            //  Left face
            case 3:
                y -= step;

                if (y <= rect.top)
                {
                    face = 0;
                    y = rect.top;
                }
                break;
        }
    }

    return out;
};

module.exports = MarchingAnts;
