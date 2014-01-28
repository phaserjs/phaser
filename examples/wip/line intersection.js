
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

}

var lineA1;
var lineA2;
var lineB1;
var lineB2;


function create() {

    game.stage.backgroundColor = '#124184';

    lineA1 = game.add.sprite(100, 100, 'balls', 0);
    lineA1.inputEnabled = true;
    lineA1.input.enableDrag(true);

    lineA2 = game.add.sprite(400, 300, 'balls', 0);
    lineA2.inputEnabled = true;
    lineA2.input.enableDrag(true);

    lineB1 = game.add.sprite(300, 300, 'balls', 1);
    lineB1.inputEnabled = true;
    lineB1.input.enableDrag(true);

    lineB2 = game.add.sprite(500, 500, 'balls', 1);
    lineB2.inputEnabled = true;
    lineB2.input.enableDrag(true);


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

//---------------------------------------------------------------
//Checks for intersection of Segment if as_seg is true.
//Checks for intersection of Line if as_seg is false.
//Return intersection of Segment AB and Segment EF as a Point
//Return null if there is no intersection
//---------------------------------------------------------------


//  a, b, e, f = point
//  as_seg = bool (true)
//  returns point

//  Adapted from code by Keith Hair
function lineIntersectLine(A, B, E, F, as_seg) {

    var ip = { x: 0, y: 0 };
    var a1 = B.y - A.y;
    var a2 = F.y - E.y;
    var b1 = A.x - B.x;
    var b2 = E.x - F.x;
    var c1 = (B.x * A.y) - (A.x * B.y);
    var c2 = (F.x * E.y) - (E.x * F.y);
    var denom = (a1 * b2) - (a2 * b1);

    if (denom === 0)
    {
        return null;
    }

    ip.x = ((b1 * c2) - (b2 * c1)) / denom;
    ip.y = ((a2 * c1) - (a1 * c2)) / denom;
 
    //---------------------------------------------------
    //Do checks to see if intersection to endpoints
    //distance is longer than actual Segments.
    //Return null if it is with any.
    //---------------------------------------------------
    if (as_seg)
    {
        if (Math.pow((ip.x - B.x) + (ip.y - B.y), 2) > Math.pow((A.x - B.x) + (A.y - B.y), 2))
        {
            return null;
        }

        if (Math.pow((ip.x - A.x) + (ip.y - A.y), 2) > Math.pow((A.x - B.x) + (A.y - B.y), 2))
        {
            return null;
        }

        if (Math.pow((ip.x - F.x) + (ip.y - F.y), 2) > Math.pow((E.x - F.x) + (E.y - F.y), 2))
        {
            return null;
        }

        if (Math.pow((ip.x - E.x) + (ip.y - E.y), 2) > Math.pow((E.x - F.x) + (E.y - F.y), 2))
        {
            return null;
        }
    }

    return ip;

}
 


var c = 'rgb(255,255,255)';
var p = new Phaser.Point();

function update() {

    p = lineIntersectLine(lineA1.center, lineA2.center, lineB1.center, lineB2.center, true);

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

    game.context.strokeStyle = c;

    game.context.beginPath();
    game.context.moveTo(lineA1.center.x, lineA1.center.y);
    game.context.lineTo(lineA2.center.x, lineA2.center.y);
    game.context.closePath();
    game.context.stroke();

    game.context.beginPath();
    game.context.moveTo(lineB1.center.x, lineB1.center.y);
    game.context.lineTo(lineB2.center.x, lineB2.center.y);
    game.context.closePath();
    game.context.stroke();

    if (p)
    {
        game.context.fillStyle = 'rgb(255,0,255)';
        game.context.fillRect(p.x - 2, p.y - 2, 5, 5);
        game.debug.renderPointInfo(p, 32, 32);
    }



}