// Para usar la api de weather underground tenemos que hacer una petición
// a la dirección WU + KEY + COND + pais/ciudad.json
const WU = 'http://api.wunderground.com/api/'
const KEY = 'dcc36127caecf6be'
const COND = '/conditions/q/'

var request = require('request')

function getTemperature (country, city) {
  var result = request.get(WU + KEY + COND + country + '/' + city + '.json')
  return result.estimated.temp_c
}

function getHumidity (country, city) {
  var result = request.get(WU + KEY + COND + country + '/' + city + '.json')
  return result.estimated.relative_humidity
}
