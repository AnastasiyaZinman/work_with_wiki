const SEARCHING_POPULATION_TEXT = "Population•&#160;",
  SEARCHING_AREA_TEXT = "Area •&#160;",
  SEARCHING_FLAG_TEXT = 'src=\\"',
  SEARCHING_CAPITAL_TEXT='Capital\n';
$('button').on('click', function () {
  $('.book-list').empty();
  var title = $('input').val();
  //---First Checking entered title
  fetch(title);
})

function findCapital(str,searching_text) {
  var searching_answer = '', current_pos;
  // console.log("find", str.replace(/Capitaland(.*?)\n/, 'Capital\n'));
  str=str.replace(/Capitaland(.*?)\n/, searching_text);
  //-------------------------
  // var dict = {"á":"a", "á":"a", "ç":"c","é":"e","í":"i"};
  // str.replace(/[^\w ]/g, function(char) {
  //   return dict[char] || char;
  // });
  //-----------------------
  var searching_text_pos = str.indexOf(searching_text);
  if (searching_text_pos !== -1) {
    current_pos = searching_text_pos + searching_text.length; //position in the text
    while (str[current_pos].match(/[a-zA-Z\sí]/)) {
      searching_answer += str[current_pos];
      current_pos++;
    }
    return searching_answer;
  } 
  else return null;
}

function findCountryInfo(str, searching_text, signal_sign) {
  var searching_answer = '',
    searching_text_pos = str.indexOf(searching_text);
  if (searching_text_pos) {
    current_pos = searching_text_pos + searching_text.length; //position in the text
    while (str[current_pos] !== signal_sign) {
      searching_answer += str[current_pos];
      current_pos++;
    }
    return searching_answer;
  }
 else return null;
}

function findInfo(data) {
  var answer = {};
  answer["capital"] = findCapital(data.text,SEARCHING_CAPITAL_TEXT);
  answer["population"] = findCountryInfo(data.text, SEARCHING_POPULATION_TEXT, '&');
  answer["area"] = findCountryInfo(data.text, SEARCHING_AREA_TEXT, '&');
  answer["flag_path"] = findCountryInfo(JSON.stringify(data), SEARCHING_FLAG_TEXT, '\\');
  console.log(answer);
}

var fetch = function (title) {
  $.ajax({
    method: "GET",
    url: 'http://motyar.info/webscrapemaster/api/?url=https://en.wikipedia.org/wiki/' + title + '&xpath=//table[@class=infobox geography vcard]/tbody[0]',
    dataType: "jsonp",
    success: function (data) {
      if (JSON.stringify(data) !== 'null') {
        // console.log((data[0].text));
        // console.log(data[0].html);
        findInfo(data[0]);
      }
      else alert('Enter another country');
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};