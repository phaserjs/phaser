var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var arrow;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('arrow', 'assets/sprites/longarrow-white.png');
}

function create ()
{
    //  The code isn't too important for this example
    //  What we're showing here is the angles, in degrees and radians,
    //  that a Phaser sprite uses when rotating.
    //  
    //  You can rotate a sprite by setting either property.
    //  
    //  `angle` is in degrees, from -180 to 180.
    //  `rotation` is in radians, from -PI to PI
    //  
    //  For example:
    //  
    //  sprite.angle = 45
    //  
    //  is the same as:
    //  
    //  sprite.rotation = 0.785

    var labelStyle = { font: "16px courier", fill: "#00ff00", align: "center" };

    //  Create a large circle, then draw the angles on it

    var circle = new Phaser.Geom.Circle(400, 300, 225);
    var labelCircle = new Phaser.Geom.Circle(400, 300, 265);

    var graphics = this.add.graphics();

    graphics.lineStyle(2, 0x00bb00, 1);

    graphics.strokeCircleShape(circle);
    
    graphics.beginPath();

    for (var a = 0; a < 360; a += 22.5)
    {
        graphics.moveTo(400, 300);

        var p = Phaser.Geom.Circle.CircumferencePoint(circle, Phaser.Math.DegToRad(a));

        graphics.lineTo(p.x, p.y);

        var lp = Phaser.Geom.Circle.CircumferencePoint(labelCircle, Phaser.Math.DegToRad(a));

        var na = a;

        if (a > 180)
        {
            na -= 360;
        }

        var rads = String(Phaser.Math.DegToRad(na)).substr(0, 5);
        var info = na + "°\n" + rads;
        var label = this.add.text(lp.x, lp.y, info, labelStyle).setOrigin(0.5);
    }
    
    graphics.strokePath();

    arrow = this.add.sprite(400, 300, 'arrow').setOrigin(0, 0.5);

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#ffffff' });
}

function update ()
{
    arrow.angle += 0.2;

    text.setText([
        'Sprite Rotation',
        'Angle: ' + arrow.angle.toFixed(2),
        'Rotation: ' + arrow.rotation.toFixed(2)
    ]);
}
