
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('bullet', 'assets/games/invaders/bullet.png');
    game.load.image('enemyBullet', 'assets/games/invaders/enemy-bullet.png');
    game.load.spritesheet('invader', 'assets/games/invaders/invader32x32x4.png', 32, 32);
    game.load.image('ship', 'assets/games/invaders/player.png');
    game.load.spritesheet('kaboom', 'assets/games/invaders/explode.png', 128, 128);
    game.load.image('starfield', 'assets/games/invaders/starfield.png');
    game.load.image('background', 'assets/games/starstruck/background2.png');

}

var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];

var bob;

function create() {

    $('#step').click(function(){
        console.log('---- STEP', game.stepCount, '-------------------------------');
        game.step();
    });

    game.enableStep();


    //  The scrolling starfield background
    // starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  Our bullet group
    // bullets = game.add.group();
    // bullets.createMultiple(30, 'bullet');
    // bullets.setAll('anchor.x', 0.5);
    // bullets.setAll('anchor.y', 1);
    // bullets.setAll('outOfBoundsKill', true);

    // The enemy's bullets
    // enemyBullets = game.add.group();
    // enemyBullets.createMultiple(30, 'enemyBullet');
    // enemyBullets.setAll('anchor.x', 0.5);
    // enemyBullets.setAll('anchor.y', 1);
    // enemyBullets.setAll('outOfBoundsKill', true);

    //  The hero!
    // player = game.add.sprite(400, 500, 'ship');
    // player.anchor.setTo(0.5, 0.5);

    //  The baddies!
    aliens = game.add.group();

    createAliens();

    //  The score
    // scoreString = 'Score : ';
    // scoreText = game.add.text(10, 10, scoreString + score, { fontSize: '34px', fill: '#fff' });

    //  Lives
    // lives = game.add.group();
    // game.add.text(game.world.width - 100, 10, 'Lives : ', { fontSize: '34px', fill: '#fff' });

    //  Text
    // stateText = game.add.text(game.world.centerX,game.world.centerY,'', { fontSize: '84px', fill: '#fff' });
    // stateText.anchor.setTo(0.5, 0.5);
    // stateText.visible = false;

    // for (var i = 0; i < 3; i++) 
    // {
    //     var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
    //     ship.anchor.setTo(0.5, 0.5);
    //     ship.angle = 90;
    //     ship.alpha = 0.4;
    // }

    //  An explosion pool
    // explosions = game.add.group();
    // explosions.createMultiple(30, 'kaboom');
    // explosions.forEach(setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    // fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function createAliens () {

/*
    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = aliens.create(x * 48, y * 50, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
        }
    }
*/

bob = game.add.sprite(32, 32, 'invader');

            // bob = aliens.create(48, 50, 'invader');

            bob.debug = true;

    aliens.x = 100;
    aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    // var tween = game.add.tween(aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween completes it calls descend, before looping again
    // tween.onComplete.add(descend, this);
}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

console.log('descend');
    aliens.y += 10;

}

function update() {

    // aliens.x += 1;
    bob.body.velocity.x = 100;
    // bob.body.velocity.y = 100;

    //  Scroll the background
    // starfield.tilePosition.y += 2;

    //  Reset the player, then check for movement keys

/*
    player.body.velocity.setTo(0, 0);

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 200;
    }

    //  Firing?
    if (fireButton.isDown)
    {
        fireBullet();
    }

    if (game.time.now > firingTimer)
    {
        enemyFires();
    }

    //  Run collision
    game.physics.collide(bullets, aliens, collisionHandler, null, this);
    game.physics.collide(enemyBullets, player, enemyHitsPlayer, null, this);
*/    

}

/*

function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.content = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstDead();
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.content = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.content = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstDead();
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');

        stateText.content=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.moveToObject(enemyBullet,player,120);
        firingTimer = game.time.now + 2000;
    }

}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //  A new level starts
    
    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;

}

*/

function render() {

    for (var i = 0; i < aliens._container.children.length; i++)
    {
        // game.debug.physicsBody(aliens._container.children[i].body);
    }
 
       game.debug.physicsBody(bob.body);
 
}