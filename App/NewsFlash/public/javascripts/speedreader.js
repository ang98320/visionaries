// Google News API Key
// a4a03d7d0df7480e8b52461a0e39fb77
data = 0
currentArticle = 0

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
    $("#article-"+i).html("<h3>"+articles[i].description+"</h3>");
  }
}

function initReader(id) {
  console.log(id);
  currentArticle = id;
}

let speedreader = 0
//function readText(text) {
function startReader() {
  if (currentArticle == "article-button-demo") {
    text = "This is a demo of a speed reader. You are reading at 150 WPM. That's amazing! Do we have your attention now?"
  } else {
    idx = currentArticle.replace('article-button-','');
    text = data.articles[idx].content;
  }
  let words = text.split(" ");
  let numWords = words.length - 1;
  let index = 0
  speedreader = setInterval(function(){
    if (words[index] != null) {
      $("#test_area").html("<h3>"+words[index]+"</h3>");
      index+=1;
    }
  },500);
}

function closeReader() {
  $("#test_area").html("<h3></h3>");
  clearInterval(speedreader);
}
