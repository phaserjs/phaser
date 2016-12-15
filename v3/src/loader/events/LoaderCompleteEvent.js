var Event = require('../../events/Event');

var LoaderCompleteEvent = function (loader)
{
    Event.call(this, 'LOADER_COMPLETE_EVENT');

    this.loader = loader;
};

LoaderCompleteEvent.prototype = Object.create(Event.prototype);
LoaderCompleteEvent.prototype.constructor = LoaderCompleteEvent;

module.exports = LoaderCompleteEvent;
