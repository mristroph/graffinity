// Elements
var context = document.getElementById('currentCanvas').getContext("2d");
var $body = $('body');
var $currentCanvas = $('#currentCanvas');
var $colors = $("#colors");

// Variables
var connected = false;
var color = "#444444";
var width = 5;
var x;
var y;
var paint;


var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

ws.onmessage = function (event) {
    var p = JSON.parse(event.data);
    addLine(p[0],p[1],p[2],p[3],p[4],p[5]);
};

ws.onopen = function (event) {
    connectedFunction();
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

$currentCanvas.mousedown(function(e){
	x = e.pageX - this.offsetLeft;
	y = e.pageY - this.offsetTop;
	paint = true;
    });

$currentCanvas.mousemove(function(e){
	if(paint && connected){
	    oldX = x;
	    oldY = y;
	    x = e.pageX - this.offsetLeft;
	    y = e.pageY - this.offsetTop;
	    addLine(oldX, oldY, x, y, color, width);
	    ws.send(JSON.stringify([oldX,oldY,x,y,color,width]));

	}
    });

$currentCanvas.mouseup(function(e){
	paint = false;
});

$currentCanvas.mouseleave(function(e){
	paint = false;
});


/* START: color palette */
var CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
$.each(CSS_COLOR_NAMES, function( index, value ) {
    $colors.append('<div id="' + value + '" style="background-color: ' + value + ';"></div>');
});

$('#colors div').mousedown(function(e){
    color = this.id;
    makeCursor();
});
/* END: color palette */

/* START: cursor code */
makeCursor();

function makeCursor() {
    var cursor = document.createElement('canvas');
    cursor.width = 10;
    cursor.height = 10;
    ctx = cursor.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0,0,10,10);
    document.body.style.cursor = 'url(' + cursor.toDataURL() + ') 5 5, auto';
}
/* END: cursor code */