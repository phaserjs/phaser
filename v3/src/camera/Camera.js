var Class = require('../utils/Class');
var Rectangle = require('../geom/rectangle/Rectangle');
var TransformMatrix = require('../gameobjects/components/TransformMatrix');
var ValueToColor = require('../graphics/color/ValueToColor');

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
    },

    cameraToScreen: require('./components/CameraToScreen'),
    centerToBounds: require('./components/CenterToBounds'),
    centerToSize: require('./components/CenterToSize'),
    cull: require('./components/Cull'),
    cullHitTest: require('./components/CullHitTest'),
    destroy: require('./components/Destroy'),
    fade: require('./components/Fade'),
    flash: require('./components/Flash'),
    preRender: require('./components/PreRender'),
    removeBounds: require('./components/RemoveBounds'),
    setBackgroundColor: require('./components/SetBackgroundColor'),
    setBounds: require('./components/SetBounds'),
    setPosition: require('./components/SetPosition'),
    setRoundPixels: require('./components/SetRoundPixels'),
    setScene: require('./components/SetScene'),
    setSize: require('./components/SetSize'),
    setViewport: require('./components/SetViewport'),
    setZoom: require('./components/SetZoom'),
    shake: require('./components/Shake'),
    startFollow: require('./components/StartFollow'),
    stopFollow: require('./components/StopFollow'),
    toJSON: require('./components/ToJSON'),
    update: require('./components/Update')

});

module.exports = Camera;
