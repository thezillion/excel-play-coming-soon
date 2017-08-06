var c = document.getElementById('c'),
ctx = c.getContext('2d'),
skipped = 0
var gLoop;

var hideStart = function() {
  console.log('pappu');
  //Check Mobile
  if (!(/Mobi|Tablet|iPad|iPhone/.test(navigator.userAgent))) {
    skipped = 1;
    document.querySelector(".start-container").style.animation="fadeout 3s forwards";
    // document.querySelector("audio").pause();
    document.querySelector("#c").style.animation="fadein 2s forwards";
    setTimeout(function() {
      document.querySelector(".start-container").style.display = "none";
      document.querySelector("#c").style.display="block";
      //gLoop = setInterval(GameLoop, 1000 / 50);
      lightSaber_open();
    }, 3000);
  } else {
    var c = document.querySelector("#c");
    // if (window.innerWidth > window.innerHeight) {
      // document.querySelector(".start-container").style.display = "none";
      // document.querySelector("#c").style.display="block";
      if (!window.pageYOffset) hideAddressBar();
      gLoop = setInterval(GameLoop, 1000 / 50);
      Hammer(c).on("pan", function(event) {
        var center_x = event.center.x;
        var center_y = event.center.y;
        var dx = event.deltaX;
        var dy = event.deltaY;

        var x = center_x + dx/2;
        var y = center_y + dy/2;

        handAngle = Math.atan2(height-y, x-width/2);
      });
    // }
  }
}

//For Mobile
if (/Mobi|Tablet|iPad|iPhone/.test(navigator.userAgent)) {
  window.addEventListener('click', function() {
   var bgm = document.querySelector("audio");
   if(bgm.paused) {
     bgm.play();
   }
  });
}

function hideAddressBar() {
  window.scrollTo(0, 1);
}

document.addEventListener("keypress", function(e) {
  if(String.fromCharCode(e.which) == 'k' && skipped == 0) {
    hideStart();
  }
});

$(window).on("orientationchange",function(event){
  setTimeout(function() {
    if (window.innerWidth < window.innerHeight) ori = "portriat";
    else ori = "landscape";
    hideAddressBar();
  }, 200);
});

window.addEventListener("load", hideStart);
//For game dev only
// hideStart();
