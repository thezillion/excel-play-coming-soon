var c = document.getElementById('c'),
ctx = c.getContext('2d'),
skipped = 0;

var hideStart = function() {
  //Check Mobile
  if (!(/Mobi|Tablet|iPad|iPhone/.test(navigator.userAgent))) {
    skipped = 1;
    document.querySelector(".start-container").style.animation="fadeout 3s forwards";
    // document.querySelector("audio").pause();
    document.querySelector("#c").style.animation="fadein 2s forwards";
    setTimeout(function() {
      document.querySelector(".start-container").style.display = "none";
      document.querySelector("#c").style.display="block";
      GameLoop();
    }, 3000);
  }
  else {
    //For Mobile
    document.querySelector(".start-container").style.perspective = "300px";
    document.querySelector(".start-container").style.overflow = "visible";
  }
}

document.addEventListener("keypress", function(e) {
  if(String.fromCharCode(e.which) == 'k' && skipped == 0) {
    hideStart();
  }
});
//For game dev only
// hideStart();
