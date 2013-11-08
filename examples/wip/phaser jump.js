

    var game = new Phaser.Game(500, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

    function preload() {

        if (game.device.android && game.device.chrome == false){
                game.stage.scaleMode = Phaser.StageScaleMode.EXACT_FIT;
                game.stage.scale.maxIterations = 1;
        }

        game.load.image('dude', 'assets/sprites/phaser-dude.png');
        game.load.image('ground', 'assets/sprites/platform.png');
        game.load.image('break', 'assets/games/breakout/break.png');
        game.load.image('platform','assets/games/breakout/paddle.png');

    }

    var player;
    var platform;
    var pX=[];
    var pY=[];

    var ground,
        score = 0,
        jumpTimer = 0;

    var touched = {left:false,right:false};

    var Keys;

    function create() {

        //Setting up

        game.world.setBounds(0,0,500,1200);

        platform = game.add.group();

        player = game.add.sprite(32, game.world.height-150, 'dude');

        ground = game.add.sprite(0,game.world.height-50,'ground');
        ground.scale.y=2;
        ground.body.immovable=true;


        player.body.bounce.y = 0.5;
        player.body.gravity.y = 6;
        player.events.onOutOfBounds.add(wrapAround,this);

        prev=player;

        for (var i = 0; i < 60; i++) 
        {

            (function (i) {

                var pos = {x:0,y:0};

                pos.x = Math.floor(Math.random()*game.world.width);
                pos.y = Math.floor(Math.random()*game.world.height);

     
            if(Math.random()<0.2)
            {
                 var bar = platform.create(pos.x,pos.y,'break');
                    bar.name="break";
            }
            else 
            {
                var bar = platform.create(pos.x,pos.y,'platform');
                bar.name="standard";
            }
            
            
                bar.body.immovable = true;
                bar.body.allowCollision.down = false;
                bar.body.allowCollision.left = false;
                bar.body.allowCollision.right = false;

                prev=bar;

            })(i);

            
        }

        game.camera.follow(player);

        Keys=game.input.keyboard.createCursorKeys();

        if(!game.device.desktop)
        {
            game.input.onTap.add(gameClicked,this);
        }
        


    }

    function wrapAround () {

        if(player.body.x > game.world.width)
        {
            player.x=0;
        }

        if(player.body.x < player.width)
        {
            player.x=game.world.width;
        }
    }

    function touchPlatform (player,platform) {

        if(platform.name == "break")
        {
            
            platform.kill();
            player.body.velocity.y =- 50;

        }
        else
        {
            player.body.drag.y=1.5;
            player.body.acceleration.y -= 10;
            player.body.velocity.y =- 250;
            score+=game.rnd.integerInRange(3,10);
        }
    }

    function gameClicked() {

        if(game.input.x < game.world.width/2)
        {

           touched.left = true;
        }
        else
        {
           touched.right = true;
        }
    }

    function update() {

        game.physics.collide(player,ground,touchPlatform,null,this);
        game.physics.collide(player,platform,touchPlatform,null,this);

        if(game.device.desktop)
        {

            player.body.velocity.x = 0;
        

            if(Keys.left.isDown)
            {
                player.body.velocity.x =- 100;
            }
            else if(Keys.right.isDown)
            {
                player.body.velocity.x = 100;
            }

        }
        else 
        {

            if(touched.left)
            {

                player.body.velocity.x =- 100;            
                jumpTimer = game.time.now + 500;
                touched.left = false;   
            }
            else if(touched.right)
            {

                player.body.velocity.x = 100;
                touched.right = false;
                
            }

            if(player.body.velocity.x > 0)
            {
                player.body.velocity.x--;
            }
            else if(player.body.velocity.x < 0)
            {
                player.body.velocity.x++;
            }

        }

        


    }

    function render() {
        game.debug.renderText("score : "+score,20,20);
    }