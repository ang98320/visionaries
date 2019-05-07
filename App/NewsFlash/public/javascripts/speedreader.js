// Google News API Key
// a4a03d7d0df7480e8b52461a0e39fb77
data = 0
currentArticle = 0
demo = 0  // will probably remove this later

$(document).ready(function(){
  console.log("hello from speedreader.js");
  getTrendingNews(function() {
    console.log("done");
    console.log(data.articles);
    loadNewsArticles(data.articles);
  });
});

function getTrendingNews(callback) {
  var url = 'https://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey=a4a03d7d0df7480e8b52461a0e39fb77';
  var req = new Request(url);
  fetch(req)
      .then(function(response) {
          //console.log(response.json());
          return response.json();
      })
      .then(function(json) {
        data = json
        callback();
      })
}

function loadNewsArticles(articles) {
  console.log("total articles: " + articles.length);
  for (var i = 0; i < 8; i++) {
    console.log(articles[i].description);
    if($("#jumbotron-"+i != null))
      $("#jumbotron-"+i).css("background-image", "url("+articles[i].urlToImage+")");
    else
      $("#jumbotron-"+i).css("background-image", "url(https://icdn2.digitaltrends.com/image/news-apps-header-1500x1000.jpg)");
    $("#title-"+i).html("<h2>"+articles[i].title+"</h2>");
    $("#article-"+i).html("<h3>"+articles[i].description+"</h3>");
  }
}

function demoAjax() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     currentArticle = "article-button-demo";
     demo = this.responseText;
    }
  };
  xhttp.open("GET", "/demo-speedreader", true);
  xhttp.send();
}

function initReader(id) {
  console.log(id);
  currentArticle = id;
}

let speedreader = 0
//function readText(text) {
function startReader() {
  let wpm = 500
  if (currentArticle == "article-button-demo") {
    text = demo;
  } else {
    wpm = ((1/(document.getElementById("wpm").value/60))*1000);
    idx = currentArticle.replace('article-button-','');
    text = data.articles[idx].content;
  }

  if(!text)
    text = "Article_Text_Not_Found!";
  //if a speedreader interval is already open, close it and start a new one
  if (speedreader)
	closeReader();

  let words = text.split(" ");
  let numWords = words.length - 1;
  let index = 0
  //Open a new interval with speed (ms) based on wpm input
  speedreader = setInterval(function(){
    if (words[index] != null) {
      $("#test_area").html("<h4>"+words[index]+"</h4>");
      index+=1;
    }
  }, wpm);
}

function closeReader() {
  $("#test_area").html("<h3></h3>");
  clearInterval(speedreader);
}
