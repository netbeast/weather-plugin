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

register()

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
          weather: data.estimated.weather,
          temperature: { c: data.estimated.tem_c, f: data.estimated.tem_f, k: data.estimated.tem_c + 273.15 },
          humidity: data.estimated.relative_humidity,
          wind: data.estimated.wind_kph,
          precipitation: data.estimated.precip_today_in
        }
        res.json(status)
        break
      case 'temperature':
        res.json({ temperature: { c: data.estimated.tem_c, f: data.estimated.tem_f, k: data.estimated.tem_c + 273.15 } })
        break
      case 'humidity':
        res.json({ humidity: data.estimated.relative_humidity })
        break
      case 'wind':
        res.json({ wind: data.estimated.wind_kph })
        break
      case 'precipitation':
        res.json({ precipitation: data.estimated.precip_today_in })
        break
      default:
        break
    }
  }).catch(function (err) { res.status(403).send(err) })
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
