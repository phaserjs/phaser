 
 <?php
    $title = "Follow Styles";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update,render : render });

    var ufo,
        Keys=Phaser.Keyboard,
        speed=4,
        style='default';


    function preload() {

        game.load.image('ground', 'assets/tests/ground-2x.png');
        game.load.image('river', 'assets/tests/river-2x.png');
        game.load.image('sky', 'assets/tests/sky-2x.png');
        game.load.image('cloud0', 'assets/tests/cloud-big-2x.png');
        game.load.image('cloud1', 'assets/tests/cloud-narrow-2x.png');
        game.load.image('cloud2', 'assets/tests/cloud-small-2x.png');
        game.load.image('ufo','assets/sprites/ufo.png');
        game.load.image('baddie','assets/sprites/space-baddie.png');
        game.load.spritesheet('button', 'assets/buttons/follow-style-button.png', 224, 70);


    }

    

    function create() {

        //make the world larger than the actual canvas
        game.world.setSize(1400,1400);

        for(var i=0,nb=10;i<nb;i++){

            game.add.sprite(game.world.randomX,game.world.randomY,'baddie');
        }

        

        // background images
        game.add.sprite(0, 0, 'sky')
            .scrollFactor.setTo(0, 0);
        game.add.sprite(0, 360, 'ground')
            .scrollFactor.setTo(0.5, 0.1);
        game.add.sprite(0, 400, 'river')
            .scrollFactor.setTo(1.3, 0.16);
        game.add.sprite(200, 120, 'cloud0')
            .scrollFactor.setTo(0.3, 0.1);
        game.add.sprite(-60, 120, 'cloud1')
            .scrollFactor.setTo(0.5, 0.1);
        game.add.sprite(900, 170, 'cloud2')
            .scrollFactor.setTo(0.7, 0.1);


        // ufo sprite
        ufo = game.add.sprite(300, 240, 'ufo');


        //registration point
        ufo.anchor.setTo(0.5, 0.5);

        

        game.camera.follow(ufo);

        


        // follow style switch buttons
        btn0 = game.add.button(6, 40, 'button', lockonFollow,this, 0, 0, 0);
        btn1 = game.add.button(6, 120, 'button', platformerFollow,this, 1, 1, 1);
        btn2 = game.add.button(6, 200, 'button', topdownFollow,this, 2, 2, 2);
        btn3 = game.add.button(6, 280, 'button', topdownTightFollow,this, 3, 3, 3);

    }
    function lockonFollow() {
        game.camera.follow(ufo, Phaser.Camera.FOLLOW_LOCKON);
        style = 'STYLE_LOCKON';
    }
    function platformerFollow() {
        game.camera.follow(ufo, Phaser.Camera.FOLLOW_PLATFORMER);
        style = 'STYLE_PLATFORMER';
    }
    function topdownFollow() {
        game.camera.follow(ufo, Phaser.Camera.FOLLOW_TOPDOWN);
        style = 'STYLE_TOPDOWN';
    }
    function topdownTightFollow() {
        game.camera.follow(ufo, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
        style = 'STYLE_TOPDOWN_TIGHT';
    }

    function update() {


        if (game.input.keyboard.isDown(Keys.LEFT)) {
            ufo.x -= speed;
            ufo.angle = -15;
        }
        else if (game.input.keyboard.isDown(Keys.RIGHT)) {
            ufo.x += speed;
            ufo.angle = 15;
        }
        
        else if (game.input.keyboard.isDown(Keys.UP)) {
            ufo.y -= speed;
        }
        else if (game.input.keyboard.isDown(Keys.DOWN)) {
            ufo.y += speed;
        }
        else {
            ufo.angle = 0;
        }
    }


    function render () {

        game.context.fillStyle = '#fff';
        game.context.font="24px Courier";
        game.context.fillText('Click buttons to switch between different styles.', 60, 220);
        game.context.fillText('Current style: ' + style, 60, 250);
    }

})();

</script>

<?php
    require('../foot.php');
?>
