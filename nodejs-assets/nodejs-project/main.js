// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

var rn_bridge = require('rn-bridge');

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')

// Echo every message received from react-native.
rn_bridge.channel.on('message', (msg) => {
  rn_bridge.channel.send('Nodejs', msg);
} );

client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  rn_bridge.channel.send('Nodejs', message.toString());
  client.end()
})

// Inform react-native node is initialized.
rn_bridge.channel.send('Nodejs', "Node was initialized.");

rn_bridge.app.on('pause', pauseLock => {
  console.log('Nodejs', '[node] app paused.');
  pauseLock.release();
});
rn_bridge.app.on('resume', () => {
  console.log('Nodejs', '[node] app resumed.');
});