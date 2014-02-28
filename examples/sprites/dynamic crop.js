
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('trsi', 'assets/pics/trsipic1_lazur.jpg');
}

var pic;
var cropRect;

function create() {

    pic = game.add.sprite(0, 0, 'trsi');

    cropRect = {x : 0, y : 0 , width : 128, height : 128};
}

function update() {

    if(game.input.x < pic.width && game.input.y < pic.height){

        pic.x = game.input.x;
        pic.y = game.input.y;

        cropRect.x = game.input.x;
        cropRect.y = game.input.y;

        pic.crop(cropRect);

        

    }

    

}

function render() {

    game.debug.renderText('x: ' + game.input.x + ' y: ' + game.input.y, 32, 32);

}
