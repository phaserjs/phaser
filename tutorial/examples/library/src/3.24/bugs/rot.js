var config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 600,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var labelStyle = { font: "16px courier", fill: "#00ff00", align: "center" };

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

    var circle2 = new Phaser.Geom.Circle(400+800, 300, 225);
    var labelCircle2 = new Phaser.Geom.Circle(400+800, 300, 265);
    var graphics2 = this.add.graphics();

    graphics2.lineStyle(2, 0x00bb00, 1);

    graphics2.strokeCircleShape(circle2);
    
    graphics2.beginPath();

    var convert = function (angle)
    {
        return Math.abs((((angle + 90) % 360) - 360) % 360);
    };

    console.log(convert(0));
    console.log(convert(45));
    console.log(convert(90));
    console.log(convert(135));
    console.log(convert(180));
    console.log(convert(-45));
    console.log(convert(-90));
    console.log(convert(-135));
    console.log(convert(-180));

    for (var a = 0; a < 360; a += 22.5)
    {
        var newa = convert(a);

        graphics2.moveTo(400+800, 300);

        var p = Phaser.Geom.Circle.CircumferencePoint(circle2, Phaser.Math.DegToRad(a));

        graphics2.lineTo(p.x, p.y);

        var lp = Phaser.Geom.Circle.CircumferencePoint(labelCircle2, Phaser.Math.DegToRad(a));

        var rads = String(Phaser.Math.DegToRad(newa)).substr(0, 5);
        var info = newa + "°\n" + rads;
        var label = this.add.text(lp.x, lp.y, info, labelStyle).setOrigin(0.5);
    }
    
    graphics2.strokePath();
}
