#!/usr/bin/env node

var netbeast = require('netbeast')
var express = require('express')
var request = require('superagent-bluebird-promise')
var cmd = require('commander') // reads --port from command line

cmd
.version('0.1.42')
.option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
.parse(process.argv)

var app = express()

setTimeout(function () {
  register()
}, 10000)

const URL = 'http://api.wunderground.com/api/'
const KEY = 'dcc36127caecf6be'
const COND = '/conditions/q/autoip.json'

app.get('/discover', function () {
  register()
})

/*
* Create here your API routes
* app.get(...), app.post(...), app.put(...), app.delete(...)
*/

app.get('/:topic', function (req, res) {
  request.get(URL + KEY + COND)
  .then(function (data) {
    switch (req.params.topic) {
      case 'weather':
        var status = {
          weather: data.body.current_observation.weather,
          temperature: { c: data.body.current_observation.temp_c, f: data.body.current_observation.temp_f, k: data.body.current_observation.temp_c + 273.15 },
          humidity: data.body.current_observation.relative_humidity.split('%')[0],
          wind: data.body.current_observation.wind_kph,
          precipitation: data.body.current_observation.precip_today_in
        }
        res.json(status)
        break
      case 'temperature':
        res.json({ temperature: { c: data.body.current_observation.temp_c, f: data.body.current_observation.temp_f, k: data.body.current_observation.temp_c + 273.15 } })
        break
      case 'humidity':
        res.json({ humidity: data.body.current_observation.relative_humidity.split('%')[0] })
        break
      case 'wind':
        res.json({ wind: data.body.current_observation.wind_kph })
        break
      case 'precipitation':
        res.json({ precipitation: data.body.current_observation.precip_today_in })
        break
      default:
        break
    }
  }).catch(function (err) { console.trace(err); res.status(403).send(err) })
})

app.post('*', function (req, res) {
  return res.status(501).send('Post Not Implemented')
})

var server = app.listen(cmd.port || 4000, function () {
  console.log('Netbeast plugin started on %s:%s',
  server.address().address,
  server.address().port)
})

function register () {
  netbeast('weather').create({ app: 'weather-plugin', hook: '/weather' })
  netbeast('temperature').create({ app: 'weather-plugin', hook: '/temperature' })
  netbeast('humidity').create({ app: 'weather-plugin', hook: '/humidity' })
  netbeast('wind').create({ app: 'weather-plugin', hook: '/wind' })
  netbeast('precipitation').create({ app: 'weather-plugin', hook: '/precipitation' })
}
