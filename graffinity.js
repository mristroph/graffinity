context = document.getElementById('currentCanvas').getContext("2d");
context.strokeStyle = "#444444";
context.lineJoin = "round";
context.lineWidth = 5;
    
var x;
var y;
var paint;

var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

ws.onmessage = function (event) {
    var p = JSON.parse(event.data);
    addLine(p[0],p[1],p[2],p[3]);
};

$('#currentCanvas').mousedown(function(e){
	x = e.pageX - this.offsetLeft;
	y = e.pageY - this.offsetTop;
	paint = true;
    });

$('#currentCanvas').mousemove(function(e){
	if(paint){
	    oldX = x;
	    oldY = y;
	    x = e.pageX - this.offsetLeft;
	    y = e.pageY - this.offsetTop;
	    ws.send(JSON.stringify([oldX,oldY,x,y]));
	    addLine(oldX, oldY, x, y);
	}
    });

function addLine(x1,y1,x2,y2) {
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2, y2, true);
    context.closePath();
    context.stroke();

}

$('#currentCanvas').mouseup(function(e){
	paint = false;
    });

$('#currentCanvas').mouseleave(function(e){
	paint = false;
    });

