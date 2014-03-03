var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('arrow', 'assets/sprites/arrow.png');

}

var sprite;

var setGravityToPointXY = function(game,sprite,power, radiusLow,radiusHigh,pointX,pointY){
    var pointXY = new Phaser.Point(pointX,pointY);
    var tempDistance = Phaser.Point.distance(sprite,pointXY);
    if(tempDistance>radiusLow&&tempDistance<radiusHigh){
        var rotation = game.physics.angleBetween(sprite,pointXY);
        //console.log(" ROTATION " + rotation);
        sprite.body.gravity.y = Math.round(Math.sin(rotation)*1000)/1000 * (power);
        sprite.body.gravity.x = Math.round(Math.cos(rotation)*1000)/1000 * (power);
    }

};

function create() {

    game.stage.backgroundColor = '#0072bc';

    sprite = game.add.sprite(100, 100, 'arrow');
    sprite.anchor.setTo(0.5, 0.5);
    sprite.body.canSleep = false;

}

function update() {
    setGravityToPointXY(game,sprite,20,-0,8000,100,300);

}

function render() {
    game.debug.bodyInfo(sprite,30,32);
}