//  http://www.crd-sector.com/steve/canvas/frax2.html

var angle = 0;
var step = 1;
var a_data;

function NodeObj() {
    this.height = 0;
    this.colour = "rgb(0,0,0)"
}

function generateLandscape() {
    a_data = new Array(33);
    for (var i=0; i<34; i++) {
        a_data[i] = new Array(33);
            for (var j=0; j<34; j++) {
                a_data[i][j] = new NodeObj();
            }
        
    }

    // Set four corners
    a_data[0][0].height = 0;
    a_data[0][32].height = 0;
    a_data[32][32].height = 0;
    a_data[32][0].height = 0;

    // Populate grid with elevation values
    for (var i=16; i>0; i=Math.floor(i/2)) {

        j = i * 2;

        for (var x=0; x<32; x += j) {
            for (var y=0; y<32; y += j) {
            
                // 4 sides of our square
                s1 = a_data[x+i][y].height = ((a_data[x][y].height + a_data[x+j][y].height) / 2) + (Math.random() * j) - i;
                s2 = a_data[x+j][y+i].height = ((a_data[x+j][y].height + a_data[x+j][y+j].height) / 2) + (Math.random() * j) - i;
                s3 = a_data[x+i][y+j].height = ((a_data[x+j][y+j].height + a_data[x][y+j].height) / 2) + (Math.random() * j) - i;
                s4 = a_data[x][y+i].height = ((a_data[x][y+j].height + a_data[x][y].height) / 2) + (Math.random() * j) - i;

                // Mid point
                a_data[x+i][y+i].height = ((s1 + s2 + s3 + s4) / 4) + (Math.random() * j) - i;
            }
        }
    }

    colourLandscape(step);
}

function colourLandscape(step) {
    
    function sortNumber(a,b) { return a - b; }

    step = Math.round(step);
    if (step < 1) step = 1;

    // Create and populate colour grid
    a_temp = new Array(4);
    for (var i=0; i<33; i+=step) {
        for (var j=0; j<33; j+=step) {

            // Get elevations from four corners
            a_temp[0] = a_data[i][j].height;
            a_temp[1] = a_data[i][j+1].height;
            a_temp[2] = a_data[i+1][j+1].height;
            a_temp[3] = a_data[i+1][j].height;

            // Sort elevations
            a_temp.sort(sortNumber);

            // If the maximum height is below sea level, colour it a shade of blue dependant on the depth
            if (a_temp[3] < 0) {
                a_data[i][j].colour = 'rgb(0,0,'+Math.floor(192+(a_temp[3] * 8))+')';
            } else {

                // Maximum is at or above sea level.  If the others are below, set the colour to yellow (sand)
                if (a_temp[2] < 0) {
                    a_data[i][j].colour = 'rgb(160,160,64)';
                } else {
                    if (a_temp[3] / step > 16) {
                        temp = Math.min(Math.floor(a_temp[0] * 8) + 50, 255);
                        a_data[i][j].colour = 'rgb('+temp+','+temp+','+temp+')';
                    } else {
                        slope = (a_temp[3] - a_temp[0]) / step;
                        temp = Math.min(Math.floor((slope * 16) + (a_temp[0] * 4)), 155);
                        a_data[i][j].colour = 'rgb('+temp+','+(temp+100)+','+temp+')';
                    }
                }
            }
        }
    }
}

function init() {
    generateLandscape();
    setInterval(draw, 50);
}

function draw() {

    cv = document.getElementById('cv1');
    if (cv) {

        width = cv.width;
        height = cv.height;

        if (cv.getContext){
            ctx = cv.getContext('2d');

            step = Math.round(step);
            if (step < 1) step = 1;

            centreX = Math.floor(width / 2);
            centreY = Math.floor(height / 2);
            scaleX = centreX / 23;
            scaleY = centreY / 23;
            elevationY = scaleY / 2;

            ctx.fillStyle = 'rgb(192,192,192)';
            ctx.fillRect (0, 0, width, height);

            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgb(255,255,255)';

            // Precalculate sine and cosine
            s = Math.sin(angle);
            c = Math.cos(angle);

            // Calculate X and Y offsets for I and J
            deltaIX = -s * scaleX;
            deltaIY = c * scaleY;

            deltaJX = c * scaleX;
            deltaJY = s * scaleY;
            
            // Calculate step values (distances of one displayed grid square)
            stepIX = deltaIX * step;
            stepIY = deltaIY * step;
            stepJX = deltaJX * step;
            stepJY = deltaJY * step;

            // Calculate steps for i and j, ensuring drawing is always from the back to the front
            if (c > 0) {
                startI = -16;
                stepI = step;
                endI = 16;
            } else {
                startI = 16-step;
                stepI = -step;
                endI = -16;
            }
            if (s > 0) {
                startJ = -16;
                stepJ = step;
            } else {
                startJ = 16-step;
                stepJ = -step;
            }

            // Iterate through data
            for (i=startI; (i>-17) && (i<16); i += stepI) {
                for (j=startJ; (j>-17) && (j<16); j += stepJ) {

                    // Calculate four corners
                    x1 = (deltaIX * i) + (deltaJX * j) + centreX;
                    y1 = (deltaIY * i) + (deltaJY * j) + centreY;
                    
                    x2 = x1 + stepJX;
                    y2 = y1 + stepJY;
                    
                    x3 = x2 + stepIX;
                    y3 = y2 + stepIY;
                    
                    x4 = x1 + stepIX;
                    y4 = y1 + stepIY;

                    // Add data
                    y1 -= (Math.max(a_data[i+16][j+16].height, 0) * elevationY);
                    y2 -= (Math.max(a_data[i+16][j+16+step].height, 0) * elevationY);
                    y3 -= (Math.max(a_data[i+16+step][j+16+step].height, 0) * elevationY);
                    y4 -= (Math.max(a_data[i+16+step][j+16].height, 0) * elevationY);

                    ctx.fillStyle = a_data[i+16][j+16].colour;
                    //ctx.fillStyle = 'rgb(128,128,128)';

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.lineTo(x3, y3);
                    ctx.lineTo(x4, y4);
                    ctx.lineTo(x1, y1);
                    ctx.fill();
                    //ctx.stroke();
                    ctx.closePath();
                }

                // Draw end
                if (stepJ > 0) {
                    x1 = (deltaIX * i) + (deltaJX * j) + centreX;
                    y1 = (deltaIY * i) + (deltaJY * j) + centreY;

                    x4 = x1 + stepIX;
                    y4 = y1 + stepIY;
                } else {
                    j -= stepJ;
                    x2 = (deltaIX * i) + (deltaJX * j) + centreX;
                    y2 = (deltaIY * i) + (deltaJY * j) + centreY;

                    x3 = x2 + stepIX;
                    y3 = y2 + stepIY;
                }

                ctx.fillStyle = 'rgb(128,64,64)';
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.lineTo(x4, y4);
                ctx.lineTo(x1, y1);
                ctx.fill();
                ctx.closePath();
            }
            
            // Draw end
            i = endI;
            for (j=startJ; (j>-17) && (j<16); j += stepJ) {

                // Calculate base coordinates for end points
                x1 = (deltaIX * i) + (deltaJX * j) + centreX;
                y1 = (deltaIY * i) + (deltaJY * j) + centreY;

                x2 = x1 + stepJX;
                y2 = y1 + stepJY;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x2, y2 - (Math.max(a_data[i+16][j+16+step].height, 0) * elevationY));
                ctx.lineTo(x1, y1 - (Math.max(a_data[i+16][j+16].height, 0) * elevationY));
                ctx.lineTo(x1, y1);
                ctx.fill();
                ctx.closePath();
            }

            // Rotate landscape
            angle += 0.01;
        }
    }
}
init();
        