var Transform = require('../components/experimental-Transform-2');

var Camera = function (x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.state = null;
    this.statePositionX = 0.0;
    this.statePositionY = 0.0;
    this.scrollX = 0.0;
    this.scrollY = 0.0;
};

Camera.prototype.setState = function (state)
{
    this.state = state;
    Transform.updateRoot(this.state.transform);
};

Camera.prototype.preRender = function (interpolation, renderer)
{
    var state = this.state;
    var stateTransform = state.transform;

    this.statePositionX = stateTransform.positionX;
    this.statePositionY = stateTransform.positionY;

    stateTransform.positionX = this.x;
    stateTransform.positionY = this.y;
    
    Transform.updateRoot(stateTransform, -this.scrollX, -this.scrollY);
};

Camera.prototype.postRender = function ()
{
    var stateTransform = this.state.transform;
    stateTransform.positionX = this.statePositionX;
    stateTransform.positionY = this.statePositionY;
};

module.exports = Camera;