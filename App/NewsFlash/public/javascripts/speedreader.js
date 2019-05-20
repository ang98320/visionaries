// Google News API Key
// a4a03d7d0df7480e8b52461a0e39fb77
// Firebase API AIzaSyDYKhmDPqTGt1y52M1MI9VVnC0T6zXJML8

//uncaught exception: [DEFAULT]: Firebase: No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp() (app/no-app).
data = 0
articles = 0
currentArticle = 0
demo = 0  // will probably remove this later
let wpm = 500;

$(document).ready(function(){
  console.log("hello from speedreader.js");
  //const database = firebase.database();
  //database.initalizeApp();
  //let dateGetter = new Date();
  //let date = "" + dateGetter.getFullYear();
  //date = date + "-" + dateGetter.getMonth();
  //date = date + "-" + dateGetter. getDate();
  //let storage = "daily-articles/" + date;
  getTrendingNews(function() {
    console.log("done");
    console.log(data.articles);
    //database.ref(storage).set(data.articles);
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
	//use variable articles from here on to access articles, as savedarticle.js doesn't need to use the data variable in its context
	articles = data.articles
        callback();
      })
}

function loadNewsArticles(articles) {

  console.log("total articles: " + articles.length);
  for (var i = 0; i < 8; i++) {
    console.log(articles[i].description);
    //check if a picture came with the article
    if($("#jumbotron-"+i != null))
      $("#jumbotron-"+i).css("background-image", "url("+articles[i].urlToImage+")");
    else
      $("#jumbotron-"+i).css("background-image", "url(https://icdn2.digitaltrends.com/image/news-apps-header-1500x1000.jpg)");
    $("#title-"+i).html("<h1>"+articles[i].title+"</h1>");
    $("#article-"+i).html("<h2>"+articles[i].description+"</h2>");
    loadTimeToRead();
  }
}

function loadTimeToRead() {
  for (var i = 0; i < 8; i++) {
    $("#footer-"+i).html("<p>"+calcTimeToRead(articles[i])+"</p>");
  }
}

function saveArticle(article) {
  $.ajax({
    url: "/save-article",
    type: 'POST',
    data: JSON.stringify(article),
    processData: false,
    contentType: 'application/json'
  }).success(function (data) {
    console.log(data);
  });
}

function demoSave() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
  xhttp.open("GET", "/demo-save", true);
  xhttp.send();
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
  if (currentArticle == "article-button-demo") {
    text = demo;
  } else {
    wpm = ((1/(document.getElementById("wpm").value/60))*1000);
    idx = currentArticle.replace('article-button-','');
    text = data.articles[idx].content;
  }

  if(text == null)
    text = "Article_Text_Not_Found!";
  //if a speedreader interval is already open, close it and start a new one
  if (speedreader)
	closeReader();

  let words = text.split(" ");
  let numWords = words.length - 1;
  let index = 0;

  if(wpm == "Infinity" || wpm == "")
    wpm = 500;

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

function calcTimeToRead(article) {
  if(article.content)
    words = article.content.split(" ");
  else
    return "No content in this article...";
  let numWords = words.length - 1;
  let wpm = document.getElementById("wpm").value;

  //If wpm hasn't been set yet it defaults to "Infinity" for some reason
  console.log(wpm);
  if(wpm == "Infinity" || wpm == "")
    wpm = 120;
  const readTime = (numWords/wpm).toFixed(2);
  return (readTime + " minutes to read at "+wpm+" words per minute.");

}

function save(id) {
  idx = id.replace('save-button','');
  article = {
    "author": data.articles[idx].author,
    "content": data.articles[idx].content,
    "description": data.articles[idx].description,
    "publishedAt": data.articles[idx].publishedAt,
    "title": data.articles[idx].title,
    "url": data.articles[idx].url,
    "urlToImage": data.articles[idx].urlToImage
  };
  //article = data.articles[idx];
  //console.log("idx,", idx);
  //console.log("save:", article);

  if(document.getElementById(id).src.includes("empty.png")) {
    document.getElementById(id).src = "images/save_icon_fill.png";
    $("#"+id).after('<p id="success">Added article to Saved!</p>');
    $("#success").delay(2000).fadeOut();
    
    //Add article to save db
    saveArticle(article);
  } else {
    document.getElementById(id).src = "images/save_icon_empty.png";
    $("#"+id).after('<p id="success">Removed article from Saved!</p>');
    $("#success").delay(2000).fadeOut();
    //Remove saved article from db
  }

}
