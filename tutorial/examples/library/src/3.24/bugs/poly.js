var PolygonGame = new Phaser.Class({
    Extends: Phaser.scene,
    initialize: function PolygonGame() {
        Phaser.Scene.call(this, { key: 'polygongame' })
    },
    create: function () {
        
        console.log('create');

        this.polygons = [];
        this.player;
        this.score = 0;
        scene = this;
        this.isGameOver = false;
        this.displayHud();
        this.createPlayer();
        this.polygons.push(this.createPolygon());
        scene = this.scene;
        this.matter.world.on('collisionstart', function (event) {
            this.isGameOver = true;
        }, this)

        this.sys.events.once('shutdown', this.shutdown, this);
       
    },

    displayHud: function () {
        var scene = this;
        var info = this.add.text(10, 10, 'Score: 0');
        this.events.on('addScore', function () {
            console.log('addScore');
            scene.score += 1;
            info.setText('Score: ' + this.score);
        }, this);
    },

    createPolygon: function () {
        var multiplier = 30;
        var rotationPosibilities = [0, 90, 280]
        vert = [{ x: 0 * multiplier, y: 0 * multiplier },
        { x: 15 * multiplier, y: 30 * multiplier },
        { x: 50 * multiplier, y: 30 * multiplier },
        { x: 65 * multiplier, y: 0 * multiplier },
        { x: 50 * multiplier, y: -30 * multiplier },
        { x: 15 * multiplier, y: -30 * multiplier },
        { x: 20 * multiplier, y: -25 * multiplier },
        { x: 45 * multiplier, y: -25 * multiplier },
        { x: 58 * multiplier, y: 0 * multiplier },
        { x: 47 * multiplier, y: 23 * multiplier },
        { x: 18 * multiplier, y: 23 * multiplier },
        { x: 7 * multiplier, y: 0 * multiplier },
        ];
        var polygonBody = this.add.polygon(
            game.config.width / 2, 
            game.config.height / 2, 
            vert, 
            0x0000ff
        );
        var polygon = this.matter.add.gameObject(polygonBody,
            {
                shape: { type: 'fromVerts', verts: vert },
                render: { sprite: { xOffset: 0, yOffset: -0.5 } },
                isSensor: true
            });
        polygon.rotation = rotationPosibilities[Math.floor(Math.random() * Math.floor(4))]
        polygon.absoluteScale = 1;
        return polygon;
    },

    createPlayer: function () {
        var player = this.add.circle(game.config.width / 2, game.config.height / 2, 20, 0x6666ff)
        this.matter.add.gameObject(player, { isSensor: true });
        this.input.on('pointermove', function (pointer) {
            var center = new Phaser.Math.Vector2(game.config.width / 2, game.config.height / 2)
            var position = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY)
                .subtract(center)
                .normalize()
                .scale(100)
                .add(center)
            player.setPosition(position.x, position.y)
        });
    },

    shutdown: function ()
    {
        this.events.off('addScore');
    },

    update: function () {
        if (this.isGameOver)
        {
            console.log('restart');
            this.scene.restart();
            return;
        }

        this.events.emit('addScore');
        scene = this;
        scene.polygons.forEach((polygon, index, object) => {
            polygon.setScale(polygon.absoluteScale);
            polygon.absoluteScale -= 0.004;
            polygon.rotation += 0.01;


            if (polygon.scaleX <= 0) {
                object.splice(index, 1)
                polygon.destroy()
            }
            if (scene.polygons.length < 2 && polygon.scaleX < 0.5) {
                scene.polygons.push(this.createPolygon(scene));
            }
        });
    },
})

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0
            },
            debugShowInternalEdges: true,
            debug: true,
            debugShowConvexHulls: true
        }
    },
    scene: PolygonGame
};

var game = new Phaser.Game(config);
