var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var node0 = [-100, -100, -100];
var node1 = [-100, -100,  100];
var node2 = [-100,  100, -100];
var node3 = [-100,  100,  100];
var node4 = [ 100, -100, -100];
var node5 = [ 100, -100,  100];
var node6 = [ 100,  100, -100];
var node7 = [ 100,  100,  100];
var nodes = [node0, node1, node2, node3, node4, node5, node6, node7];

var edge0  = [0, 1];
var edge1  = [1, 3];
var edge2  = [3, 2];
var edge3  = [2, 0];
var edge4  = [4, 5];
var edge5  = [5, 7];
var edge6  = [7, 6];
var edge7  = [6, 4];
var edge8  = [0, 4];
var edge9  = [1, 5];
var edge10 = [2, 6];
var edge11 = [3, 7];
var edges = [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11];

var graphics;

var t = {
    x: -0.03490658503988659,
    y: 0.05235987755982989,
    z: -0.05235987755982989
};

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics({x: 400, y: 300});

    rotateZ3D(0.5235987755982988);
    rotateY3D(0.5235987755982988);
    rotateX3D(0.5235987755982988);

    TweenMax.to(t, 6, {
        x: 0.03490658503988659,
        ease: Sine.easeInOut,
        repeat: -1,
        yoyo: true
    });

    TweenMax.to(t, 4, {
        y: -0.05235987755982989,
        ease: Sine.easeInOut,
        repeat: -1,
        yoyo: true
    });

    TweenMax.to(t, 8, {
        z: 0.05235987755982989,
        ease: Sine.easeInOut,
        repeat: -1,
        yoyo: true
    });
}

function update ()
{
    rotateX3D(t.x);
    rotateY3D(t.y);
    rotateZ3D(t.z);

    graphics.clear();

    graphics.lineStyle(2, 0x00ff00, 1.0);

    graphics.beginPath();

    for (var e = 0; e < edges.length; e++)
    {
        var n0 = edges[e][0];
        var n1 = edges[e][1];
        var node0 = nodes[n0];
        var node1 = nodes[n1];

        graphics.moveTo(node0[0], node0[1]);
        graphics.lineTo(node1[0], node1[1]);
    }

    graphics.closePath();
    graphics.strokePath();
}

function rotateZ3D (theta)
{
    var ts = Math.sin(theta);
    var tc = Math.cos(theta);
    
    for (var n = 0; n < nodes.length; n++)
    {
        var node = nodes[n];
        var x = node[0];
        var y = node[1];

        node[0] = x * tc - y * ts;
        node[1] = y * tc + x * ts;
    }
}

function rotateY3D (theta)
{
    var ts = Math.sin(theta);
    var tc = Math.cos(theta);
    
    for (var n = 0; n < nodes.length; n++)
    {
        var node = nodes[n];
        var x = node[0];
        var z = node[2];

        node[0] = x * tc - z * ts;
        node[2] = z * tc + x * ts;
    }
}

function rotateX3D (theta)
{
    var ts = Math.sin(theta);
    var tc = Math.cos(theta);
    
    for (var n = 0; n < nodes.length; n++)
    {
        var node = nodes[n];
        var y = node[1];
        var z = node[2];

        node[1] = y * tc - z * ts;
        node[2] = z * tc + y * ts;
    }
}
