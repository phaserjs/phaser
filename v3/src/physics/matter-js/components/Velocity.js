var Body = require('../lib/body/Body');

var Velocity = {

    setAngularVelocity: function (value)
    {
        Body.setAngularVelocity(this.body, value);

        return this;
    },

    setVelocityX: function (x)
    {
        this._tempVec2.set(x, this.body.velocity.y);

        Body.setVelocity(this.body, this._tempVec2);

        return this;
    },

    setVelocityY: function (y)
    {
        this._tempVec2.set(this.body.velocity.x, y);

        Body.setVelocity(this.body, this._tempVec2);

        return this;
    },

    setVelocity: function (x, y)
    {
        this._tempVec2.set(x, y);

        Body.setVelocity(this.body, this._tempVec2);

        return this;
    }

};

module.exports = Velocity;
