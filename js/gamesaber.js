var c = document.getElementById('c');

c.height = screen.height;
c.width = screen.width;

var width = c.width,
height = c.height,
gLoop,
eLoop = null,
bg = new Image(),
handLength = width*0.15,
handAngle = Math.PI/2,
lasers = [],
laserGenTime = 100,
cycles = 0,
colorSet = ["green", "red", "blue", "orange"],
points = 0,
topPoints = 400,
percentComp = 0,
health = 100,
hurtEffectTimer = 0,
gameState = 1,
saberColor = colorSet[Math.floor(Math.random()*colorSet.length)],
initMessageTime = 200,
lightsaberMoveAudio = new Audio('sounds/8d82b5_Lightsaber_Idle_Hum_Sound_Effect.mp3'),
lightsaberHitAudio = new Audio('sounds/78671__joe93barlow__hit4.wav'),
lightsaberOnAudio = new Audio('sounds/78674__joe93barlow__on0.wav'),
ctx = c.getContext('2d');

var fbbutton = document.getElementById("fb-link");

lightsaberHitAudio.volume = 0.2;
lightsaberMoveAudio.volume = 0.1;
lightsaberOnAudio.volume = 0.2;

var clear = function() {
  // ctx.fillStyle = 'rgba(0,0,0,1)';
  // ctx.rect(0, 0, width, height);
  // ctx.fill();
  try {
    ctx.drawImage(bg, 0, 0);
  }
  catch(e) {};
}
bg.src = 'images/stars.jpg'

var restart = function() {
  clearInterval(eLoop);
  fbbutton.style.display = "none";
  eLoop = null;
  saberColor = colorSet[Math.floor(Math.random()*colorSet.length)];
  gameState = 1;
  points = 0;
  health = 100;
  cycles = 0;
  laserGenTime = 100;
  lasers = [];
  gLoop = setInterval(GameLoop, 1000 / 50);
}

function lightSaber_open() {
  saber1.light_length = 0;
  saber1.draw();
  lightsaberOnAudio.play();
  var p = setInterval(function() {
    if (saber1.light_length < width*0.1) {
      clear();
      saber1.light_length++;
      saber1.draw();
    } else {
      document.addEventListener("mousemove", function(e) {
        var x = e.clientX;
        var y = e.clientY;
        handAngle = Math.atan2(height-y, x-width/2);
      });
      Hammer(c).on("pan", function(event) {
        var center_x = event.center.x;
        var center_y = event.center.y;
        var dx = event.deltaX;
        var dy = event.deltaY;

        var x = center_x + dx/2;
        var y = center_y + dy/2;

        handAngle = Math.atan2(height-y, x-width/2);
      });
      gLoop = setInterval(GameLoop, 1000 / 50);

      c.addEventListener("click", function() {
        if (staging)
          staging = false;
      });

      clearInterval(p);
    }
  }, 1);
}

var hud = function() {
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "small-caps " + width*0.012 + "px Droid Sans";
  ctx.fillText("POINTS",width*0.05,height*0.04);
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.font = "small-caps " + width*0.05 + "px Droid Sans";
  ctx.fillText(points,width*0.05,height*0.125);

  ctx.beginPath();
  ctx.fillStyle = 'rgba(255,0,0,0.5)';
  ctx.rect(width*0.75, height*0.9, 10, 40);
  ctx.rect(width*0.75-15, height*0.9+15, 40, 10);
  ctx.fill();

  ctx.beginPath();
  ctx.rect(width*0.75+40, height*0.9+5, health*2, 30);
  ctx.fill();
}

var drawLine = function(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
var saber = function() {
  this.length = width*0.1;
  this.light_length = width*0.1;
  this.holdAngle = Math.PI/2;
  this.startX = width/2 + handLength*Math.cos(handAngle);
  this.startY =  height - handLength*Math.sin(handAngle);
  this.deltaX = this.length*Math.cos(this.holdAngle-handAngle);
  this.deltaY =  this.length*Math.sin(this.holdAngle-handAngle);
  this.startX_light = width/2 + handLength*Math.cos(handAngle);
  this.startY_light =  height - handLength*Math.sin(handAngle);
  this.deltaX_light = this.light_length*Math.cos(this.holdAngle-handAngle);
  this.deltaY_light =  this.light_length*Math.sin(this.holdAngle-handAngle);
  this.endX = function() { return this.startX - this.deltaX; }
  this.endY = function() { return this.startY - this.deltaY; }
  this.isGoingRight = false;

  this.draw = function() {

    ctx.shadowBlur = 0;

    if (this.isGoingRight && this.holdAngle < 3*Math.PI/2) {
      this.holdAngle += (Math.PI)/10;
    } else if (!this.isGoingRight && this.holdAngle > Math.PI/2) {
      this.holdAngle -= (Math.PI)/10;
    }

    var r = handLength;
    var theta = handAngle;
    this.startX = width/2 + r*Math.cos(theta);
    this.startY =  height - r*Math.sin(theta);
    this.deltaX = this.length*Math.cos(this.holdAngle-theta);
    this.deltaY =  this.length*Math.sin(this.holdAngle-theta);
    this.startX_light = width/2 + r*Math.cos(theta);
    this.startY_light =  height - r*Math.sin(theta);
    this.deltaX_light = this.light_length*Math.cos(this.holdAngle-theta);
    this.deltaY_light =  this.light_length*Math.sin(this.holdAngle-theta);

    ctx.strokeStyle="grey";
    ctx.lineWidth=5;
    drawLine(this.startX, this.startY, this.startX - this.deltaX*0.12, this.startY - this.deltaY*0.12);

    ctx.strokeStyle="#333";
    ctx.lineWidth=5;
    drawLine(this.startX - this.deltaX*0.01, this.startY - this.deltaY*0.01, this.startX - this.deltaX*0.02, this.startY - this.deltaY*0.02);

    ctx.strokeStyle="#333";
    ctx.lineWidth=5;
    drawLine(this.startX - this.deltaX*0.04, this.startY - this.deltaY*0.04, this.startX - this.deltaX*0.05, this.startY - this.deltaY*0.05);

    // Assuming your canvas element is ctx
    ctx.shadowColor = saberColor // string
        //Color of the shadow;  RGB, RGBA, HSL, HEX, and other inputs are valid.
    ctx.shadowOffsetX = 0; // integer
        //Horizontal distance of the shadow, in relation to the text.
    ctx.shadowOffsetY = 0; // integer
        //Vertical distance of the shadow, in relation to the text.
    ctx.shadowBlur = 20; // integer
        //Blurring effect to the shadow, the larger the value, the greater the blur.

    ctx.strokeStyle=saberColor;
    ctx.lineWidth=4;
    drawLine(this.startX_light - this.deltaX_light*0.12, this.startY_light - this.deltaY_light*0.12, this.startX_light - this.deltaX_light, this.startY_light - this.deltaY_light);

    ctx.strokeStyle= "white";
    ctx.lineWidth=1;
    drawLine(this.startX_light - this.deltaX_light*0.10, this.startY_light - this.deltaY_light*0.10, this.startX_light - this.deltaX_light*0.99, this.startY_light - this.deltaY_light*0.99);

    ctx.strokeStyle="grey";
    ctx.lineWidth=7;
    drawLine(this.startX_light - this.deltaX_light*0.11, this.startY_light - this.deltaY_light*0.11, this.startX_light - this.deltaX_light*0.12, this.startY_light - this.deltaY_light*0.12);

  }
}

var laser = function() {
  this.length = width*0.07;
  this.angle = Math.PI/5 + Math.random()*Math.PI*3/5;
  this.distance = width;
  this.speed = width*0.02;
  // state 0 dead, 1 alive, 2 reflecting
  this.state = 1;
  this.startX = width/2 + this.distance*Math.cos(this.angle);
  this.startY = height - this.distance*Math.sin(this.angle);
  //Used for reflection state
  this.initX = width/2 + this.distance*Math.cos(this.angle);
  this.initY = height - this.distance*Math.sin(this.angle);

  //Laser collides to only 40% its length
  this.endX = function() { return width/2 + (this.distance+this.length)*Math.cos(this.angle); }
  this.endY = function() { return height - (this.distance+this.length)*Math.sin(this.angle); }

  this.draw = function() {
    if(this.state == 0) { return; }
    if(this.state == 2) {
      var endX = this.initX + this.distance*Math.cos(this.angle);
      var endY = this.initY - this.distance*Math.sin(this.angle);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      drawLine(this.startX, this.startY, endX, endY);
      return;
    }
    var endX = width/2 + (this.distance+this.length)*Math.cos(this.angle);
    var endY = height - (this.distance+this.length)*Math.sin(this.angle);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    drawLine(this.startX, this.startY, endX, endY);
  }
  this.update = function() {
    if(this.state == 0) { return; }
    else if(this.state == 2) {
      this.distance= this.distance + this.speed;
      if (this.distance > width) { this.state = 0; }
      this.startX = this.initX + (this.distance+this.length)*Math.cos(this.angle);
      this.startY = this.initY - (this.distance+this.length)*Math.sin(this.angle);
      return;
    }

    this.distance= this.distance - this.speed;
    this.startX = width/2 + this.distance*Math.cos(this.angle);
    this.startY = height - this.distance*Math.sin(this.angle);
    if (this.distance < handLength*0.2) {
      health-=25;
      this.state = 0;
      hurtEffectTimer = 4;
    }
  }
}
//check orientation of point P wrt a line AB
function orientation(ax, ay, bx, by, px, py) {
  var val = (by - ay) * (px - bx) - (bx - ax) * (py - by);
  if (val == 0) { return 0; }  // colinear

  return (val > 0)? 1: 2; // clock or counterclock wise
}
//Check if laser hit lightsaber
var isBlocked = function(laser1) {
  //AB Lightsaber PQ Laser front
  var o1 = orientation(saber1.startX, saber1.startY, saber1.endX(), saber1.endY(), laser1.startX, laser1.startY);
  var o2 = orientation(saber1.startX, saber1.startY, saber1.endX(), saber1.endY(), laser1.endX(), laser1.endY());
  var o3 = orientation(laser1.startX, laser1.startY, laser1.endX(), laser1.endY(), saber1.startX, saber1.startY);
  var o4 = orientation(laser1.startX, laser1.startY, laser1.endX(), laser1.endY(), saber1.endX(), saber1.endY());

  if (o1 != o2 && o3 != o4) {
    return true;
  }

  return false;
};

var saber1 = new saber();

var endScreen = function() {

  clear();

  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";

  // ctx.fillStyle = "rgba(240,240,240, 0.9)";
  // ctx.fillRect(width*0.3, height*0.1, width*0.4, height*0.8);

  text = points > 100 ? "AWESOME!" : points != 0 ? "NICE TRY!" : "HIT ATLEAST ONE, YOU MUST!";

  ctx.fillStyle = "white";
  ctx.font = height*0.1*0.3 + "px Droid Sans";
  ctx.textAlign = "center";
  ctx.fillText(text, width/2, height*0.25);

  // ctx.fillStyle = "black";
  ctx.font = height*0.1*0.3 + "px Droid Sans";
  ctx.textAlign = "center";
  ctx.fillText("POINTS:", width/2, height*0.35);


  ctx.font = height*0.3 + "px Droid Sans";
  ctx.textAlign = "center";
  ctx.fillText(Math.floor(points*cycles/100), width/2, height*0.6);

  var img = new Image();
  img.src="images/fshare.png";
  ctx.drawImage(img, width/2 - 100, height*0.75);

  var img2 = new Image();
  img2.src = "images/vader.png";
  ctx.drawImage(img2, -512, -50);

  var img3 = new Image();
  img3.src = "images/yoda.png";
  ctx.drawImage(img3, width-285, -50);

  fbbutton.style.display = "block";

  // if(points>=100) {
  //
  // }
  // img.onload = function() {
  //   ctx.drawImage(img, width*0.53, height*0.3, width*0.15, height*0.3);
  // }
  // img.src = 'images/1413631-cwyoda_b_4c.jpg';

  //Lightsaber part
  // {
  //   var startSaberX = width*0.37;
  //   var startSaberY = height*0.7;
  //   var saberHeight = height*0.5;
  //
  //   ctx.strokeStyle="grey";
  //   ctx.lineWidth=12;
  //   drawLine(startSaberX, startSaberY, startSaberX, startSaberY - saberHeight*0.2);
  //
  //   ctx.strokeStyle="grey";
  //   ctx.lineWidth=16;
  //   drawLine(startSaberX, startSaberY, startSaberX, startSaberY - saberHeight*0.01);
  //
  //   ctx.strokeStyle="#333";
  //   ctx.lineWidth=14;
  //   drawLine(startSaberX, startSaberY-saberHeight*0.01, startSaberX, startSaberY - saberHeight*0.06);
  //
  //   ctx.strokeStyle="#333";
  //   ctx.lineWidth=13;
  //   drawLine(startSaberX, startSaberY-saberHeight*0.11, startSaberX, startSaberY - saberHeight*0.12);
  //
  //   ctx.strokeStyle="#333";
  //   ctx.lineWidth=13;
  //   drawLine(startSaberX, startSaberY-saberHeight*0.125, startSaberX, startSaberY - saberHeight*0.135);
  //
  //   ctx.strokeStyle="#333";
  //   ctx.lineWidth=13;
  //   drawLine(startSaberX, startSaberY-saberHeight*0.14, startSaberX, startSaberY - saberHeight*0.15);
  //
  //   ctx.strokeStyle="#333";
  //   ctx.lineWidth=13;
  //   drawLine(startSaberX, startSaberY-saberHeight*0.155, startSaberX, startSaberY - saberHeight*0.165);
  //
  //   ctx.strokeStyle='rgba(0,0,0,0.5)';
  //   ctx.lineWidth=7;
  //   drawLine(startSaberX, startSaberY-saberHeight*0.2, startSaberX, startSaberY-saberHeight*0.2-saberHeight*0.8 );
  //
  //   percentComp = points>topPoints?100:Math.floor(points*100/topPoints);
  //   ctx.strokeStyle=saberColor;
  //   ctx.lineWidth=7;
  //   drawLine(startSaberX, startSaberY-saberHeight*0.2, startSaberX, startSaberY-saberHeight*0.2-saberHeight*0.8*cycles*percentComp/(100*100));
  //
  //   ctx.strokeStyle="rgba(255,255,255,0.9)";
  //   ctx.lineWidth=3;
  //   drawLine(startSaberX, startSaberY-saberHeight*0.2, startSaberX, startSaberY-saberHeight*0.2-saberHeight*0.79*cycles*percentComp/(100*100));
  //
  //   ctx.strokeStyle="grey";
  //   ctx.lineWidth=18;
  //   drawLine(startSaberX, startSaberY-saberHeight*0.19, startSaberX, startSaberY - saberHeight*0.2);
  // }


  // ctx.fillStyle = 'rgba(0,0,0,0.9)';
  // ctx.fillRect(width*0.3, height*0.75, width*0.4, height*0.15);
  // ctx.font = "bold " + height*0.15*0.3 + "px Droid Sans";
  // ctx.fillStyle = "#ff6";
  // ctx.textAlign = "center";
  // ctx.fillText("E X C E L   P L A Y ", width/2, height*0.75 + height*0.15*0.4);
  // ctx.font = height*0.15*0.2 + "px Droid Sans";
  // ctx.fillStyle = "rgba(255,255,102, 0.5)";
  // ctx.fillText("-   C   O   M   I   N   G       S   O   O   N   -", width/2, height*0.75 + height*0.15*0.7);

  pappu();

}

function pappu() {

  if (cycles == 0)
    eLoop = setInterval(endScreen, 1000 / 50);

  if(cycles <= 100 && gameState == 0) {
    cycles++;
  }

  if (cycles > 100) {
    clearInterval(eLoop);
    eLoop = null;
  }

}

var staging = true;

var GameLoop = function() {
  clear();

  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";

  if(cycles >= laserGenTime) {
    lasers.push(new laser());
    cycles = 0;
  }

  if (!staging) {

    laserGenTime = laserGenTime<=20?20:100 - points;
    cycles++;
    if (hurtEffectTimer-- > 0) {
      var grd=ctx.createRadialGradient(width/2,height/2,0,width/2,height/2,width*0.9);
      grd.addColorStop(0,'rgba(0,0,0,0)');
      grd.addColorStop(1,'rgba(255,0,0,0.6)');
      ctx.fillStyle = grd;
      ctx.fillRect(0,0,width,height);
    }

  }

  hud();

  if (!staging && initMessageTime > 0) {
    initMessageTime--;
    console.log(initMessageTime);
  }

<<<<<<< HEAD
  // if (initMessageTime > 0 && staging) {
    // console.log(initMessageTime);
    ctx.fillStyle = "rgba(240,240,240,"+ initMessageTime/200 + ")";
    ctx.textAlign = "center";
    ctx.font = width*0.02/(200-initMessageTime+1) + "px Droid Sans";
    ctx.fillText(" Deflect the blasts with your lightsaber! ", width/2, height/5);
    ctx.font = width*0.015/(200-initMessageTime+1) + "px Droid Sans";
    ctx.fillText(" Use the 'a' and 'd' keys to switch your hold. ", width/2, height/5 + width*0.03);
    ctx.fillText(" Click anywhere to start ", width/2, height/2);
  // }

  if(health <= 0) {
    gameState = 0;
    cycles = 0;
    lightsaberMoveAudio.pause();
    window.addEventListener('click', function() {
     lightsaberMoveAudio.play();
    });
    clearInterval(gLoop);
    endScreen();
  }
  else if(gameState == 1) {
    window.addEventListener('click', function() {
     lightsaberMoveAudio.play();
    });
  }

=======
>>>>>>> 9b80d7b5d31cd076439e56db9f07f239abaa7e0d
  for( i=0; i<lasers.length ; i++) {
    lasers[i].update();
    lasers[i].draw();
    if(lasers[i].state == 1 && isBlocked(lasers[i])) {
      lightsaberHitAudio.pause();
      if (!isNaN(lightsaberHitAudio.duration)) {
        lightsaberHitAudio.currentTime = 0;
      }
      lightsaberHitAudio.play();
      points+=5;
      lasers[i].state = 2;

      lasers[i].initX = lasers[i].startX;
      lasers[i].initY = lasers[i].startY;

      lasers[i].angle = 2*handAngle - lasers[i].angle;
      lasers[i].distance = 0;
    }
    if(lasers[i].state == 0) {
      lasers.splice(i, 1);
    }
  }
<<<<<<< HEAD

  saber1.draw();

}

=======
  if(cycles >= laserGenTime) {
    lasers.push(new laser());
    cycles = 0;
  }

  saber1.draw();
  laserGenTime = laserGenTime<=20?20:100 - points;
  cycles++;
  if (hurtEffectTimer-- > 0) {
    var grd=ctx.createRadialGradient(width/2,height/2,0,width/2,height/2,width*0.9);
    grd.addColorStop(0,'rgba(0,0,0,0)');
    grd.addColorStop(1,'rgba(255,0,0,0.6)');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,width,height);
  }

  hud();

  if (initMessageTime>0) {
    ctx.fillStyle = "rgba(255,255,255,"+ initMessageTime/200 + ")";
    ctx.font = width*0.02 + "px Droid Sans";
    ctx.textAlign = "center";
    ctx.fillText(" Deflect the blasts with your lightsaber! ", width/2, height/5);
    initMessageTime--;
  }

  if(health <= 0) {
    gameState = 0;
    cycles = 0;
    lightsaberMoveAudio.pause();
    lightsaberOnAudio.play();
    clearInterval(gLoop);
    endScreen();
  }
  else if(gameState == 1) {
    lightsaberMoveAudio.play();
  }
}

if (/Mobi|Tablet|iPad|iPhone/.test(navigator.userAgent)) {
  document.addEventListener("touchmove", function(e) {
    var x = e.changedTouches[0].clientX;
    var y = e.changedTouches[0].clientY;
    handAngle = Math.atan2(height-y, x-width/2);
  });
}
else {
  document.addEventListener("mousemove", function(e) {
    var x = e.clientX;
    var y = e.clientY;
  });
}
>>>>>>> 9b80d7b5d31cd076439e56db9f07f239abaa7e0d
document.addEventListener("click", function(e) {
  if(gameState == 0) {
    restart();
  }
});
