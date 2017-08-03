var c = document.getElementById('c');

c.height = screen.height;
c.width = screen.width;

var width = c.width,
height = c.height,
gLoop,
eLoop = null,
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

lightsaberHitAudio.volume = 0.2;
lightsaberMoveAudio.volume = 0.1;
lightsaberOnAudio.volume = 0.2;

var clear = function() {
  ctx.fillStyle = '#000';
  ctx.rect(0, 0, width, height);
  ctx.fill();
}

var restart = function() {
  saberColor = colorSet[Math.floor(Math.random()*colorSet.length)];
  gameState = 1;
  points = 0;
  health = 100;
  cycles = 0;
  laserGenTime = 100;
  lasers = [];
  gLoop = setInterval(GameLoop, 1000 / 50);
}

var hud = function() {
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "small-caps " + width*0.012 + "px Droid Sans";
  ctx.fillText("Points: " + points,width*0.04,height*0.04);

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
  this.holdAngle = Math.PI/2;
  this.startX = width/2 + handLength*Math.cos(handAngle);
  this.startY =  height - handLength*Math.sin(handAngle);
  this.deltaX = this.length*Math.cos(this.holdAngle-handAngle);
  this.deltaY =  this.length*Math.sin(this.holdAngle-handAngle);
  this.endX = function() { return this.startX - this.deltaX; }
  this.endY = function() { return this.startY - this.deltaY; }

  this.draw = function() {
    var r = handLength;
    var theta = handAngle;
    this.startX = width/2 + r*Math.cos(theta);
    this.startY =  height - r*Math.sin(theta);
    this.deltaX = this.length*Math.cos(this.holdAngle-theta);
    this.deltaY =  this.length*Math.sin(this.holdAngle-theta);

    ctx.strokeStyle="grey";
    ctx.lineWidth=5;
    drawLine(this.startX, this.startY, this.startX - this.deltaX*0.12, this.startY - this.deltaY*0.12);

    ctx.strokeStyle="#333";
    ctx.lineWidth=5;
    drawLine(this.startX - this.deltaX*0.01, this.startY - this.deltaY*0.01, this.startX - this.deltaX*0.02, this.startY - this.deltaY*0.02);

    ctx.strokeStyle="#333";
    ctx.lineWidth=5;
    drawLine(this.startX - this.deltaX*0.04, this.startY - this.deltaY*0.04, this.startX - this.deltaX*0.05, this.startY - this.deltaY*0.05);

    ctx.strokeStyle=saberColor;
    ctx.lineWidth=4;
    drawLine(this.startX - this.deltaX*0.12, this.startY - this.deltaY*0.12, this.startX - this.deltaX, this.startY - this.deltaY);

    ctx.strokeStyle= "white";
    ctx.lineWidth=1;
    drawLine(this.startX - this.deltaX*0.10, this.startY - this.deltaY*0.10, this.startX - this.deltaX*0.99, this.startY - this.deltaY*0.99);

    ctx.strokeStyle="#grey";
    ctx.lineWidth=7;
    drawLine(this.startX - this.deltaX*0.11, this.startY - this.deltaY*0.11, this.startX - this.deltaX*0.12, this.startY - this.deltaY*0.12);
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

  //Laser collides to only 30% its length
  this.endX = function() { return width/2 + (this.distance+this.length*0.4)*Math.cos(this.angle); }
  this.endY = function() { return height - (this.distance+this.length*0.4)*Math.sin(this.angle); }

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

  ctx.fillStyle = "rgba(240,240,240, 0.9)";
  ctx.fillRect(width*0.3, height*0.1, width*0.4, height*0.8);

  ctx.fillStyle = "black";
  ctx.font = height*0.1*0.4 + "px Droid Sans";
  ctx.textAlign = "center";
  ctx.fillText("POINTS: " + Math.floor(points*cycles/100), width/2, height*0.25);


  // if(points>=100) {
  //
  // }
  // img.onload = function() {
  //   ctx.drawImage(img, width*0.53, height*0.3, width*0.15, height*0.3);
  // }
  // img.src = 'images/1413631-cwyoda_b_4c.jpg';

  //Lightsaber part
  {
    var startSaberX = width*0.37;
    var startSaberY = height*0.7;
    var saberHeight = height*0.5;

    ctx.strokeStyle="grey";
    ctx.lineWidth=12;
    drawLine(startSaberX, startSaberY, startSaberX, startSaberY - saberHeight*0.2);

    ctx.strokeStyle="grey";
    ctx.lineWidth=16;
    drawLine(startSaberX, startSaberY, startSaberX, startSaberY - saberHeight*0.01);

    ctx.strokeStyle="#333";
    ctx.lineWidth=14;
    drawLine(startSaberX, startSaberY-saberHeight*0.01, startSaberX, startSaberY - saberHeight*0.06);

    ctx.strokeStyle="#333";
    ctx.lineWidth=13;
    drawLine(startSaberX, startSaberY-saberHeight*0.11, startSaberX, startSaberY - saberHeight*0.12);

    ctx.strokeStyle="#333";
    ctx.lineWidth=13;
    drawLine(startSaberX, startSaberY-saberHeight*0.125, startSaberX, startSaberY - saberHeight*0.135);

    ctx.strokeStyle="#333";
    ctx.lineWidth=13;
    drawLine(startSaberX, startSaberY-saberHeight*0.14, startSaberX, startSaberY - saberHeight*0.15);

    ctx.strokeStyle="#333";
    ctx.lineWidth=13;
    drawLine(startSaberX, startSaberY-saberHeight*0.155, startSaberX, startSaberY - saberHeight*0.165);

    ctx.strokeStyle='rgba(0,0,0,0.5)';
    ctx.lineWidth=7;
    drawLine(startSaberX, startSaberY-saberHeight*0.2, startSaberX, startSaberY-saberHeight*0.2-saberHeight*0.8 );

    percentComp = points>topPoints?100:Math.floor(points*100/topPoints);
    ctx.strokeStyle=saberColor;
    ctx.lineWidth=7;
    drawLine(startSaberX, startSaberY-saberHeight*0.2, startSaberX, startSaberY-saberHeight*0.2-saberHeight*0.8*cycles*percentComp/(100*100));

    ctx.strokeStyle="rgba(255,255,255,0.9)";
    ctx.lineWidth=3;
    drawLine(startSaberX, startSaberY-saberHeight*0.2, startSaberX, startSaberY-saberHeight*0.2-saberHeight*0.79*cycles*percentComp/(100*100));

    ctx.strokeStyle="grey";
    ctx.lineWidth=18;
    drawLine(startSaberX, startSaberY-saberHeight*0.19, startSaberX, startSaberY - saberHeight*0.2);
  }


  ctx.fillStyle = 'rgba(0,0,0,0.9)';
  ctx.fillRect(width*0.3, height*0.75, width*0.4, height*0.15);
  ctx.font = "bold " + height*0.15*0.3 + "px Droid Sans";
  ctx.fillStyle = "#ff6";
  ctx.textAlign = "center";
  ctx.fillText("E X C E L   P L A Y ", width/2, height*0.75 + height*0.15*0.4);
  ctx.font = height*0.15*0.2 + "px Droid Sans";
  ctx.fillStyle = "rgba(255,255,102, 0.5)";
  ctx.fillText("-   C   O   M   I   N   G       S   O   O   N   -", width/2, height*0.75 + height*0.15*0.7);

  if (!eLoop) pappu();

}

function pappu() {

  if(cycles < 100 && gameState == 0) {
    cycles++;
    eLoop = setTimeout(endScreen, 1000 / 50);
  }

  if (cycles == 100) {
    clearTimeout(eLoop);
    eLoop = null;
  }

}

var GameLoop = function() {
  clear();

  saber1.draw();

  if(cycles >= laserGenTime) {
    lasers.push(new laser());
    cycles = 0;
  }

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

}

document.addEventListener("mousemove", function(e) {
  var x = e.clientX;
  var y = e.clientY;
  handAngle = Math.atan2(height-y, x-width/2);
});

document.addEventListener("click", function(e) {
  if(gameState == 0) {
    restart();
  }
});
