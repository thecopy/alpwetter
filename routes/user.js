
/*
 * GET weather by woeid.
 */
var http = require('http')
var sqlite3 = require('sqlite3');
db = new sqlite3.Database('cache.sqlite3')

OPEN_WEAHTER_MAP_APIKEY = '7d4b6f7aaa407a22afbafd2e7f4ec422'

exports.woeid = function(req, res){
  woeid = req.query.woeid;

  if (!isInt(woeid)){
    res.status(400);
    res.send('Provide query param woeid (http://woeid.rosselliot.co.nz/)')
    return;
  }

  getCache(woeid, (err, row) => {
    if (err){
      res.status("500.1")
      res.statusMessage = 'Could not query cache'
      res.send(err)
      return;
    }

    if (row){
      console.log('Fetching weather data for woeid '+woeid+' from cache')
      res.send(row['data']);
      return;
    }else{ // no valid cache
      console.log('No cache for woeid '+woeid+'. Fetching from web API')
      url = 'http://api.openweathermap.org/data/2.5/forecast?id='+woeid+'&mode=json&units=metric&appid='+OPEN_WEAHTER_MAP_APIKEY
      getBodyContent(url, (statuscode,content) =>{
        if (statuscode != 200){
          res.status('500.2')
          res.statusMessage = 'Could not query api.openweathermap.org'
          res.send('Did not get 200 response. Got ' + statuscode + '\n' + content)
          return;
        }

        setCache(woeid, content);

        res.send(content);
      }); 
    }
  });
};

function getCache(woeid, fn){
  cache_max_age = '-30 minutes'
  db.get("select data from weather where woeid = $woeid and last_updated > datetime('now',$max_age)", [woeid, cache_max_age], fn);
}

function setCache(woeid, data){
  db.run("insert or replace into weather (woeid, last_updated, data)"+
         " values($woeid, datetime('now'), $data)", [woeid, data])
}

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

function getBodyContent(url, fn)
{
  var req = http.get(url, function(res)
  {
      var output = '';
      console.log(url + ':' + res.statusCode);
      res.setEncoding('utf8');

      res.on('data', function (chunk) {
          output += chunk;
      });

      res.on('end', function() {
          fn(res.statusCode, output);
      });
  });

  req.on('error', function(err) {
      //res.send('error: ' + err.message);
  });

  req.end();
};