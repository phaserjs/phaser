// mods by Patrick OReilly
// twitter: @pato_reilly

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('background','assets/misc/starfield.jpg');
    game.load.image('player','assets/sprites/phaser-dude.png');
    game.load.image('analog', 'assets/tests/fusia.png');
    game.load.image('arrow', 'assets/sprites/longarrow2.png');

}

var player;
var cursors;
var arrow;
var catchFlag = false;
var launchVelocity = 0;

function create() {
    
    game.world.setBounds(0, 0, 3400, 1000);
    game.add.tileSprite(0, 0, 3400, 1000, 'background');
    
    analog = game.add.sprite(200, 450, 'analog');
    analog.width = 8;
    analog.rotation = 220;
    analog.alpha = 0;
    analog.anchor.setTo(0.5, 0.0);
    
    arrow = game.add.sprite(200, 450, 'arrow');
    arrow.anchor.setTo(0.1, 0.5);
    arrow.alpha = 0;

    player = game.add.sprite(150, 320, 'player');

    game.physics.enable([player], Phaser.Physics.ARCADE);

    player.anchor.setTo(0.5, 0.5);
    player.body.collideWorldBounds = true;
    player.body.bounce.setTo(0.9, 0.9);
    player.body.linearDamping = 0.2;

    // Enable input.
    player.inputEnabled = true;
    player.input.start(0, true);
    player.events.onInputDown.add(set);
    player.events.onInputUp.add(launch);
    
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);

}

function set(player,pointer) {

    catchFlag = true;
    game.camera.follow(null);
    
    player.body.velocity.setTo(0, 0);
    arrow.reset(player.x, player.y);
    analog.reset(player.x, player.y);

}

function launch() {

    catchFlag = false;
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);
    
    arrow.alpha = 0;
    analog.alpha = 0;
    Xvector = (arrow.x - player.x) * 4.1;
    Yvector = (arrow.y - player.y) * 4.1;
    player.body.velocity.setTo(Xvector,Yvector);

}

function update() {

    arrow.rotation = game.physics.arcade.angleBetween(arrow, player);
    
    if (catchFlag == true)
    {
        //  Track the ball sprite to the mouse  
        player.x = game.input.activePointer.worldX; 
        player.y = game.input.activePointer.worldY;
        
        arrow.alpha = 1;    
        analog.alpha = 0.5;
        analog.rotation = arrow.rotation - 3.14 / 2;
        analog.height = game.physics.arcade.distanceBetween(arrow, player);    
        launchVelocity = analog.height;
    }

}

function render() {

    game.debug.text("Drag the sprite and release to launch", 32, 32, 'rgb(0,255,0)');
    game.debug.cameraInfo(game.camera, 32, 64);
    game.debug.spriteCoords(player, 32, 150);
    game.debug.text("Launch Velocity: " + parseInt(launchVelocity), 550, 32, 'rgb(0,255,0)');

}
