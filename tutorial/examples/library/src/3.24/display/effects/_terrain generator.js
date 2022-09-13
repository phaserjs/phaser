// <canvas id="landscape" width="1200" height="800">
// <canvas id="cols" width="1000" height="80" style="display: block">

// --------------------------------------------------------------------
// JavaScript Fractal Terrain Generator
// (C) 2016-2017 Aiden, Mark, and Nick Waterman
// Credit where credit is due - if you borrow any of this code, please
// link back to the original at http://noseynick.net/files/terrain.html
// --------------------------------------------------------------------

// First, generate the gradient for the
// deep/sea/beach/lowland/highland/peak colours:
var cols = document.getElementById("cols");
var col_ctx = cols.getContext("2d");

var grd = col_ctx.createLinearGradient(0,0, cols.width,0);
grd.addColorStop(0.00, '#004'); // depths
grd.addColorStop(0.45, '#04f'); // sea
grd.addColorStop(0.48, '#fff'); // waves
grd.addColorStop(0.50, '#dd0'); // sand
grd.addColorStop(0.51, '#040'); // greens
grd.addColorStop(0.60, '#2b0'); // greens
grd.addColorStop(0.66, '#640'); // browns
grd.addColorStop(0.72, '#bbb'); // greys
grd.addColorStop(0.79, '#888'); // greys
grd.addColorStop(0.80, '#fff'); // snow
grd.addColorStop(0.99, '#fff'); // snow
grd.addColorStop(0.99, '#876'); // edges
grd.addColorStop(1.00, '#876'); // edges
col_ctx.fillStyle = grd;
col_ctx.fillRect(0, 0, cols.width, cols.height);

// And add shadows, with depth!
grd = col_ctx.createLinearGradient(0,0, 0,cols.height);
grd.addColorStop(0.00, 'rgba(255,255,255, 1.0)'); // lit up
grd.addColorStop(0.50, 'rgba(0,0,0,       0.0)'); // start of shadow
grd.addColorStop(0.53, 'rgba(0,0,0,       0.6)'); // start of shadow
grd.addColorStop(0.85, 'rgba(0,0,0,       0.8)'); // deepest shadow
col_ctx.fillStyle = grd;
col_ctx.fillRect(0, 0, cols.width, cols.height);

// Now read it all back into a 2D array of fillStyles:
var coltab = new Array(cols.width+1);
for (var cx = 0; cx <= cols.width; cx++) {
  coltab[cx] = new Array(cols.height+1);
  for (var cy = 0; cy <= cols.height; cy++) {
    var data = col_ctx.getImageData(cx,cy, 1,1).data;
    col_ctx.fillStyle = "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")";
    coltab[cx][cy] = col_ctx.fillStyle;
  }
}


// Next, populate the landscape canvas:
var canvas = document.getElementById("landscape");
var ctx = canvas.getContext("2d");
var width = 256; // must be a power of 2
var stars = 100; // can be any number

// create 2d arrays of width x width, one for land, one for colours
var land = [], colx = [];
for (i=0; i<=width; i++) {
  land.push(new Array(width+1));
  colx.push(new Array(width+1));
}
// and arrays for star coords:
var starx = new Array(stars);
var stary = new Array(stars);
var int = Math.floor;
var totalTime = 0;

generate();    // generate the landscape
var sunht = 0; // sun starts at height 0 (horizon)
draw3d();      // first drawing will also trigger the sunrise

function draw3d () {
  start = new Date().getTime();
  // Clear the background, and draw random stars:
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear
  for (var n=0; n<stars; n++) {
    // The stars are at fixed x/y, but twinkle in brightness
    var c = int(5+rand(5));
    ctx.fillStyle = "#"+c+c+c;
    ctx.fillRect(starx[n],stary[n], 2,2);
  }
  
  origin_x = canvas.width/2;
  origin_y = canvas.height - width*2 - 20;
  for (var lat=0; lat<width; lat++) {
    // some pre-calculations, for speed:
    var ox    = origin_x + lat*2;
    var oy    = origin_y + lat;
    var shadow = land[lat][0];
    for (var lon=1;  lon<width; lon++) {
      var ht = land[lat][lon];
      ctx.fillStyle = coltab
        [colx[lat][lon]]
        [int(limit(0, shadow-ht+cols.height/2, cols.height-1))];
      // Maths for the isometric landscape view:
      ctx.fillRect(ox - lon*2, oy + lon - ht, 2, 10);
      // And drop the shadow. Raise it if we are in the light.
      shadow = shadow - sunht;  if (shadow < ht) { shadow = ht };
    }
  }
  // and the edges:
  for (var lat=0; lat<=width; lat++) {
    // Front Left edge:
    ctx.fillStyle = coltab[995][cols.height-1];
    ctx.fillRect(origin_x + lat*2 - width*2, origin_y + lat + width + 10,
      2, -10-land[lat][width]);
    // Front right edge:
    ctx.fillStyle = coltab[995][cols.height*0.6];
    ctx.fillRect(origin_x + width*2 - lat*2, origin_y +width + lat + 10,
      2, -10-land[width][lat]);
  }
  
  totalTime += new Date().getTime() - start;
  
  // Done drawing. Make the sun rise a bit, and set up the next rendering:
  sunht += 0.1 + (sunht/10.0);
  if (sunht>5) { sunht = 0; generate(); }
  
  setTimeout(draw3d, 200);
}

function generate() {
  // First of all, how long did all the previous sunlight rednderings
  // take, in total?
  if (totalTime) { console.log("Total " + totalTime + "ms"); }
  totalTime = 0;
  
  // Corners start at height -100..+100
  land[0][0]         = noise(100);
  land[width][0]     = noise(100);
  land[0][width]     = noise(100);
  land[width][width] = noise(100);
  
  // Basically we take a 256x256 grid, half it to 128x256, again to 128x128.
  // Then we repeat to 64x64, 32x32, 16x16, 8x8, 4x4, 2x2, 1x1:
  for (var gridsize=width/2; gridsize >= 1; gridsize=int(gridsize/2)) {
    // console.log("Generating with gridsize " + gridsize);
    halflon(gridsize);
    halflat(gridsize);
  }
  // Now pre-calculate the colours:
  for (var lat=0; lat<=width; lat++) {
    for (var lon=0;  lon<=width; lon++) {
      // We are also adding a little more noise to col, looks fluffier.
      // colour based on height, but height min 2px (sea level):
      colx[lat][lon] = limit(0, int(land[lat][lon]*2 + noise(0) + cols.width/2), 980);
      land[lat][lon] = limit(2,     land[lat][lon]   + noise(0), 999);
    }
  }
  
  // And generate random star coords:
  for (var n=0; n<stars; n++) {
    starx[n] = rand(canvas.width);
    stary[n] = rand(canvas.height);
  }
}

function halflon (gridsize) {
  // Generate new points on the longitudinal axis.
  // For each new point we take the average of the grid point to
  // our E and W, and add some proportional "noise" up or down:
  for (var lat=0; lat <= width; lat += gridsize*2) {
    for (var lon=gridsize; lon <= width; lon += gridsize*2) {
      land[lat][lon] = (
        land[lat][lon-gridsize] + 
        land[lat][lon+gridsize] + noise(gridsize*3)
      ) / 2;
    }
  }
}

function halflat (gridsize) {
  // Generate new points on the latitudinal axis.
  // For each new point we take the average of the grid point to
  // our N and S, and add some proportional "noise" up or down:
  for (var lat=gridsize; lat <= width; lat += gridsize*2) {
    for (var lon=0; lon <= width; lon += gridsize) {
      land[lat][lon] = (
        land[lat-gridsize][lon] + 
        land[lat+gridsize][lon] + noise(gridsize*3)
      ) / 2;
    }
  }
}

function limit (min, x, max) {
  return x<min ? min : x>max ? max : x;
}

function rand(max) {
  return Math.random() * max;
}

function noise(max) {
  return rand(max) - rand(max);
}
