
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'assets/tilemaps/maps/platform.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('platformer_tiles', 'assets/tilemaps/tiles/platformer_tiles.png');
    game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60);
    game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

}

var map;
var layer;
var sprite;
var sprite2;
var balls;

function create() {

    game.stage.backgroundColor = '#124184';

    map = game.add.tilemap('map');

    map.addTilesetImage('platformer_tiles');

    map.setCollisionBetween(21, 53);

    layer = map.createLayer('Tile Layer 1');

    // layer.debug = true;

    // var mapLayer = map.layers[0];



    // var p = [];
    // var direction = 'e';

    // var x = 0;
    // var y = 0;

    // for (var y = 0, h = mapLayer.height; y < h; y++)
    // {
    //     for (var x = 0, w = mapLayer.width; x < w; x++)
    //     {
    //         var tile = mapLayer.data[y][x];

    //         if (tile)
    //         {
    //             if (tile.faceTop)
    //             tile.faceTop = false;
    //             tile.faceBottom = false;
    //             tile.faceLeft = false;
    //             tile.faceRight = false;
    //         }
    //     }
    // }

    // sprite = game.add.sprite(270, 100, 'gameboy', 0);
    // sprite.name = 'red';
    // sprite.body.collideWorldBounds = true;
    // sprite.body.minBounceVelocity = 0.9;
    // sprite.body.bounce.setTo(0.5, 0.9);
    // sprite.body.friction = 0.5;

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
function lineIntersectPoly(A : Point, B : Point, pArry:Array):Object {
    var An:int=1;
    var Bn:int=1;
    var C:Point;
    var D:Point;
    var i:Point;
    var cx:Number=0;
    var cy:Number=0;
    var result:Object = new Object();
    var pa:Array=pArry.slice(); //Copy to prevent growing points when connecting ends.
        pa.push(pa[0]); //Create line from last Point to beginning Point 
    result.intersects = false;
    result.intersections=[];
    result.start_inside=false;
    result.end_inside=false;    
    var n:int=pa.length-1;  
    while(n > -1){
        C=Point(pa[n]);
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
 





function launch() {

    // sprite.body.velocity.x = -200;
    // sprite.body.velocity.y = -200;

    sprite2.body.velocity.x = -200;
    sprite2.body.velocity.y = -200;

}

function update() {

    // game.physics.collide(balls, layer);
    // game.physics.collide(sprite, layer);
    // game.physics.collide(sprite2, layer);
    // game.physics.collide(sprite, sprite2);
 
}

function render() {

    // game.debug.renderBodyInfo(sprite2, 32, 32);
    // game.debug.renderPhysicsBody(sprite2.body);


    // game.debug.renderText(sprite2.body.left, 32, 30);
    // game.debug.renderText(sprite2.body.right, 32, 50);
    // game.debug.renderText(sprite2.body.top, 32, 70);
    // game.debug.renderText(sprite2.body.bottom, 32, 90);

 
    // for (var i = 0; i < balls._container.length; i++)
    // {

    // }

    // if (sprite)
    // {
    //     // game.debug.renderBodyInfo(sprite, 20, 30);
        // game.debug.renderBodyInfo(sprite2, 20, 230);
    // }

}