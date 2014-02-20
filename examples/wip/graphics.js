var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { create: create, update: update });

var graphics;
var sprite;

function create() {

    graphics = game.add.graphics(0, 0);
    //  we don't need it to render, we're just using it as a texture
    graphics.visible = false;

    // set a fill and line style
    graphics.beginFill(0xFF3300);
    graphics.lineStyle(10, 0xffd900, 1);
    
    // draw a shape
    graphics.moveTo(0,50);
    graphics.lineTo(250, 50);
    graphics.lineTo(100, 100);
    graphics.lineTo(250, 220);
    graphics.lineTo(50, 220);
    graphics.lineTo(0, 50);
    graphics.endFill();
    
    // set a fill and line style again
    graphics.lineStyle(10, 0xFF0000, 0.8);
    graphics.beginFill(0xFF700B, 1);
    
    // draw a second shape
    graphics.moveTo(210,300);
    graphics.lineTo(450,320);
    graphics.lineTo(570,350);
    graphics.lineTo(580,20);
    graphics.lineTo(330,120);
    graphics.lineTo(410,200);
    graphics.lineTo(210,300);
    graphics.endFill();
    
    // draw a rectangle
    graphics.lineStyle(2, 0x0000FF, 1);
    graphics.drawRect(50, 250, 100, 100);
    
    sprite = game.add.sprite(100, 100, graphics.generateTexture());

    // graphics.inputEnabled = true;
    // graphics.events.onInputDown.add(clicked, this);

}

function clicked() {

    console.log('boom');

    // draw a circle
    graphics.lineStyle(0);
    graphics.beginFill(0xFFFF0B, 0.5);
    graphics.drawCircle(470, 200,100);
    
    graphics.lineStyle(20, 0x33FF00);
    graphics.moveTo(30,30);
    graphics.lineTo(600, 300);

}

function update() {



}