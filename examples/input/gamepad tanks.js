// Try this demo on Chrome with an XBOX 360 controller.
// Steer with left analog, accelerate/brake with analog triggers,
// fire with A and steer turret with left and right 'bumper' (shoulder) buttons.

EnemyTank = function (index, game, player, bullets) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;

    this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    this.shadow.anchor.setTo(0.5, 0.5);
    this.tank.anchor.setTo(0.5, 0.5);
    this.turret.anchor.setTo(0.3, 0.5);

    this.tank.name = index.toString();
    this.tank.body.immovable = true;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);

    this.tank.angle = game.rnd.angle();

    game.physics.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);

};

EnemyTank.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;

        this.shadow.kill();
        this.tank.kill();
        this.turret.kill();

        return true;
    }

    return false;

};

EnemyTank.prototype.update = function() {

    this.shadow.x = this.tank.x;
    this.shadow.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
    this.turret.rotation = this.game.physics.angleBetween(this.tank, this.player);

    if (this.game.physics.distanceBetween(this.tank, this.player) < 300)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.turret.x, this.turret.y);

            bullet.rotation = this.game.physics.moveToObject(bullet, this.player, 500);
        }
    }

};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload () {

    game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
    game.load.atlas('enemy', 'assets/games/tanks/enemy-tanks.png', 'assets/games/tanks/tanks.json');
    game.load.image('logo', 'assets/games/tanks/logo-gamepad.png');
    game.load.image('bullet', 'assets/games/tanks/bullet.png');
    game.load.image('earth', 'assets/games/tanks/scorched_earth.png');
    game.load.spritesheet('kaboom', 'assets/games/tanks/explosion.png', 64, 64, 23);
    game.load.spritesheet('controller-indicator', 'assets/misc/controller-indicator.png', 16,16);

}

var land;

var shadow;
var tank;
var turret;

var enemies;
var enemyBullets;
var explosions;

var logo;

var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 200;
var nextFire = 0;

var indicator;
var pad1;

var turretOffset = 0;

function create () {

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;

    //  The base of our tank
    tank = game.add.sprite(0, 0, 'tank', 'tank1');
    tank.anchor.setTo(0.5, 0.5);
    tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
    // tank.play('move');

    //  This will force it to decelerate and limit its speed
    tank.body.linearDamping = 0.2;
    tank.body.maxVelocity.setTo(400, 400);
    tank.body.collideWorldBounds = true;

    //  Finally the turret that we place on-top of the tank body
    turret = game.add.sprite(0, 0, 'tank', 'turret');
    turret.anchor.setTo(0.3, 0.5);

    //  The enemies bullet group
    enemyBullets = game.add.group();
    enemyBullets.createMultiple(100, 'bullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);

    //  Create some baddies to waste :)
    enemies = [];

    for (var i = 0; i < 20; i++)
    {
        enemies.push(new EnemyTank(i, game, tank, enemyBullets));
    }

    //  A shadow below our tank
    shadow = game.add.sprite(0, 0, 'tank', 'shadow');
    shadow.anchor.setTo(0.5, 0.5);

    //  Our bullet group
    bullets = game.add.group();
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < 10; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    tank.bringToTop();
    turret.bringToTop();

    logo = game.add.sprite(0, 200, 'logo');
    logo.fixedToCamera = true;

    game.camera.follow(tank);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    pad1 = game.input.gamepad.pad1;
    pad1.addCallbacks(this, {onDown:function(){
        removeLogo();
    }});

    indicator = game.add.sprite(10,10, 'controller-indicator');
    indicator.scale.x = indicator.scale.y = 2;
    indicator.animations.frame = 1;
    indicator.fixedToCamera = true;

    game.input.gamepad.start();

    // showing you can set the deadZone for all pads
    // you can also set it like game.input.gamepad.pad1.deadZone = 0.25
    // default is 0.26 and is sensible enough for an xbox 360 controller as the
    // axes seems to hickup at quite high values at times (your mileage may vary)
    game.input.gamepad.setDeadZones(0.25);
}

function removeLogo () {

    game.input.onDown.remove(removeLogo, this);
    logo.kill();

}

function update () {

    // Pad "connected or not" indicator
    if(game.input.gamepad.supported && game.input.gamepad.active && pad1.connected) {
        indicator.animations.frame = 0;
    } else {
        indicator.animations.frame = 1;
    }

    game.physics.collide(enemyBullets, tank, bulletHitPlayer, null, this);

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemies[i].update();
            game.physics.collide(tank, enemies[i].tank);
            game.physics.collide(bullets, enemies[i].tank, bulletHitEnemy, null, this);
        }
    }

    if (pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.3)
    {
        tank.angle -= 4 * -pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
    }
    if (pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.3)
    {
        tank.angle += 4 * pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
    }

    var rightTriggerValue = pad1.buttonValue(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);
    if(rightTriggerValue && rightTriggerValue > 0) {
        currentSpeed = 300 * rightTriggerValue;
    } else {
        if (currentSpeed > 0)
        {
            currentSpeed -= 4;
        }
    }

    var leftTriggerValue = pad1.buttonValue(Phaser.Gamepad.XBOX360_LEFT_TRIGGER);
    if(leftTriggerValue && leftTriggerValue > 0) {
        currentSpeed = 150 * -leftTriggerValue;
    } else {
        if (currentSpeed < 0)
        {
            currentSpeed += 4;
            currentSpeed = (currentSpeed > 0) ? 0 : currentSpeed;
        }
    }

//    if (currentSpeed > 0)
//    {
        game.physics.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
//    }

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    //  Position all the parts and align rotations
    shadow.x = tank.x;
    shadow.y = tank.y;
    shadow.rotation = tank.rotation;

    turret.x = tank.x;
    turret.y = tank.y;

    if (pad1.isDown(Phaser.Gamepad.XBOX360_LEFT_BUMPER)) {
        turretOffset -= 3;
    }
    if (pad1.isDown(Phaser.Gamepad.XBOX360_RIGHT_BUMPER)) {
        turretOffset += 3;
    }

    turret.rotation = tank.rotation;
    turret.angle += turretOffset;
//    turret.rotation = game.physics.angleToPointer(turret);

    if (pad1.isDown(Phaser.Gamepad.XBOX360_A))
    {
        fire();
    }

}

function bulletHitPlayer (tank, bullet) {

    bullet.kill();

}

function bulletHitEnemy (tank, bullet) {

    bullet.kill();

    var destroyed = enemies[tank.name].damage();

    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstDead();
        explosionAnimation.reset(tank.x, tank.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }

}

function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(turret.x, turret.y);
        bullet.rotation = turret.rotation;
        game.physics.velocityFromAngle(bullet.angle, 1000, bullet.body.velocity);
    }

}
