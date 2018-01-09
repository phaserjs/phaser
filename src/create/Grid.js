/*
import Canvas from 'canvas/Canvas.js';
import GetContext from 'canvas/GetContext.js';

export default function Grid  (
        {
            canvas = undefined,
            width = 256,
            height = width,
            cellWidth = 32,
            cellHeight = cellWidth,
            color1 = '#fff',
            color2 = '#000',
            drawLines = false,
            lineColor = '#ff0000',
            alternate = true,
            resizeCanvas = true,
            clear = true,
            preRender = undefined,
            postRender = undefined
        } = {}
    ) {

    if (!canvas)
    {
        canvas = Canvas(width, height);
        resizeCanvas = false;
        clear = false;
    }
    else
    {
        //  They provided own canvas, so we use its dimensions
        if (!resizeCanvas)
        {
            width = canvas.width;
            height = canvas.height;
        }
    }

    let ctx = GetContext(canvas);

    if (resizeCanvas)
    {
        Resize(canvas, width, height);
    }

    if (clear)
    {
        ctx.clearRect(0, 0, width, height);
    }

    if (drawLines)
    {
        ctx.lineWidth = 1;
        ctx.strokeStyle = lineColor;
    }

    //  preRender Callback?
    if (preRender)
    {
        preRender(canvas, ctx);
    }

    //  Draw the grid cells first (the lines go on top)

    let cx = Math.ceil(width / cellWidth);
    let cy = Math.ceil(height / cellHeight);
    let c = 0;
    let color = color1;

    for (let y = 0; y < cy; y++)
    {
        for (let x = 0; x < cx; x++)
        {
            if (c === 0)
            {
                color = color1;
                c = 1;
            }
            else
            {
                color = color2;
                c = 0;
            }

            if (color)
            {
                ctx.fillStyle = color;
                ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
            }

            if (drawLines)
            {
                //  +- 0.5 because we're using stroke, and will get anti-aliased line strokes without
                let ox = 0.5;
                let oy = 0.5;

                if (x === cx - 1)
                {
                    ox = -0.5;
                }

                if (y === cy - 1)
                {
                    oy = -0.5;
                }

                ctx.strokeRect((x * cellWidth) + ox, (y * cellHeight) + oy, cellWidth, cellHeight);
            }
        }

        if (alternate)
        {
            if (c === 0)
            {
                c = 1;
            }
            else
            {
                c = 0;
            }
        }

    }

    //  postRender Callback?
    if (postRender)
    {
        postRender(canvas, ctx);
    }

    return canvas;

}
*/
