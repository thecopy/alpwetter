
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { 
  	title: 'Alpwetter.ch',
  	availableResorts: [
  		{ name: 'Zermatt', lat: 46.0241, lon: 7.7484, query: 'Zermatt' },
  		{ name: 'Davos', lat: 46.7931, lon: 9.82054, query: 'Davos'},
  		{ name: 'Andermatt' , lat: 46.6329, lon: 8.59475, query: 'Andermatt'},
  		{ name: 'Engelberg' , query: 'Engelberg'},
  		{ name: 'Saas Fee' , query: 'Saas Fee'},
  		{ name: 'Chamonix Mont Blanc' , query: 'Chamonix-Mont-Blanc'},
  		{ name: 'Arosa' , query: 'Arosa' },
  		{ name: 'Flumserberg' , query:'Flumserberg' },
  		{ name: 'Verbier' , query:'Verbier' },
  		{ name: 'St. Moritz - Corviglia' , query:'St. Moritz - Corviglia' },
  		{ name: 'Grindelwald' , query: 'Grindelwald' } 
  	]
  });
};
