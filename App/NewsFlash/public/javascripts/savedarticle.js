// Google News API Key
// a4a03d7d0df7480e8b52461a0e39fb77
// Firebase API AIzaSyDYKhmDPqTGt1y52M1MI9VVnC0T6zXJML8

//uncaught exception: [DEFAULT]: Firebase: No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp() (app/no-app).
data = 0
var articles = 0
currentArticle = 0
demo = 0  // will probably remove this later
let wpm = 500;

$(document).ready(function(){
  console.log("hello from savedarticle.js");
  getSavedArticles();
  //removeArticle();
});

function getSavedArticles() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     //console.log(this.responseText);
     articles = JSON.parse(this.responseText);
     updateUI(JSON.parse(this.responseText));
    }
  };
  xhttp.open("GET", "/get-articles", true);
  xhttp.send();
}

function loadNewsArticles(articles) {

  console.log("total articles: " + articles.length);
  for (var i = 0; i < articles.length; i++) {
    console.log(articles[i])
    console.log(articles[i].description);
    console.log(articles[i].url);
    //check if a picture came with the article
    if($("#jumbotron-"+i != null))
      $("#jumbotron-"+i).css("background-image", "url("+articles[i].urlToImage+")");
    else
      $("#jumbotron-"+i).css("background-image", "url(https://icdn2.digitaltrends.com/image/news-apps-header-1500x1000.jpg)");
    $("#jumbotron-"+i).attr("alt", articles[i].publishedAt);
    $("#title-"+i).html("<h1>"+articles[i].title+"</h1>");
    $("#article-"+i).html("<h2>"+articles[i].description+"</h2>");
  }
}

function loadTimeToRead() {
  for (var i = 0; i < 8; i++) {
    $("#footer-"+i).html("<p>"+calcTimeToRead(articles[i])+"</p>");
  }
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

function removeArticle(id) {
  console.log("called removeArticle:", id);
  let idx = id.replace('jumbotron-','');
  console.log(idx)
  console.log(articles[idx])
  console.log(articles[idx].title)
  console.log(articles[idx].publishedAt)
  article = {
    "key": articles[idx].publishedAt
  }

  $.ajax({
    url: "/remove-article",
    type: 'POST',
    data: JSON.stringify(article),
    processData: false,
    contentType: 'application/json'
  }).success(function (data) {
    console.log(data);
    $('#'+id).remove();
  });
}


/*
function removeArticle(article) {
  console.log("called removeArticle:", article);
  //figure out why #removeButton only works sometimes
  //$(".removeButton").click(function(event) {
    //event.preventDefault();
    //console.log("inside click function!");
    //let altKey = $(this).parent().parent().parent().attr("alt");

    let altKey = $(this).closest(".jumbotron").attr("alt");
    console.log(altKey);
    $.ajax({
      url: "/remove-article",
      type: 'POST',
      data: altKey,
      processData: false,
      contentType: 'application/json'
    }).success(function (data) {
      console.log(data);
    });
    $(this).closest('.jumbotron').remove();
  //});
  //figure out how to readjust every other jumbotron in the case that user would lke to remove
  //multiple articles.

}*/

function updateUI(articles) {
  for (var i = 0; i < articles.length; i ++) {
    console.log(articles[i]);
    var jumbotron = createArticleJumbotron(articles[i], i);
    var html = document.getElementById("saved-content").appendChild(jumbotron);
  }
  loadTimeToRead();
}

function createArticleJumbotron(article, i) {
  var ul = document.createElement("ul")
  ul.className = "articleItems";

  var title = document.createElement("h1")
  title.innerHTML = article.title;
  var div1 = document.createElement("div")
  div1.className="line";
  var desc = document.createElement("h2")
  desc.className="description";
  desc.innerHTML = article.description;
  var div2 = document.createElement("div")
  div2.className="line";
  var footer = document.createElement("p")
  footer.className="footer"
  footer.id = "footer-"+i
  var list = document.createElement("li")
  var read = document.createElement("a.btn.btn-lg.btn-primary")
  read.id = "article-button-"+i
  read.className = "btn btn-lg btn-primary btn btn-default";
  read.innerHTML = "Read"
  read.setAttribute('href',"#normalModal");
  read.setAttribute('data-toggle',"modal");
  read.onclick= function() {
    initReader(i);
  };

  var del = document.createElement("a.btn.btn-lg.btn-primary")
  del.className = "btn btn-lg btn-primary btn btn-default removeButton";
  del.innerHTML = "Remove"
  del.onclick=function() {
    removeArticle('jumbotron-'+i);
  }

  list.append(read);
  list.append(del)

  ul.append(title);
  ul.append(div1);
  ul.append(desc);
  ul.append(div2);
  ul.append(footer);
  ul.append(list);

  var jumbotron = document.createElement("div");
  jumbotron.id = "jumbotron-"+i
  jumbotron.style = "padding:20px;";
  jumbotron.style.backgroundImage = "url("+article.urlToImage+")";
  jumbotron.className = "jumbotron";
  jumbotron.append(ul);
  return jumbotron;
}

function initReader(id) {
  console.log("initReader", id);
  currentArticle = id;
}

let speedreader = 0
function startReader() {
  wpm = ((1/(document.getElementById("wpm").value/60))*1000);
  if (currentArticle == "article-button-demo") {
    text = document.getElementById("demoBox").value;
    console.log(text);
    //text = demo;
  } else {
    //wpm = ((1/(document.getElementById("wpm").value/60))*1000);
    idx = currentArticle//.replace('article-button-','');
    console.log(articles[idx])
    text = articles[idx].content;
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
  console.log("closing reader");
  $("#test_area").html("<h3></h3>");
  clearInterval(speedreader);
}
