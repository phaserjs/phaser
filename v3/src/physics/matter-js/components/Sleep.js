var MatterEvents = require('../lib/core/Events');
var PhysicsEvent = require('../events/');

var Sleep = {

    setSleepThreshold: function (value)
    {
        if (value === undefined) { value = 60; }

        this.body.sleepThreshold = value;

        return this;
    },

    setSleepEvents: function (start, end)
    {
        this.setSleepStartEvent(start);
        this.setSleepEndEvent(end);

        return this;
    },

    setSleepStartEvent: function (value)
    {
        if (value)
        {
            var worldEvents = this.world.events;

            MatterEvents.on(this.body, 'sleepStart', function (event) {
                worldEvents.dispatch(new PhysicsEvent.SLEEP_START(event, this));
            });
        }
        else
        {
            MatterEvents.off(this.body, 'sleepStart');
        }

        return this;
    },

    setSleepEndEvent: function (value)
    {
        if (value)
        {
            var worldEvents = this.world.events;

            MatterEvents.on(this.body, 'sleepEnd', function (event) {
                worldEvents.dispatch(new PhysicsEvent.SLEEP_END(event, this));
            });
        }
        else
        {
            MatterEvents.off(this.body, 'sleepEnd');
        }

        return this;
    }

};

module.exports = Sleep;
