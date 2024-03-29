// Elements
var context = document.getElementById('currentCanvas').getContext("2d");
var $body = $('body');
var $currentCanvas = $('#currentCanvas');

// Variables
var connected = false;
var color = "#444444";
var width = 5;
var x;
var y;
var paint;


var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

ws.onmessage = function (event) {
  var p = JSON.parse(event.data);

  addLine(p[0] - offsets.x, p[1] - offsets.y, p[2]- offsets.x, p[3] - offsets.y, p[4], p[5]);
};

ws.onopen = function (event) {
  connectedFunction();
  centerCanvas();
};

ws.onclose = function (event) {
  disconnectedFunction();
};

ws.onerror = function (event) {
  disconnectedFunction();
};

function sendNumber() {
  if (connected) {
    var number = Math.round(Math.random() * 0xFFFFFF);
    ws.sendUTF(number.toString());
    setTimeout(sendNumber, 1000);
  }
}
sendNumber();

function connectedFunction() {
  connected = true;
  $body.removeClass("disconnected").addClass("connected");
}
function disconnectedFunction() {
  connected = false;
  $body.removeClass("connected").addClass("disconnected");
}

function addLine(x1, y1, x2, y2, lineColor, lineWidth) {
  context.strokeStyle = lineColor;
  context.lineJoin = "round";
  context.lineWidth = lineWidth;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2, true);
  context.closePath();
  context.stroke();
}

$currentCanvas.mousedown(function (e) {
  paint = true;
  if (e.shiftKey) {
    drawLine(e);
  } else {
    x = e.pageX - windowWidth + width/2;
    y = e.pageY - windowHeight + width/2;
  }
});

$currentCanvas.mousemove(drawLine);
function drawLine(e) {
  if (paint && connected) {
    oldX = x;
    oldY = y;
    x = e.pageX - windowWidth + width/2;
    y = e.pageY - windowHeight + width/2;
    var rgb = hexToRgb(color);
    addLine(oldX, oldY, x, y, 'rgba('+rgb.r+','+rgb.g+','+rgb.b+', 0.3)', width);
    ws.send(JSON.stringify({draw: [oldX+offsets.x, oldY+offsets.y, x+offsets.x, y+offsets.y, color, width]}));
  }
}

$currentCanvas.mouseup(function (e) {
  paint = false;
});

$currentCanvas.mouseleave(function (e) {
  paint = false;
});


/* START: color picker */
$('#bgcolor').on('change', function() {
    color = this.value;
    makeCursor();
});

/* END: color picker */

/* START: cursor code */
makeCursor();

function makeCursor() {
  var cursor = document.createElement('canvas');
  cursor.width = cursor.height = width;
  ctx = cursor.getContext('2d');
  ctx.fillStyle = color;
  //ctx.fillRect(0, 0, 10, 10);
  ctx.beginPath();
  ctx.arc(width/2,width/2,width/2,0,2*Math.PI);
  ctx.fill();

  document.body.style.cursor = 'url(' + cursor.toDataURL() + ') 5 5, auto';
  renderSample();
}
function renderSample(){
  $('#brush-size .sample').css({
    background: $('#bgcolor').val(),
    width: width,
    height: width
  });
}

/* END: cursor code */
var offsets = {x:0,y:0};
var centering = false;
var windowHeight, windowWidth;
var $window = $(window);
var centerCanvas = function centerCanvas(param) {
  if (centering) {
    return;
  }
  centering = true;
  windowWidth = $(window).width();
  windowHeight = $(window).height();
  var canvasWidth = $currentCanvas.width();
  var canvasHeight = $currentCanvas.height();

  if (param && param.scrollTop) {
    var img = context.getImageData(0, 0, canvasWidth, canvasWidth);
//
//    var $subcanvas = $('<canvas>', {id: 'subcanvas'})
//      .attr('width', canvasWidth)
//      .attr('height', canvasHeight)
//      .css({
//        // scrollTop = 0 : top = wh;
//        // scrollTop = 1wh: top= 0;
//        // scrollTop = 2wh: top=-wh;
//        top: windowHeight*2 - param.scrollTop,
//        left: windowWidth*3 - param.scrollLeft,
//        display: 'block'
//      })
//      .appendTo('#scroll-space');
//    $subcanvas[0].getContext('2d').putImageData(
//
//    );


  } else {
    $currentCanvas
      .attr('width', windowWidth * 3)
      .attr('height', windowHeight * 3);
    $('#scroll-space').css({
      width: windowWidth * 5,
      height: windowHeight * 5
    });
  }

  $('body')
    .scrollTop(windowHeight * 2)
    .scrollLeft(windowWidth * 2);
  context.clearRect(0,0,canvasWidth, canvasHeight);
  if (img) {
    context.putImageData(img, -offsets.relX, -offsets.relY);
  }
  ws.send(JSON.stringify({replay: {
    x: offsets.x,
    y: offsets.y,
    w: windowWidth * 3,
    h: windowHeight * 3}}));
  centering = false;
}

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

$(function () {
  var timeout;
  $window
    .resize(function (e) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(centerCanvas, 500);
    })
    .scroll(function(){
      var scrollTop = $(this).scrollTop();
      var scrollLeft = $(this).scrollLeft();
      if (scrollTop < windowHeight
          || scrollTop > windowHeight * 3
          || scrollLeft < windowWidth
          || scrollLeft > windowWidth * 3) {
        offsets.relX = scrollLeft - (windowWidth * 2);
        offsets.relY = scrollTop - (windowHeight * 2);
        offsets.x += offsets.relX;
        offsets.y += offsets.relY;

        setTimeout(function(){
          centerCanvas({scrollTop: scrollTop, scrollLeft: scrollLeft});
        }, 0);
      }
    });

   $('#brush-size input').change(function (e) {
    width = $(this).val();
    makeCursor();
  }).val();

});

