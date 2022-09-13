var config = {
    type: Phaser.CANVAS,
    width: 160,
    height: 144,
    zoom: 4,
    pixelArt: true,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload () {

    this.load.atlas('nemesis', 'assets/tests/zoom/nemesis.png', 'assets/tests/zoom/nemesis.json');

}

var scene;

var bg1;
var bg2;
var player;
var bullets = [];

var moveH = 0; // 0 = none, -1 = left, 1 = right
var moveV = 0; // 0 = none, -1 = up, 1 = down
var fire = false;
var speed = 2;
var lastFired = 0;
var fireRate = 100;

function create () {

    scene = this;

    bg1 = this.add.image(0, 0, 'nemesis', 'background');
    bg2 = this.add.image(256, 0, 'nemesis', 'background');

    for (var i = 0; i < 32; i++)
    {
        var bullet = this.add.image(0, 0, 'nemesis', 'bullet');
        bullet.visible = false;
        bullets.push(bullet);
    }

    player = this.add.image(32, 64, 'nemesis', 'viper');

    window.addEventListener('keydown', keyDown, true);
    window.addEventListener('keyup', keyUp, true);

}

function keyUp (event) {

    switch (event.keyCode)
    {
        case 38: moveV = 0; break;
        case 40: moveV = 0; break;
        case 37: moveH = 0; break;
        case 39: moveH = 0; break;
        case 32: fire = false;
    }

}

function keyDown (event) {

    //  38 = up, 40 = down
    //  37 = left, 39 = right
    //  32 = space

    switch (event.keyCode)
    {
        case 38: moveV = -1; break;
        case 40: moveV = 1; break;
        case 37: moveH = -1; break;
        case 39: moveH = 1; break;
        case 32: fire = true;
    }

}

function update () {

    scrollBackground();
    movePlayer();
    moveBullets();

    if (fire && Date.now() > lastFired + fireRate)
    {
        fireBullet();
    }

}

function moveBullets () {

    bullets.forEach(function(bullet) {

        if (bullet.visible)
        {
            bullet.x += 4;

            if (bullet.x >= 160)
            {
                bullet.visible = false;
            }
        }

    });

}

function fireBullet () {

    for (var i = 0; i < bullets.length; i++)
    {
        var bullet = bullets[i];

        if (!bullet.visible)
        {
            bullet.x = player.x + 4;
            bullet.y = player.y + 4;
            bullet.visible = true;

            lastFired = Date.now();

            return;
        }
    }

}

function movePlayer () {

    player.x += moveH * speed;
    player.y += moveV * speed;

    if (player.x < 0)
    {
        player.x = 0;
    }
    else if (player.x > 144)
    {
        player.x = 144;
    }

    if (player.y < 8)
    {
        player.y = 8;
    }
    else if (player.y > 116)
    {
        player.y = 116;
    }
}

function scrollBackground () {

    bg1.x -= 1;
    bg2.x -= 1;

    if (bg1.x <= -256)
    {
        bg1.x = bg2.x + 256;
    }
    else if (bg2.x <= -256)
    {
        bg2.x = bg1.x + 256;
    }
    
}
