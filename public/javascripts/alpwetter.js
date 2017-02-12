

$( '.resort-label').click(function() {
    var elem = null;
    if($(this).hasClass("resort-label")){
        elem = $(this);
    }else{
        elem = $(this).closest(".resort-label");
    }   

    elem.toggleClass("resort-label-selected");
});

$( '.get-weather' ).click(function() {

    console.log('Getting weather...')

    var selected = new Array();
    $('.resort-checkbox:checked').each(function() {
        var elem = $(this);
        console.log("* " + elem.attr('value') + ", " + elem.attr("data-id") + ", (" + elem.attr('data-lat') + ", " + elem.attr("data-lon") + ")");

        selected.push({
            name : elem.attr('value'),
            lat : elem.attr('data-lat'),
            lon : elem.attr('data-lon'),
            query: elem.attr('data-query'),
            id : elem.attr('data-id')
        });
    });

    $('#the-weather ul li').remove();

    if(selected.length == 0)
        return;

    $(this).prop("disabled",true);
    $('.get-weather').text("Laden...");
    selected.forEach(function(x){
        console.log(x)
        if(x.id != null)
            getWeatherByWoeid(x.id, x.query)
        else
        console.error('missing id')
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
    button.text(button.text() == "Mehr" ? "Weniger" : "Mehr");

 }


function getWeatherByWoeid(woeid, query, fn) {
    console.log('Fetching json using woeid ' + woeid);

    var requestString = "/api/weather?woeid="+woeid;
    
    fn = typeof fn !== 'undefined' ? fn : jsonCallback;

    $.getJSON( requestString, function(data) { fn(data, query) });
}


function jsonCallback(data, query){
    console.log("Got JSON for city " + data.city.name + "(" + data.city.id + ")");    
    console.log(data);  
    setWeather(data,query);  

    $('.get-weather').prop("disabled",false);
    $('.get-weather').text("Los!");
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

    console.log("Requested location: " + query + ", response: " + jsonData.city.name);

    elem.find('h2').text(location);

    for(var i = 0; i<jsonData.list.length; i++){
        var date = moment(addDays(today,i));
        if(i > 1)
            elem.find('table thead th:eq(' + (i+1) + ')').text(date.format('ddd, Do MMM '))

        var imgUrl = 'http://openweathermap.org/img/w/' + jsonData.list[i].weather[0].icon + '.png';
        elem.find('table tbody tr.icon td:eq(' + (i+2) + ')').html('<img src="' + imgUrl + '"/>');
        elem.find('table tbody tr.temp td:eq(' + (i+2) + ')').text(Math.round(jsonData.list[i].main.temp) + ' °C');
        elem.find('table tbody tr.min-temp td:eq(' + (i+2) + ')').text(Math.round(jsonData.list[i].main.temp_min) + ' °C');
        elem.find('table tbody tr.max-temp td:eq(' + (i+2) + ')').text(Math.round(jsonData.list[i].main.temp_max) + ' °C');
        elem.find('table tbody tr.weather td:eq(' + (i+2) + ')').text(jsonData.list[i].weather[0].main);
        elem.find('table tbody tr.clouds td:eq(' + (i+2) + ')').text(jsonData.list[i].clouds.all + '%');
        elem.find('table tbody tr.wind td:eq(' + (i+2) + ')').text(jsonData.list[i].wind.speed + 'm/s');
    }

    elem.find('tr.hideable').hide();
    $("#the-weather ul").append(elem);
}

function addDays(date, days) {
  var d2 = new Date(date);
  d2.setDate(d2.getDate() + days);
  return d2;
}

weatherIconsMap = {
    '01': 'wi-day-sunny',
    '02': 'wi-day-cloudy-high',
    '03': 'wi-cloud',
    '04': 'wi-cloudy',
    '09': 'wi-showers',
    '10': 'wi-rain',
    '11': 'wi-day-thunderstorm',
    '12': 'wi-day-snow',
    '50': 'wi-fog'
}

