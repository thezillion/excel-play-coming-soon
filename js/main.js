var c = document.getElementById('c'),
ctx = c.getContext('2d'),
skipped = 0
var gLoop;

var hideStart = function() {
  //Check Mobile
  // if (!(/Mobi|Tablet|iPad|iPhone/.test(navigator.userAgent))) {
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
<<<<<<< HEAD
  }
  //  else {
  //   var c = document.querySelector("#c");
  //   // if (window.innerWidth > window.innerHeight) {
  //     // document.querySelector(".start-container").style.display = "none";
  //     // document.querySelector("#c").style.display="block";
  //     if (!window.pageYOffset) hideAddressBar();
  //     // gLoop = setInterval(GameLoop, 1000 / 50);
  //     lightSaber_open();
  //   // }
=======
>>>>>>> 9b80d7b5d31cd076439e56db9f07f239abaa7e0d
  // }
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

document.addEventListener("keypress", function(e) {
  if (String.fromCharCode(e.which) == 'k' && skipped == 0) {
    hideStart();
  } else if (String.fromCharCode(e.which) == 'a') {
    saber1.isGoingRight = false;
  } else if (String.fromCharCode(e.which) == 'd') {
    saber1.isGoingRight = true;
  }
});
<<<<<<< HEAD

window.addEventListener("load", function() {
  if ((/Mobi|Tablet|iPad|iPhone/.test(navigator.userAgent)))
    document.getElementById("pbw").style.display = "none";
});

$(window).on("orientationchange",function(event){
  setTimeout(function() {
    if (window.innerWidth < window.innerHeight) ori = "portriat";
    else ori = "landscape";
    hideAddressBar();
  }, 200);
});

var fbbutton = document.getElementById("fb-link");
fbbutton.style.left = (screen.width/2 - 100) + 'px';

// window.addEventListener("load", hideStart);
=======
>>>>>>> 9b80d7b5d31cd076439e56db9f07f239abaa7e0d
//For game dev only
// hideStart();
