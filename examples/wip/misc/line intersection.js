
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

}

var handle1;
var handle2;
var handle3;
var handle4;

var line1;
var line2;

function create() {

    game.stage.backgroundColor = '#124184';

    handle1 = game.add.sprite(100, 200, 'balls', 0);
    handle1.inputEnabled = true;
    handle1.input.enableDrag(true);

    handle2 = game.add.sprite(400, 300, 'balls', 0);
    handle2.inputEnabled = true;
    handle2.input.enableDrag(true);

    handle3 = game.add.sprite(200, 400, 'balls', 1);
    handle3.inputEnabled = true;
    handle3.input.enableDrag(true);

    handle4 = game.add.sprite(500, 500, 'balls', 1);
    handle4.inputEnabled = true;
    handle4.input.enableDrag(true);

    line1 = new Phaser.Line(handle1.x, handle1.y, handle2.x, handle2.y);
    line2 = new Phaser.Line(handle3.x, handle3.y, handle4.x, handle4.y);

}

/*---------------------------------------------------------------------------
Returns an Object with the following properties:
intersects        -Boolean indicating if an intersection exists.
start_inside      -Boolean indicating if Point A is inside of the polygon.
end_inside       -Boolean indicating if Point B is inside of the polygon.
intersections    -Array of intersection Points along the polygon.
centroid          -A Point indicating "center of mass" of the polygon.
 
"pArry" is an Array of Points.
----------------------------------------------------------------------------*/

//  a = point
//  b = point
//  pArry = polygons array

/*
function lineIntersectPoly(A, B, pArry) {

    var An =1;
    var Bn =1;
    var C = {x: 0, y: 0};
    var D = {x: 0, y: 0};
    var i = {x: 0, y: 0};
    var cx=0;
    var cy=0;
    var result = {};

    var pa = pArry.slice(); //Copy to prevent growing points when connecting ends.
        pa.push(pa[0]); //Create line from last Point to beginning Point 

    result.intersects = false;
    result.intersections=[];
    result.start_inside=false;
    result.end_inside=false;    

    var n = pa.length-1;  

    while(n > -1){

        C.x = pa[n].x;
        C.y = pa[n].y;

        if(n > 0){

            cx+=C.x;
            cy+=C.y;                    

            D=Point(pa[n-1])||Point(pa[0]);

            i=lineIntersectLine(A,B,C,D);

            if(i != null){
                result.intersections.push(i);
            }
            if(lineIntersectLine(A,new Point(C.x+D.x,A.y),C,D) != null){
                An++;
            }
            if(lineIntersectLine(B,new Point(C.x+D.x,B.y),C,D) != null){
                Bn++;
            }           
        }
        n--;
    }
    if(An % 2 == 0){
        result.start_inside=true;
    }
    if(Bn % 2 == 0){
        result.end_inside=true;
    }       
    result.centroid=new Point(cx/(pa.length-1),cy/(pa.length-1));
    result.intersects = result.intersections.length > 0;
    return result;
}
*/

var c = 'rgb(255,255,255)';
var p = new Phaser.Point();

function update() {

    line1.fromSprite(handle1, handle2, true);
    line2.fromSprite(handle3, handle4, true);

    p = line1.intersects(line2, true);

    if (p)
    {
        c = 'rgb(0,255,0)';
    }
    else
    {
        c = 'rgb(255,255,255)';
    }
 
}

function render() {

    game.debug.line(line1, c);
    game.debug.line(line2, c);

    game.debug.lineInfo(line1, 32, 32);
    game.debug.lineInfo(line2, 32, 100);

    if (p)
    {
        game.context.fillStyle = 'rgb(255,0,255)';
        game.context.fillRect(p.x - 2, p.y - 2, 5, 5);
    }

}