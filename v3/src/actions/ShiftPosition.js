//  Iterate through items changing the position of each element to
//  be that of the element that came before it in the array (or after it if direction = 1)
//  The first items position is set to x/y.

var ShiftPosition = function (items, x, y, direction)
{
    if (direction === undefined) { direction = 0; }

    if (items.length > 1)
    {
        var i;
        var cx;
        var cy;
        var px;
        var py;
        var cur;

        if (direction === 0)
        {
            //  Bottom to Top

            var len = items.length - 1;

            px = items[len].x;
            py = items[len].y;

            for (i = len - 1; i >= 0; i--)
            {
                //  Current item
                cur = items[i];

                //  Get current item x/y, to be passed to the next item in the list
                cx = cur.x;
                cy = cur.y;

                //  Set current item to the previous items x/y
                cur.x = px;
                cur.y = py;

                //  Set current as previous
                px = cx;
                py = cy;
            }

            //  Update the head item to the new x/y coordinates
            items[len].x = x;
            items[len].y = y;
        }
        else
        {
            //  Top to Bottom

            px = items[0].x;
            py = items[0].y;

            for (i = 1; i < items.length; i++)
            {
                //  Current item
                cur = items[i];

                //  Get current item x/y, to be passed to the next item in the list
                cx = cur.x;
                cy = cur.y;

                //  Set current item to the previous items x/y
                cur.x = px;
                cur.y = py;

                //  Set current as previous
                px = cx;
                py = cy;
            }

            //  Update the head item to the new x/y coordinates
            items[0].x = x;
            items[0].y = y;
        }
    }
    else
    {
        items[0].x = x;
        items[0].y = y;
    }

    return items;
};

module.exports = ShiftPosition;
