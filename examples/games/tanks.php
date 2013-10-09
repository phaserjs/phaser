<?php
	$title = "Tanks";
	require('../head.php');
?>

<script type="text/javascript">

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

	function preload() {

		game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
		game.load.image('bullet', 'assets/sprites/enemy-bullet.png');
		game.load.image('earth', 'assets/games/tanks/scorched_earth.png');
		
	}

	var tank;
	var turret;
	var shadow;

	var currentSpeed = 0;

	var land;

	var cursors;
	var bullets;

	var fireRate = 100;
	var nextFire = 0;

	function create() {

		//	Resize our game world to be a 2000x2000 square
		// game.world.setBounds(-1000, -1000, 2000, 2000);
		game.world.setBounds(0, 0, 1000, 1000);

		console.log(game.world.bounds.right, 'bot', this.game.world.bounds.bottom);
		console.log(game.camera.bounds.right, 'cbot', this.game.camera.bounds.bottom);

		//	Our tiled scrolling background
		land = game.add.tileSprite(0, 0, 800, 600, 'earth');
		land.fixedToCamera = true;

		//	A shadow below our tank
		shadow = game.add.sprite(0, 0, 'tank', 'shadow');
		shadow.anchor.setTo(0.5, 0.5);

		//	The base of our tank
		tank = game.add.sprite(0, 0, 'tank', 'tank1');
		tank.anchor.setTo(0.5, 0.5);
		tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
      	tank.play('move');

      	//	This will force it to decelerate and limit its speed
      	tank.body.drag.setTo(200, 200);
      	tank.body.maxVelocity.setTo(400, 400);
      	tank.body.collideWorldBounds = true;

      	//	Our bullet group
		bullets = game.add.group();
		bullets.createMultiple(50, 'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 0.5);
		bullets.setAll('outOfBoundsKill', true);

		//	Finally the turret that we place on-top of the tank body
		turret = game.add.sprite(0, 0, 'tank', 'turret');
		turret.anchor.setTo(0.5, 0.5);

		game.camera.follow(tank);
		// game.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 400);

		cursors = game.input.keyboard.createCursorKeys();

	}

	function update() {

        if (cursors.left.isDown)
        {
        	tank.angle -= 4;
        }
        else if (cursors.right.isDown)
        {
        	tank.angle += 4;
        }

        if (cursors.up.isDown)
        {
        	//	The speed we'll travel at
        	currentSpeed = 300;
        }
        else
        {
        	if (currentSpeed > 0)
        	{
	        	currentSpeed -= 4;
        	}
        }

    	if (currentSpeed > 0)
    	{
	        game.physics.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);

        	//	Scroll the background (note the negative offset to ensure it moves the direction we're facing, not coming from)
	        // land.tilePosition.x -= (tank.body.velocity.x / 50);
	        // land.tilePosition.y -= (tank.body.velocity.y / 50);
    	}

        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;

        //	Position all the parts and align rotations
		shadow.x = tank.x;
		shadow.y = tank.y;
		shadow.rotation = tank.rotation;

		turret.x = tank.x;
		turret.y = tank.y;

		turret.rotation = game.physics.angleToPointer(turret);

		if (game.input.activePointer.isDown)
		{
			//	Boom!
			fire();
		}

	}

	function fire() {

		if (game.time.now > nextFire && bullets.countDead() > 0)
		{
			nextFire = game.time.now + fireRate;

			var bullet = bullets.getFirstDead();

			bullet.reset(turret.x, turret.y);

			game.physics.moveToPointer(bullet, 1000);
		}

	}

	function render() {

        // game.debug.renderText('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);

        // game.debug.renderText('sr: ' + tank.body.right, 32, 100);
        // game.debug.renderText('sb: ' + tank.body.bottom, 32, 132);

        game.debug.renderSpriteCorners(tank, true, true);

        game.debug.renderCameraInfo(game.camera, 500, 32);
  
        game.debug.renderLocalTransformInfo(tank, 32, 32);
        game.debug.renderWorldTransformInfo(tank, 32, 200);
  
  
        // game.debug.renderSpriteInfo(sprite, 32, 450);

	}

</script>

<?php
	require('../foot.php');
?>