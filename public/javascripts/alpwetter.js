$( '.get-weather' ).click(function() {

    console.log('Getting weather...')

    var selected = new Array();
    $('.resort-checkbox:checked').each(function() {
        var elem = $(this);
        console.log("* " + elem.attr('value') + ", (" + elem.attr('data-lat') + ", " + elem.attr("data-lon") + ")");

        selected.push({
            name : elem.attr('value'),
            lat : elem.attr('data-lat'),
            lon : elem.attr('data-lon'),
            query: elem.attr('data-query')
        });
    });

    $('#the-weather ul li').remove();

    if(selected.length == 0)
        return;

    $(this).prop("disabled",true);
    $('#loader').show();
    selected.forEach(function(x){
        console.log(x)

        if(x.query != null)
            getWeatherByQuery(x.query)
        else
            getWeather(x.lat, x.lon)
    });
});

$( '.select-all').click(function(){
    $('.resort-checkbox').prop('checked', true);
})
$( '.select-none').click(function(){
    $('.resort-checkbox').prop('checked', false);
})


function hideshow(who) {
    console.log('Switching detail level');

    var button = $(who);
    var table = button.closest('table');

    table.find('tr.hideable').toggle();

    button.toggleClass( "foundicon-plus" ).toggleClass( "foundicon-minus" )

}


function getWeatherByQuery(query) {
    console.log('Fetching json using query');
    var requestString = "http://api.openweathermap.org/data/2.5/forecast/daily?"
        + "q=" + query
        + "&mode=json&units=metric&cnt=7"

    $.getJSON( requestString, function( data ) {
        console.log("Got JSON! :)");    
        console.log(data);  
        setWeather(data,query);  
        $('.get-weather').prop("disabled",false);
        $('#loader').hide();
    });
}

function getWeather(lat, long) {
    console.log('Fetching json using coord');
    var requestString = "http://api.openweathermap.org/data/2.5/forecast/daily?"
        + "lat=" + lat
        + "&lon=" + long
        + "&mode=json&units=metric&cnt=7"

    $.getJSON( requestString, function( data ) {
        console.log("Got JSON! :)");    
        console.log(data);  
        setWeather(data);  
        $('.get-weather').prop("disabled",false);
        $('#loader').hide();
    });
}

function setWeather(jsonData, query) {
    var clone = $('.template-weather-node').clone();
    clone.css('display', 'block');
    clone.prop('class', 'weather-node weather-id-' + jsonData.city.id);        
    elem = clone;
    created = true;
    
    var today = new Date();

    var location = query;
    if(location == null)
        location = jsonData.city.name;
    
    elem.find('h2').text(location);
    elem.find('a').prop('href', 'https://www.google.com/maps/@' + jsonData.city.coord.lat + ',' + jsonData.city.coord.lon + ',13z');


    for(var i = 0; i<jsonData.list.length; i++){
        var date = moment(addDays(today,i));
        if(i > 1)
            elem.find('table thead th:eq(' + (i+2) + ')').text(date.format('ddd, Do MMM '))

        var imgUrl = 'http://openweathermap.org/img/w/' + jsonData.list[i].weather[0].icon + '.png';
        elem.find('table tbody tr.icon td:eq(' + (i+2) + ')').html('<img src="' + imgUrl + '"/>');
        elem.find('table tbody tr.morn-temp td:eq(' + (i+2) + ')').text(Math.round(jsonData.list[i].temp.morn) + ' °C');
        elem.find('table tbody tr.day-temp td:eq(' + (i+2) + ')').text(Math.round(jsonData.list[i].temp.day) + ' °C');
        elem.find('table tbody tr.even-temp td:eq(' + (i+2) + ')').text(Math.round(jsonData.list[i].temp.eve) + ' °C');
        elem.find('table tbody tr.weather td:eq(' + (i+2) + ')').text(jsonData.list[i].weather[0].main);
        elem.find('table tbody tr.clouds td:eq(' + (i+2) + ')').text(jsonData.list[i].clouds + '%');
        elem.find('table tbody tr.wind td:eq(' + (i+2) + ')').text(jsonData.list[i].speed + 'm/s');
    }

    elem.find('tr.hideable').hide();
    $("#the-weather ul").append(elem);
}

function addDays(date, days) {
  var d2 = new Date(date);
  d2.setDate(d2.getDate() + days);
  return d2;
}