var c = document.getElementById('c'),
width = c.width,
height = c.height,
gLoop,
ctx = c.getContext('2d');

var clear = function() {
  ctx.fillStyle = '#d0e7f9';

  ctx.fill();
}

var drawBG = function() {
  ctx.beginPath();
  ctx.fillStyle = "#c82124"; //red

  ctx.rect(0, height*0.8, width, height);
  ctx.fill();

}

var GameLoop = function() {
  clear();
  drawBG();

  gLoop = setTimeout(GameLoop, 1000 / 50);
}
// GameLoop();
