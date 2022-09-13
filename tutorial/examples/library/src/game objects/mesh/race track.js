class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.setPath('assets/obj/racing/');

        this.load.obj('roadStart', 'roadStartPositions.obj', 'roadStartPositions.mtl');
        this.load.obj('roadEnd', 'roadEnd.obj', 'roadEnd.mtl');
        this.load.obj('roadCrossing', 'roadCrossing.obj', 'roadCrossing.mtl');
        this.load.obj('roadCurved', 'roadCurved.obj', 'roadCurved.mtl');
        this.load.obj('roadStraight', 'roadStraight.obj', 'roadStraight.mtl');
        this.load.obj('roadStraightLong', 'roadStraightLong.obj', 'roadStraightLong.mtl');
        this.load.obj('roadStraightArrow', 'roadStraightArrow.obj', 'roadStraightArrow.mtl');
        this.load.obj('roadSplitLarge', 'roadSplitLarge.obj', 'roadSplitLarge.mtl');
        this.load.obj('roadCornerLarge', 'roadCornerLarge.obj', 'roadCornerLarge.mtl');
        this.load.obj('roadCornerLargeBorder', 'roadCornerLargeBorder.obj', 'roadCornerLargeBorder.mtl');
        this.load.obj('roadCornerLargeBorderInner', 'roadCornerLargeBorderInner.obj', 'roadCornerLargeBorderInner.mtl');
    }

    create ()
    {
        const track = this.add.mesh(400, 300);

        const rot90 = Phaser.Math.DegToRad(90);
        const rot180 = Phaser.Math.DegToRad(180);

        //  Add road pieces
        track.addVerticesFromObj('roadStart', 1, 0, 0, 0, rot90, rot180);
        track.addVerticesFromObj('roadStraight', 1, 0, 2, 0, rot90, rot180);
        track.addVerticesFromObj('roadCornerLarge', 1, 0, 3, 0, rot90, rot180);
        track.addVerticesFromObj('roadCornerLargeBorder', 1, 0, 3, 0, rot90, rot180);
        track.addVerticesFromObj('roadCornerLargeBorderInner', 1, 0, 3, 0, rot90, rot180);
        track.addVerticesFromObj('roadStraightLong', 1, 4, 4, 0, rot90, rot180 + rot90);
        track.addVerticesFromObj('roadCornerLarge', 1, 6, 6, 0, rot90, 0);
        track.addVerticesFromObj('roadCornerLargeBorder', 1, 6, 6, 0, rot90, 0);
        track.addVerticesFromObj('roadCornerLargeBorderInner', 1, 6, 6, 0, rot90, 0);
        track.addVerticesFromObj('roadStraightArrow', 1, 5, 6, 0, rot90, rot180);
        track.addVerticesFromObj('roadCurved', 1, 5, 7, 0, rot90, rot180);
        track.addVerticesFromObj('roadCurved', 1, 4.5, 9, 0, rot90, rot180);
        track.addVerticesFromObj('roadCornerLarge', 1, 4, 11, 0, rot90, rot180);
        track.addVerticesFromObj('roadCornerLargeBorder', 1, 4, 11, 0, rot90, rot180);
        track.addVerticesFromObj('roadCornerLargeBorderInner', 1, 4, 11, 0, rot90, rot180);
        track.addVerticesFromObj('roadStraightLong', 1, 8, 12, 0, rot90, rot180 + rot90);
        track.addVerticesFromObj('roadStraightLong', 1, 10, 12, 0, rot90, rot180 + rot90);
        track.addVerticesFromObj('roadStraightLong', 1, 12, 12, 0, rot90, rot180 + rot90);
        track.addVerticesFromObj('roadStraightLong', 1, 14, 12, 0, rot90, rot180 + rot90);
        track.addVerticesFromObj('roadCornerLarge', 1, 14, 13, 0, rot90, rot90);
        track.addVerticesFromObj('roadCornerLargeBorder', 1, 14, 13, 0, rot90, rot90);
        track.addVerticesFromObj('roadCornerLargeBorderInner', 1, 14, 13, 0, rot90, rot90);
        track.addVerticesFromObj('roadStraightLong', 1, 15, 9, 0, rot90, rot180);
        track.addVerticesFromObj('roadStraightLong', 1, 15, 7, 0, rot90, rot180);
        track.addVerticesFromObj('roadSplitLarge', 1, 16, 7, 0, rot90, rot180 + rot180);
        track.addVerticesFromObj('roadEnd', 1, 14, 5, 0, rot90, -rot90);
        track.addVerticesFromObj('roadCurved', 1, 15.5, 3, 0, rot90, rot180);
        track.addVerticesFromObj('roadStraightLong', 1, 15.5, 1, 0, rot90, rot180);
        track.addVerticesFromObj('roadCornerLarge', 1, 16.5, 1, 0, rot90, 0);
        track.addVerticesFromObj('roadCornerLargeBorder', 1, 16.5, 1, 0, rot90, 0);
        track.addVerticesFromObj('roadCornerLargeBorderInner', 1, 16.5, 1, 0, rot90, 0);
        track.addVerticesFromObj('roadStraightLong', 1, 12.5, 0, 0, rot90, rot90);
        track.addVerticesFromObj('roadStraightLong', 1, 10.5, 0, 0, rot90, rot90);
        track.addVerticesFromObj('roadCurved', 1, 8.5, -0.5, 0, rot90, rot90);
        track.addVerticesFromObj('roadCurved', 1, 6.5, -1, 0, rot90, rot90);
        track.addVerticesFromObj('roadStraightLong', 1, 4.5, -1, 0, rot90, rot90);
        track.addVerticesFromObj('roadStraightLong', 1, 3, -1, 0, rot90, rot90);
        track.addVerticesFromObj('roadStraightArrow', 1, 3, -2, 0, rot90, -rot90);
        track.addVerticesFromObj('roadCornerLarge', 1, 2, -2, 0, rot90, -rot90);
        track.addVerticesFromObj('roadCornerLargeBorder', 1, 2, -2, 0, rot90, -rot90);
        track.addVerticesFromObj('roadCornerLargeBorderInner', 1, 2, -2, 0, rot90, -rot90);

        //  Zoom the camera

        track.panX(-1);
        track.panY(1.5);
        track.panZ(20);

        this.debug = this.add.graphics();

        this.input.keyboard.on('keydown-D', () => {

            if (track.debugCallback)
            {
                track.setDebug();
            }
            else
            {
                track.setDebug(this.debug);
            }

        });

        const rotateRate = 1;
        const panRate = 1;
        const zoomRate = 4;

        this.input.on('pointermove', pointer => {

            if (!pointer.isDown)
            {
                return;
            }

            if (pointer.event.shiftKey)
            {
                track.modelRotation.y += pointer.velocity.x * (rotateRate / 800);
                track.modelRotation.x += pointer.velocity.y * (rotateRate / 600);
            }
            else
            {
                track.panX(pointer.velocity.x * (panRate / 800));
                track.panY(pointer.velocity.y * (panRate / 600));
            }

        });

        this.input.on('wheel', (pointer, over, deltaX, deltaY, deltaZ) => {

            track.panZ(deltaY * (zoomRate / 600));

        });

        this.track = track;

        this.t = this.add.text(16, 16, '', { font: '16px Courier', fill: '#ffffff' }).setShadow(1, 1, '#000000');
    }

    update ()
    {
        this.debug.clear();
        this.debug.lineStyle(1, 0x00ff00);

        this.t.setText([
            'Drag with mouse',
            'Shift + Drag to rotate',
            'Wheel to zoom',
            'D to toggle debug',
            '',
            'Total Faces: ' + this.track.getFaceCount(),
            'Total Rendered: ' + this.track.totalRendered
        ]);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#0a440a',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
