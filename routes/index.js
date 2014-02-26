
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { 
  	title: 'Alpwetter.ch',
  	availableResorts: [
  		{ name: 'Zermatt', lat: 46.0241, lon: 7.7484, query: 'Zermatt', id: 2658811 },
  		{ name: 'Davos', lat: 46.7931, lon: 9.82054, query: 'Davos', id: 2658811},
  		{ name: 'Andermatt' , lat: 46.6329, lon: 8.59475, query: 'Andermatt', id: 2658592},
  		{ name: 'Engelberg' , query: 'Engelberg', id: 2658786},
  		{ name: 'Saas Fee' , query: 'Saas Fee', id: 2658811},
  		{ name: 'Chamonix Mt Blanc' , query: 'Chamonix-Mont-Blanc', id: 2979698},
  		{ name: 'Arosa' , query: 'Arosa', id: 2661712 },
  		{ name: 'Flumserberg' , query:'Flumserberg', id: 2658061},
  		{ name: 'Verbier' , query:'Verbier', id: 2661641 },
  		{ name: 'St. Moritz - Corviglia' , query:'St. Moritz - Corviglia', id: 2658813},
  		{ name: 'Grindelwald' , query: 'Grindelwald', id: 2660498 },
  		{ name: 'Flims, Laax', query: 'Flims, Laax', id: 2660757 }
  	]
  });
};
