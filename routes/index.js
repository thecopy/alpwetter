
/*
 * GET home page.
 */

availableResorts = [
	{ key: 'zermatt', name: 'Zermatt', lat: 46.0241, lon: 7.7484, query: 'Zermatt', id: 2658811, lat: 46.0207, lon: 7.7491 },
	{ key: 'davos', name: 'Davos', lat: 46.7931, lon: 9.82054, query: 'Davos', id: 2658811, lat: 46.8001, lon: 9.8309},
	{ key: 'andermatt', name: 'Andermatt' , lat: 46.6329, lon: 8.59475, query: 'Andermatt', id: 2658592, lat: 46.6353, lon: 8.5948},
	{ key: 'engelberg', name: 'Engelberg' , query: 'Engelberg', id: 2658786, lat: 46.8209, lon: 8.4078},
	{ key: 'saasfee', name: 'Saas Fee' , query: 'Saas Fee', id: 2658811, lat: 46.1091, lon: 7.9297},
	{ key: 'cham', name: 'Chamonix Mt Blanc' , query: 'Chamonix-Mont-Blanc', id: 2979698  },
	{ key: 'arosa', name: 'Arosa' , query: 'Arosa', id: 2661712, lat:46.7823, lon: 9.6799 },
	{ key: 'flumser', name: 'Flumserberg' , query:'Flumserberg', id: 2658061, lat: 47.09224, lon: 9.28769},
	{ key: 'verbier', name: 'Verbier' , query:'Verbier', id: 2661641, lat:46.0961, lon: 7.2289 },
	{ key: 'stmoritz', name: 'St. Moritz - Corviglia' , query:'St. Moritz - Corviglia', id: 2658813, lat:46.507556, lon:9.819},
	{ key: 'gindel', name: 'Grindelwald' , query: 'Grindelwald', id: 2660498, lat: 46.6249, lon: 8.031 },
	{ key: 'laax', name: 'Flims, Laax', query: 'Flims, Laax', id: 2660757, lat: 46.82381, lon: 9.272553},
	{ key: 'stanton', name: 'Sankt Anton', query: 'St Anton am Arlberg', lat:47.129635, lon: 10.268179, id: 2766757},
	{ key: 'ischgl', name: 'Ischgl', query: 'Ischgl', lat: 47.0134 , lon: 10.2916, id: 2775183 },
	{ key: 'garmisch', name: 'Garmisch', query: 'Garmisch', lat: 47.49 , lon: 11.1, id: 2922530 },

]

availableDepaturePoints = [
	{key:'zürich', name: 'Zürich HB', google_name: 'Zürich HB', lat: 47.3673, lon: 8.55 },
	{key:'münchen', name: 'München  Hbf', google_name: 'München Hauptbahnhof', lat: 48.137154, lon: 11.576124 },
	{key:'geneve', name: 'Geneve Gare de Cornavin', google_name: 'Geneve Gare de Cornavin', lat: 46.2105244, lon: 6.1407682 },
	{key:'basel', name: 'Basel SBB', google_name: 'Bahnhof Basel SBB', lat: 47.5475614, lon: 7.5874746 },
	{key:'luzern', name: 'Bahnhof Luzern', google_name: 'Luzern, Bahnhof, Luzern, Schweiz', lat: 47.0507934, lon: 8.3086375 },

]


exports.index = function(req, res){
	if (typeof(req.params.from) === "undefined" || false == availableDepaturePoints.some(x => x.key == req.params.from.toLowerCase())){
		res.render('index', {availableDepaturePoints:availableDepaturePoints});
		return;
	}
	
	departure = availableDepaturePoints.filter(x => x.key == req.params.from.toLowerCase())[0];
	distances = calculateDistances(departure, availableResorts)

	distances = distances.sort((a,b) => a.distance - b.distance)

	res.render('index', { from: departure, from_key: req.params.from.toLowerCase(), available_resorts: availableResorts, resorts_with_distance: distances, availableDepaturePoints:availableDepaturePoints})

};

exports.list = function(req, res){
  res.render('list', { 
  	title: 'Alpwetter.ch',
  	availableResorts: availableResorts
  });
};

function calculateDistances(from, to){
	distances = []
	for (idx in to){
		resort = to[idx]
		if (typeof(resort.lat) === "undefined")
			continue; 

		distance = getDistanceFromLatLonInKm(from.lat, from.lon, resort.lat, resort.lon)
		distances.push({resort:resort, distance: distance});
	}
	return distances
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
