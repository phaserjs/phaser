
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update:update, render:render  });

var sprite, spriteB ;
var counter = 0 ;
var step = Math.PI * 2 / 360 ;


function preload() {

    // Load images to use as the game sprites
    game.load.image('sprite', 'assets/sprites/phaser2.png');

}

function create() {

    // Create sprite and put it in the middle of the stage
    sprite = game.add.sprite(0, 0, 'sprite');
    sprite.alpha = 0.5 ;
    sprite.x = game.width / 2 ;
    sprite.anchor.x = sprite.anchor.y = 0.5 ;

}

function update()
{
    // Move sprite up and down smoothly for show
    var tStep = Math.sin( counter ) ;
    sprite.y = (game.height/2) + tStep * 30 ;
    sprite.rotation += Phaser.Math.degToRad( 0.1 * tStep ) ;
    counter += step ;
}

function render() {

    // Camera
    game.debug.cameraInfo(game.camera, 32, 32);

}
