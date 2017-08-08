var c = document.getElementById('c'),
ctx = c.getContext('2d'),
skipped = 0
var gLoop;

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
      //gLoop = setInterval(GameLoop, 1000 / 50);
      lightSaber_open();
    }, 3000);
  } else {
    var c = document.querySelector("#c");
    // if (window.innerWidth > window.innerHeight) {
      // document.querySelector(".start-container").style.display = "none";
      // document.querySelector("#c").style.display="block";
      if (!window.pageYOffset) hideAddressBar();
      // gLoop = setInterval(GameLoop, 1000 / 50);
      lightSaber_open();
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
  if (String.fromCharCode(e.which) == 'k' && skipped == 0) {
    hideStart();
  } else if (String.fromCharCode(e.which) == 'a') {
    saber1.isGoingRight = false;
  } else if (String.fromCharCode(e.which) == 'd') {
    saber1.isGoingRight = true;
  }
});

$(window).on("orientationchange",function(event){
  setTimeout(function() {
    if (window.innerWidth < window.innerHeight) ori = "portriat";
    else ori = "landscape";
    hideAddressBar();
  }, 200);
});

// window.addEventListener("load", hideStart);
//For game dev only
// hideStart();
