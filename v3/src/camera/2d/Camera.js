var Class = require('../../utils/Class');
var Rectangle = require('../../geom/rectangle/Rectangle');
var TransformMatrix = require('../../gameobjects/components/TransformMatrix');
var ValueToColor = require('../../graphics/color/ValueToColor');

var Camera = new Class({

    initialize:

    function Camera (x, y, width, height)
    {
        this.scene;

        this.name = '';

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.roundPixels = false;

        //  Bounds
        this.useBounds = false;
        this._bounds = new Rectangle();

        this.inputEnabled = true;

        this.scrollX = 0.0;
        this.scrollY = 0.0;
        this.zoom = 1.0;
        this.rotation = 0.0;
        this.matrix = new TransformMatrix(1, 0, 0, 1, 0, 0);

        this.transparent = true;
        this.clearBeforeRender = true;
        this.backgroundColor = ValueToColor('rgba(0,0,0,0)');

        this.disableCull = false;
        this.culledObjects = [];

        //  Shake
        this._shakeDuration = 0;
        this._shakeIntensity = 0;
        this._shakeOffsetX = 0;
        this._shakeOffsetY = 0;

        //  Fade
        this._fadeDuration = 0;
        this._fadeRed = 0;
        this._fadeGreen = 0;
        this._fadeBlue = 0;
        this._fadeAlpha = 0;

        //  Flash
        this._flashDuration = 0;
        this._flashRed = 1;
        this._flashGreen = 1;
        this._flashBlue = 1;
        this._flashAlpha = 0;

        //  Follow
        this._follow = null;

        this._id = 0;
    },

    cameraToScreen: require('./inc/CameraToScreen'),
    centerToBounds: require('./inc/CenterToBounds'),
    centerToSize: require('./inc/CenterToSize'),
    cull: require('./inc/Cull'),
    cullHitTest: require('./inc/CullHitTest'),
    cullTilemap: require('./inc/CullTilemap'),
    destroy: require('./inc/Destroy'),
    fade: require('./inc/Fade'),
    flash: require('./inc/Flash'),
    ignore: require('./inc/Ignore'),
    preRender: require('./inc/PreRender'),
    removeBounds: require('./inc/RemoveBounds'),
    setBackgroundColor: require('./inc/SetBackgroundColor'),
    setBounds: require('./inc/SetBounds'),
    setName: require('./inc/SetName'),
    setPosition: require('./inc/SetPosition'),
    setRotation: require('./inc/SetRotation'),
    setRoundPixels: require('./inc/SetRoundPixels'),
    setScene: require('./inc/SetScene'),
    setScroll: require('./inc/SetScroll'),
    setSize: require('./inc/SetSize'),
    setViewport: require('./inc/SetViewport'),
    setZoom: require('./inc/SetZoom'),
    shake: require('./inc/Shake'),
    startFollow: require('./inc/StartFollow'),
    stopFollow: require('./inc/StopFollow'),
    toJSON: require('./inc/ToJSON'),
    update: require('./inc/Update')

});

module.exports = Camera;
