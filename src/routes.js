/*
  This file is responsible of the communication with the end-device.
  We should read the received data and talk to the device.

  This file contains 4 routes:
    1. get  /HOOK/:id
    2. get  /HOOK/:id/info
    3. get  /discover
    4. post /HOOK/:id
*/

var express = require('express')
var router = express.Router()
var netbeast = require('netbeast')
var mqtt = require('mqtt')
var loadResources = require('./resources')

var client = mqtt.connect('ws://' + process.env.NETBEAST)
loadResources(function (err) {
  if (err) {
    console.trace(new Error(err))
    netbeast().error(err, 'Something wrong!')
  }

  /*
    You should replace HOOk for the hook that you have configured on resources.js

    On this route, you will be asked to return some information from the current state
    of the device identify by the given id.
      The id is stored in req.params.id

    In req.query you will find the information that you need to gather,
    for example, brigthness, saturation, power, etc. This is an example for ligths, which
    general structure is in the documentation on https://netbeast.gitbooks.io/docs/content/chapters/api_reference/methods.html

    INPUT -> req.query = [power: '', brightness: '', color: '']

    OUTPUT -> response = [power: 1, brightness: 100, color: {hex: 000000, rgb: {r:0, g:0, b:0}}]

    INPUT -> req.query = [volume: '', status: '']

    OUTPUT -> response = [volume: 80, status: play]

  */
  router.get('/temperature/:id', function (req, res, next) {
    //  You can find the id stored on req.params.id

    //  1. If the device with this id doesn't exist, you will send:
    // return res.status(404).send('Device not found')

    //  2. If you are not asked for a specific value:
    // if (!Object.keys(req.query).length)
    // You should return the whole state (or the most significant info) of the device

    // 3. If you are asked for one or more values you should
    // answer with a JSON object containing the gathered data:
    // var response = {power: 1, brigthness: 50}
    // res.json(response)

    // 4. If you are asked for values, which are not available or not supported
    // on your device, answer with:
    // return res.status(400).send('Values not available on wemo-switch')
  })
  router.get('/humidity/:id', function (req, res, next) {})

  /*
    We are going to use this route to trigger the discovery method (loadResources),
    in order to update the info of the database.
  */
  router.get('/discover', function (req, res, next) {
    loadResources(function (err, devices) {
      if (err) return res.status(500).send(err)
      res.json(devices)
    })
  })

  /*
    You should replace HOOk for the hook that you have configured on resources.js

    On this route we should modify specified values of the device current status.
    GET and POST accept (and return) the same paremeters.
  */
  router.post('*', function (req, res, next) {
    //  You can find the id stored on req.params.id

    //  We will received an JSON object with the parameters that should be changed,
    // and its new values:
    // req.body = {power: 1, volume: 100}

    // You should answer with the changed values, if you can change the parameters
    // var response = [power: 1, volume: 100]
    // return res.send(response)

    // If you cannot change the parameters, please answer with:
    //  return res.status(404).send('A problem setting one value occurred')

    // If the format of the object received is not correct, answer with:
    // return res.status(400).send('Incorrect color format')

    // If you cannot reach the device, answer with:
    // return res.status(404).send('Device not found')
    if (err) return res.status(500).send(err)
    return res.status(501).send('Post Not Implemented')
  })

  if (devices !== undefined && devices.length > 0) {
    devices.forEach(function (weather, indx) {})
  }
})

module.exports = router
