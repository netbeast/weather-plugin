var helper = module.exports = {}
var ApiError = require('./api-error')

var weatherAux

helper.getWe

helper.temperature = function (weather, done) {
  weather.getTemperature(function (err, temperature) {
    if (err) return done(err)
    return done(null, temperature.toFixed(2))
  })
}

helper.humidity = function (weather, done) {
  weather.getHumidity(function (err, humidity) {
    if (err) return done(err)
    return done(null, humidity.toFixed(2))
  })
}
