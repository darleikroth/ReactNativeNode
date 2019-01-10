
try {
  const mqtt = require('mqtt')
  const client  = mqtt.connect('mqtt://test.mosquitto.org')
  const rn_bridge = require('rn-bridge')

  client.on('connect', function () {
    client.subscribe('presence', function (err) {
      if (!err) {
        client.publish('presence', 'Hello mqtt')
      }
    })
  })

  client.on('message', function (topic, message) {
    // message is Buffer
    rn_bridge.channel.post('message', message.toString())
    // client.end()
  })

  rn_bridge.channel.on('message', (msg) => {
    if (!client.connected) {
      rn_bridge.channel.post('message', 'Client not connected')
      return
    }
    client.publish('presence', 'Hi again')
  })

  rn_bridge.channel.on('close', (msg) => {
    if (client.connected) {
      rn_bridge.channel.post('message', 'disconnected')
      client.end()
    } else {
      client.reconnect()
      rn_bridge.channel.post('message', 'connected')
    }
  })

  rn_bridge.channel.post('message', "Node was initialized.")

} catch (error) {
  console.log('Nodejs', error)
}
