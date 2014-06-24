context = document.getElementById('currentCanvas').getContext("2d");
var connected = false;
var x;
var y;
var paint;
var color = "#444444";
var width = 5;

var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

ws.onmessage = function (event) {
    var p = JSON.parse(event.data);
    addLine(p[0],p[1],p[2],p[3],p[4],p[5]);
};

ws.onopen = function (event) {
    connected = true;
};

ws.onclose = function (event) {
    connected = false;
};

ws.onerror = function (event) {
    connected = false;
};


function addLine(x1,y1,x2,y2,lineColor,lineWidth) {
    context.strokeStyle = lineColor;
    context.lineJoin = "round";
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2, y2, true);
    context.closePath();
    context.stroke();
}

$('#currentCanvas').mousedown(function(e){
	x = e.pageX - this.offsetLeft;
	y = e.pageY - this.offsetTop;
	paint = true;
    });

$('#currentCanvas').mousemove(function(e){
	if(paint && connected){
	    oldX = x;
	    oldY = y;
	    x = e.pageX - this.offsetLeft;
	    y = e.pageY - this.offsetTop;
	    addLine(oldX, oldY, x, y, color, width);
	    ws.send(JSON.stringify([oldX,oldY,x,y,color,width]));

	}
    });

$('#currentCanvas').mouseup(function(e){
	paint = false;
    });

$('#currentCanvas').mouseleave(function(e){
	paint = false;
    });
