/*
  We use this file to discover the devices.
  Once we find a device, we shuold:
    1. Register the device in the database, by following the given structure
    2. If the device is not available anymore, we should delete it from the database
*/

var request = require('request')
var weather = require('./weather')

const API = 'http://' + process.env.NETBEAST + '/api/resources'

var devices = []

module.exports = function (callback) {
  var objects = []

  // Request to the database
  request.get(API + '?app=weather',
    function (err, resp, body) {
      if (body) body = JSON.parse(body)
      if (err) return callback(err)
      if (body === undefined || !body) return

      if (body.length > 0) {
        body.orEach(function (device) {
          if (objects.indexOf(device.hook.split('/')[2]) < 0) objects.push(device.hook.split('/')[2])
        })
      }
    })

  // Implement the device discovery method
  // weather.discoverAll(function (device) {
  // When we find a device
  //  1. Look if its already exists on the database.
  // var indx = objects.indexOf('/weather/id') // hook == /Namebrand/id. Example. /hueLights, /Sonos
  // if (indx >= 0) {
  //  objects.splice(indx, 1)
  // } else {
  //  Use this block to register the found device on the netbeast database
  //  in order to using it later
  request.post({url: API,
    json: {
      app: 'weather', // Name of the device brand
      location: 'none',
      topic: 'temperature', // lights, bridge, switch, temperature, sounds, etc
      groupname: 'none',
      hook: '/temperature/1' // HOOK == /Namebrand  Example. /hueLights, /Sonos
  // We will use the id to access to the device and modify it.
  // Any value to refer this device (MacAddress, for example) can work as id
  }},
    function (err, resp, body) {
      if (err) return callback(err)
      callback
    })

  request.post({url: API,
    json: {
      app: 'weather',
      location: 'none',
      topic: 'humidity',
      groupname: 'none',
      hook: '/humidity/1'
  }},
    function (err, resp, body) {
      if (err) return callback(err)
      callback
    })
}
// })

setTimeout(function () {
  // weather.stopDiscoverAll(callback)
  if (objects.length > 0) {
    objects.forEach(function (hooks) {
      request.del(API + '?hook=/temperature/' + hooks,
        function (err, resp, body) {
          // if (err) callback(err)
        })
      request.del(API + '?hook=/humidity/' + hooks,
        function (err, resp, body) {
          // if (err) callback(err)
        })
    })
  }
// callback(null, devices)
}, 15000)
