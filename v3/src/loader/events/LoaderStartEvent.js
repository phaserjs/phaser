var Event = require('../../events/Event');

var LoaderStartEvent = function (loader)
{
    Event.call(this, 'LOADER_START_EVENT');

    this.loader = loader;
};

LoaderStartEvent.prototype = Object.create(Event.prototype);
LoaderStartEvent.prototype.constructor = LoaderStartEvent;

module.exports = LoaderStartEvent;
