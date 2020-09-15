'use strict'
require('eventsource-polyfill');
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true');
hotClient.subscribe(function(eventPhase) {
  if(event.action === 'reload') {
    window.location.reload();
  }
});
