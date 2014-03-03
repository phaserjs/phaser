
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

}

var handle1;
var handle2;

var line;
var polygon;

function create() {

    game.stage.backgroundColor = '#124184';

    handle1 = game.add.sprite(100, 150, 'balls', 0);
    handle1.inputEnabled = true;
    handle1.input.enableDrag(true);

    handle2 = game.add.sprite(400, 200, 'balls', 0);
    handle2.inputEnabled = true;
    handle2.input.enableDrag(true);

    line = new Phaser.Line(handle1.x, handle1.y, handle2.x, handle2.y);

    polygon = new SAT.Polygon(new SAT.Vector(300, 300), [new SAT.Vector(0, 50), new SAT.Vector(100, 50), new SAT.Vector(100, 0), new SAT.Vector(150, 0), new SAT.Vector(150, 150), new SAT.Vector(100, 150), new SAT.Vector(100, 100), new SAT.Vector(0, 100), new SAT.Vector(0, 50)]);

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

function lineIntersectPoly(A, B, polygon) {

    var An =1;
    var Bn =1;
    var C = {x: 0, y: 0};
    var D = {x: 0, y: 0};
    var i = {x: 0, y: 0};
    var cx=0;
    var cy=0;
    var result = {};

    var pa = [];

    for (var pi = 0; pi < polygon.points.length; pi++)
    {
        pa.push({ x: polygon.points[pi].x + polygon.pos.x, y: polygon.points[pi].y + polygon.pos.y })
    }
    
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

            D.x = pa[n-1].x || pa[0].x;
            D.y = pa[n-1].y || pa[0].y;

            i=Phaser.Line.intersectsPoints(A,B,C,D);

            if(i != null){
                result.intersections.push(i);
            }
            if(Phaser.Line.intersectsPoints(A,new Phaser.Point(C.x+D.x,A.y),C,D) != null){
                An++;
            }
            if(Phaser.Line.intersectsPoints(B,new Phaser.Point(C.x+D.x,B.y),C,D) != null){
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
    result.centroid=new Phaser.Point(cx/(pa.length-1),cy/(pa.length-1));
    result.intersects = result.intersections.length > 0;
    return result;
}

var c = 'rgb(255,255,255)';
var p = new Phaser.Point();
var result = {};

function update() {

    line.fromSprite(handle1, handle2, true);

    result = lineIntersectPoly(line.start, line.end, polygon);

    handle1.frame = 0;
    handle2.frame = 0;

    if (result.intersects)
    {
        c = 'rgb(0,255,0)';

        if (result.start_inside)
        {
            handle1.frame = 1;
        }

        if (result.end_inside)
        {
            handle2.frame = 1;
        }
    }
    else
    {
        c = 'rgb(255,255,255)';
    }
 
}

function render() {

    game.debug.line(line, c);
    game.debug.lineInfo(line, 32, 32);

    game.debug.polygon(polygon);

    if (result.intersects)
    {
        game.debug.text(result.intersects, 32, 100);

        game.context.fillStyle = 'rgb(255,0,255)';

        for (var i = 0; i < result.intersections.length; i++)
        {
            game.context.fillRect(result.intersections[i].x - 2, result.intersections[i].y - 2, 5, 5);
        }
    }

}