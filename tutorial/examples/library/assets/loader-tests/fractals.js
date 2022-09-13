/**
 * @author       delimitry
 * @author       Richard Davey <rich@photonstorm.com>
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

function drawMandelbrot (canvas, context, maxIterations)
{
    var cw = canvas.width;
    var ch = canvas.height;
    var imageData = context.createImageData(cw, ch);
    var data = imageData.data;

    for (var i = 0; i < ch; i++)
    {
        for (var j = 0; j < cw; j++)
        {
            // limit the axis
            var x0 = -2 + j * 3 / cw; // (-2, 1)
            var y0 = -1 + i * 2 / ch; // (-1, 1)

            var x = 0;
            var y = 0;
            var iteration = 0;

            while ((x * x + y * y < 4) && (iteration < maxIterations))
            {
                var xN = x * x - y * y + x0;
                var yN = 2 * x * y + y0;
                x = xN;
                y = yN;
                iteration++;
            }

            // set pixel color [r,g,b,a]
            data[i * cw * 4 + j * 4 + 0] = iteration * 15;
            data[i * cw * 4 + j * 4 + 1] = iteration * 3;
            data[i * cw * 4 + j * 4 + 2] = iteration * 5;
            data[i * cw * 4 + j * 4 + 3] = 255;
        }       
    }

    context.putImageData(imageData, 0, 0); 
}

function drawJulia (canvas, context, maxIterations)
{
    var cw = canvas.width;
    var ch = canvas.height;
    var imageData = context.createImageData(cw, ch);
    var data = imageData.data;

    var x0 = -0.4;
    var y0 = -0.6;

    for (var i = 0; i < ch; i++)
    {
        for (var j = 0; j < cw; j++)
        {
            // limit the axis
            var x = -1.5 + j * 3.0 / cw;
            var y = -1.0 + i * 2.0 / ch;
            
            var iteration = 0;
            
            while ((x * x + y * y < 4) && (iteration < maxIterations))
            {
                var xN = x * x - y * y + x0;
                var yN = 2 * x * y + y0;
                x = xN;
                y = yN;
                iteration++;
            }
            
            // set pixel color [r,g,b,a]
            data[i * cw * 4 + j * 4 + 0] = iteration * 8;
            data[i * cw * 4 + j * 4 + 1] = iteration * 5;
            data[i * cw * 4 + j * 4 + 2] = iteration * 25;
            data[i * cw * 4 + j * 4 + 3] = 255;
        }       
    }

    context.putImageData(imageData, 0, 0);
}

function drawBurningShipFractal (canvas, context, maxIterations)
{
    var cw = canvas.width;
    var ch = canvas.height;
    var imageData = context.createImageData(cw, ch);
    var data = imageData.data;

    for (var i = 0; i < ch; i++)
    {
        for (var j = 0; j < cw; j++)
        {
            var x0 = -1.80 + j * (-1.7 + 1.80) / cw;
            var y0 = -0.08 + i * (0.01 + 0.08) / ch;
            var x = 0;
            var y = 0;
            var iteration = 0;

            while ((x * x + y * y < 4) && (iteration < maxIterations))
            {
                var xN = x * x - y * y + x0;
                var yN = 2 * Math.abs(x * y) + y0;
                x = xN;
                y = yN;
                iteration++;
            }
            
            // set pixel color [r,g,b,a]
            data[i * cw * 4 + j * 4 + 0] = 25 + iteration * 30;
            data[i * cw * 4 + j * 4 + 1] = 25 + iteration * 10;
            data[i * cw * 4 + j * 4 + 2] = 85 - iteration * 5;
            data[i * cw * 4 + j * 4 + 3] = 255;
        }       
    }

    context.putImageData(imageData, 0, 0);
}
