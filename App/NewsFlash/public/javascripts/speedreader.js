function helloWorld() {
  console.log("hello world");
  window.alert("Hello World!");
}

function test(){
  $("#test_area").html("<h3>Good choice</h3>")

  if ($('#x').is(":checked"))
{
  $('#test_main').html("<h2>You chose x</h2>");
}
  else {
      $('#test_main').html("<h2>You chose o</h2>");
  }
}


/*$(".modal-wide").on("show.bs.modal", function() {
  var height = $(window).height() - 200;
  $(this).find(".modal-body").css("max-height", height);
});*/

//function readText(text) {
function readText() {
  text = "This is a demo of a speed reader. You are reading at 150 WPM. That's amazing! Do we have your attention now?"
  let words = text.split(" ");
  let numWords = words.length - 1;
  let index = 0
  setInterval(function(){
    if (words[index] != null) {
      $("#test_area").html("<h3>"+words[index]+"</h3>")
      index+=1;
    }
  },500);
}
