/// <reference path="../../Phaser/_definitions.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);
    function preload() {
        game.load.image('ball', 'assets/sprites/shinyball.png');
        game.load.image('carrot', 'assets/sprites/carrot.png');
    }
    var cells;
    var b;
    var c;
    var t;
    var ball;
    var carrot;
    function create() {
        //this.ball = game.add.sprite(0, 0, 'ball');
        carrot = game.add.sprite(300, 50, 'carrot');
        //  N+ motion version
        carrot.body.aabb.drag.setTo(1, 1);
        carrot.body.aabb.bounce.setTo(0.3, 0.3);
        carrot.body.aabb.gravity.setTo(0, 0.3);
        //carrot.body.aabb.bounce.setTo(0.5, 0.5);
        //carrot.body.aabb.drag.x = 50;
        //carrot.body.aabb.drag.y = 50;
        //carrot.body.aabb.velocity.y = 250;
        //this.b = game.add.aabb(game.stage.randomX, 200, 22, 21);
        //this.c = game.add.circle(200, 200, 16);
        //  pos is center, not upper-left
        this.cells = [];
        var tid;
        for(var i = 0; i < 10; i++) {
            if(i % 2 == 0) {
                tid = Phaser.Physics.TileMapCell.TID_CONCAVEpn;
                //tid = Phaser.Physics.TileMapCell.TID_45DEGpn;
                            } else {
                //tid = Phaser.Physics.TileMapCell.TID_CONCAVEnn;
                tid = Phaser.Physics.TileMapCell.TID_45DEGnn;
            }
            //tid = Phaser.Physics.TileMapCell.TID_FULL;
            this.cells.push(game.add.cell(100 + (i * 100), 400, 50, 50, tid));
        }
    }
    function update() {
        /*
        carrot.body.aabb.acceleration.x = 0;
        carrot.body.aabb.acceleration.y = 0;
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
        carrot.body.aabb.acceleration.x = -200;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
        carrot.body.aabb.acceleration.x = 200;
        }
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
        carrot.body.aabb.acceleration.y = -200;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
        carrot.body.aabb.acceleration.y = 200;
        }
        
        carrot.body.aabb.FFupdate();
        
        */
        //  This works but it's a static motion (no easing / acceleration)
        //carrot.body.aabb.velocity.x = 0;
        //carrot.body.aabb.velocity.y = 0;
        /*
        var s = 200;
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
        carrot.body.aabb.velocity.x = -s;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
        carrot.body.aabb.velocity.x = s;
        }
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
        carrot.body.aabb.velocity.y = -s;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
        carrot.body.aabb.velocity.y = s;
        }
        
        carrot.body.aabb.FFupdate();
        
        */
        /*
        
        //  N+ motion - This works but no acceleration and the gravity values are insanely sensitive
        
        carrot.body.aabb._vx = 0;
        carrot.body.aabb._vy = 0;
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
        carrot.body.aabb._vx = -0.2;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
        carrot.body.aabb._vx = 0.2;
        }
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
        carrot.body.aabb._vy = -(0.2 + carrot.body.aabb.gravity.y);
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
        carrot.body.aabb._vy = 0.2;
        }
        
        carrot.body.aabb.update();
        
        */
        //  N+ with Flixel Compute
        carrot.body.aabb.velocity.x = 0;
        carrot.body.aabb.velocity.y = 0;
        var s = 50;
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            carrot.body.aabb.velocity.x = -s;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            carrot.body.aabb.velocity.x = s;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            carrot.body.aabb.velocity.y = -s;
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            carrot.body.aabb.velocity.y = s;
        }
        carrot.body.aabb.update();
        carrot.body.aabb.collideAABBVsWorldBounds();
        for(var i = 0; i < this.cells.length; i++) {
            //this.c.collideCircleVsTile(this.cells[i]);
            //this.b.collideAABBVsTile(this.cells[i]);
            carrot.body.aabb.collideAABBVsTile(this.cells[i]);
        }
        //this.c.collideCircleVsWorldBounds();
        //this.b.collideAABBVsWorldBounds();
        //carrot.body.aabb.collideAABBVsWorldBounds();
        //this.ball.transform.centerOn(this.c.pos.x, this.c.pos.y);
        //this.carrot.transform.centerOn(this.b.pos.x, this.b.pos.y);
            }
    function render() {
        //this.c.render(game.stage.context);
        //this.b.render(game.stage.context);
        carrot.body.aabb.render(game.stage.context);
        for(var i = 0; i < this.cells.length; i++) {
            this.cells[i].render(game.stage.context);
        }
        Phaser.DebugUtils.renderText('dx: ' + carrot.body.aabb._deltaX, 32, 32);
        Phaser.DebugUtils.renderText('dy: ' + carrot.body.aabb._deltaY, 32, 64);
        Phaser.DebugUtils.renderText('vx: ' + carrot.body.aabb.velocity.x, 432, 32);
        Phaser.DebugUtils.renderText('vy: ' + carrot.body.aabb.velocity.y, 432, 64);
        Phaser.DebugUtils.renderText('delta: ' + game.time.delta, 32, 90);
        Phaser.DebugUtils.renderText('phye: ' + game.time.physicsElapsed, 32, 110);
        Phaser.DebugUtils.renderText('vxd: ' + carrot.body.aabb._vx, 32, 130);
        Phaser.DebugUtils.renderText('vyd: ' + carrot.body.aabb._vy, 32, 150);
    }
})();
