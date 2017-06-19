// JavaScript Document

var gravityConstant = 8;
var mouseConstant = 1000;
var drag = 0.9995;
var bodySize = 8;

var bodies;
var gameCanvas;
var mouse;

var mouseActive = true;


function init() {
	gameCanvas = document.getElementById("gameCanvas");
	mouse = new Vector(0, 0)
	
	window.onresize = function() {
		gameCanvas.width = document.body.clientWidth;
		gameCanvas.height = document.body.clientHeight;	
	}
	window.onresize();
	
	document.onmousemove = function(e){
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	}
	
	document.onclick = function() {
		gravityConstant *= -1;
		mouseConstant *= -1;
	}
	
	document.ondblclick = function() {
		if(mouseActive)
			mouseActive = false;
		else
			mouseActive = true;	
	}
	
	/*var numBodies = gameCanvas.width * gameCanvas.height / 25000;
	if(numBodies > 110)
		numBodies = 110;
	console.log(numBodies);*/
	
	var numBodies = 70;
	bodies = new Array()
	
	for(var i = 0; i < numBodies; i++) {
		bodies.push(new Body(Math.random() * gameCanvas.width, Math.random() * gameCanvas.height));
	}
	
	tick(new Date().getTime());
}

function tick(lastTime) {
	var currentTime = new Date().getTime();
	var deltaTime = lastTime - currentTime;
	
	for(var i = 0; i < bodies.length; i++) {
		bodies[i].calculate(bodies);	
	}
	for(var i = 0; i < bodies.length; i++) {
		bodies[i].move(deltaTime);	
	}
	
	var c = gameCanvas.getContext("2d");
	c.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		
	for(var i = 0; i < bodies.length; i++) {
		var speed = bodies[i].movement.length();
		var green = Math.round(255 / (speed / 0.07));
		if(green > 255)
			green = 255;
		var red = 255 - green;
		
		console.log();
		
		c.fillStyle = "rgb(" + red + "," + green + ",0)";
		c.fillRect(bodies[i].position.x, bodies[i].position.y, bodySize, bodySize);
	}
	
	setTimeout(function() {tick(currentTime);}, 1000/60);
}

//Body class
var Body = function(x, y) {
	this.position = new Vector(x, y);
	this.movement = new Vector(0, 0);
	
	Body.prototype.calculate = function(bodies) {
		var force = new Vector(0, 0);
		for(var i = 0; i < bodies.length; i++) {
			var dir = this.position.difference(bodies[i].position);
			var distance = dir.length();
			dir = dir.normalized();

			if(distance > 350 || distance < 10)
				continue;
			
			var f = window.gravityConstant/Math.pow(distance, 2);
			dir.multScal(f);
			force.add(dir);
		}
		
		if(mouseActive) {
			var dir = this.position.difference(mouse);
			var distance = dir.length();
			dir = dir.normalized();
	
			if(distance > 50 && distance < 150) {
				f = window.mouseConstant/Math.pow(distance, 2);
				dir.multScal(f);
				force.add(dir);
			}
		}
		
		this.movement.add(force);
		this.movement.multScal(drag);
	}
	
	Body.prototype.move = function(deltaTime) {
		if((this.position.x <= 0 && this.movement.x > 0) || (this.position.x + bodySize >= gameCanvas.width && this.movement.x < 0)) {
			if(Math.abs(this.movement.x) * 0.7 < 0.05)
				this.movement.x *= -1
			else {
				this.movement.x *= -0.7;
				this.movement.y *= 0.7;
			}	
		}
		if((this.position.y <= 0 && this.movement.y > 0) || (this.position.y + bodySize >= gameCanvas.height && this.movement.y < 0)) {
			if(Math.abs(this.movement.y) * 0.7 < 0.05)
				this.movement.y *= -1
			else {
				this.movement.y *= -0.7;
				this.movement.x *= 0.7;	
			}	
		}
		
		this.position.x += this.movement.x * deltaTime;
		this.position.y += this.movement.y * deltaTime;
	}
}

//Vector class
var Vector = function(x, y) {
	this.x = x;
	this.y = y;
	
	//returns the distance to the provided vector
	Vector.prototype.distanceTo = function(vector) {
		return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
	}
	
	//returns the length of the vector
	Vector.prototype.length = function() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));	
	}
	
	//returns a new vector that is the difference between two vectors
	Vector.prototype.difference = function(vector) {
		return new Vector(this.x - vector.x, this.y - vector.y);	
	}
	
	//adds vector to this vector
	Vector.prototype.add = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}
	
	//returns the normalized version of the vector
	Vector.prototype.normalized = function() {
		var length = this.length();
		
		return new Vector(this.x/length, this.y/length);
	}
	
	//Multiplies vector with a scalar
	Vector.prototype.multScal = function(scalar) {
		this.x *= scalar;
		this.y *= scalar;	
	}
}