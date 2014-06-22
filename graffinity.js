context = document.getElementById('currentCanvas').getContext("2d");
context.strokeStyle = "#444444";
context.lineJoin = "round";
context.lineWidth = 5;
    
var x;
var y;
var paint;

$('#currentCanvas').mousedown(function(e){
	x = e.pageX - this.offsetLeft;
	y = e.pageY - this.offsetTop;
	paint = true;
    });

$('#currentCanvas').mousemove(function(e){
	if(paint){
	    context.beginPath();
	    context.moveTo(x,y);
	    x = e.pageX - this.offsetLeft;
	    y = e.pageY - this.offsetTop;
	    context.lineTo(x, y, true);
	    context.closePath();
	    context.stroke();
	}
    });


$('#currentCanvas').mouseup(function(e){
	paint = false;
    });

$('#currentCanvas').mouseleave(function(e){
	paint = false;
    });

var host = location.origin.replace(/^http/, 'ws')
    var ws = new WebSocket(host);
ws.onmessage = function (event) {
    var li = document.createElement('li');
    li.innerHTML = JSON.parse(event.data);
    document.querySelector('#messages').appendChild(li);
};
