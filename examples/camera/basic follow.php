 
 <?php
	$title = "Following the player";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

    var baddie,
        keys=Phaser.Keyboard;

	function preload() {

        game.load.image('background','assets/misc/starfield.jpg');
        game.load.image('ufo','assets/sprites/ufo.png');
        game.load.image('baddie','assets/sprites/space-baddie.png');


	}

    

	function create() {

		game.add.tileSprite(0, 0, 2000, 2000, 'background');

        game.world.setBounds(1400,1400);

        for(var i=0,nb=10;i<nb;i++){

            game.add.sprite(game.world.randomX,game.world.randomY,'ufo');
        }

        baddie=game.add.sprite(150,320,'baddie');

        game.camera.follow(baddie);

	}

	function update() {

		baddie.body.velocity.x=baddie.body.velocity.y=0;


        if(game.input.keyboard.isDown(keys.LEFT) && !game.input.keyboard.isDown(keys.RIGHT)){
            
            baddie.body.velocity.x=-155;
            
        }
        else if(game.input.keyboard.isDown(keys.RIGHT) && !game.input.keyboard.isDown(keys.LEFT)){
            baddie.body.velocity.x=155;

        }
        else if(game.input.keyboard.isDown(keys.UP) && !game.input.keyboard.isDown(keys.DOWN)){
            
            baddie.angle=90;
            baddie.body.velocity.y=-155;
            
        }
        else if(game.input.keyboard.isDown(keys.DOWN) && !game.input.keyboard.isDown(keys.UP)){
            baddie.angle=90;
            baddie.body.velocity.y=155;
        }
	}

})();

</script>

<?php
	require('../foot.php');
?>
