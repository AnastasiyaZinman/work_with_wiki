const SEARCHING_POPULATION_TEXT = "Population•&#160;",
  SEARCHING_AREA_TEXT = "Area •&#160;",
  SEARCHING_FLAG_TEXT = 'src=\\"',
  SEARCHING_CAPITAL_TEXT = 'Capital\n',
  country_code = 'us';

$('button').on('click', function () {
  $('.book-list').empty();
  var title = $('input').val();
  //---First Checking entered title
  fetch(title);
  fetch_news();
})

function findCapital(str, searching_text) {
  var searching_answer = '', current_pos;
  // console.log("find", str.replace(/Capitaland(.*?)\n/, 'Capital\n'));
  str = str.replace(/Capitaland(.*?)\n/, searching_text);
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

  return null;
}
var AppendData = function (data) {
  var source = $('#country-template').html();
  var template = Handlebars.compile(source);
  //---Second Checking entered title
  console.log(data);
  if (data.length === 0)
    $('.book-list').append("Can't find book with entered title.");
  else {
    console.log("handlebars");
    var newHTML = template(data);
    $('.book-list').append(newHTML);

  }
}

function findInfo(data, title) {
  var answer = {};
  answer["country"] = title;
  answer["capital"] = findCapital(data.text, SEARCHING_CAPITAL_TEXT);
  answer["population"] = findCountryInfo(data.text, SEARCHING_POPULATION_TEXT, '&');
  answer["area"] = findCountryInfo(data.text, SEARCHING_AREA_TEXT, '&');
  answer["flag_path"] = 'https:'+findCountryInfo(JSON.stringify(data), SEARCHING_FLAG_TEXT, '\\');
  console.log(answer);//answer from wiki
  AppendData(answer);
}
function addNews(data){
var news_list=[];
// console.log("articles",data.articles);
for (let count_of_news =0;count_of_news<3; count_of_news++){
  news_list.push(data.articles[count_of_news]);
}
console.log(news_list); //answer from news resourse

}

var fetch_news = function(title){
  $.ajax({
    method: "GET",
    url: 'https://newsapi.org/v2/top-headlines?' + 'country=' +country_code+'&' +
    'apiKey=2017d3de160740f3b8a997f22a80c4aa',
    dataType: "json",
    success: function (data_news) {
      if (JSON.stringify(data_news) !== 'null') {
         console.log(data_news);
         addNews(data_news);
      }
      else alert('Enter another country');
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
  

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
        findInfo(data[0], title);
      }
      else alert('Enter another country');
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};