let canvas = document.getElementById('canvas');
let canvasCtx = canvas.getContext('2d');
let disFromLine = 200;
let getColor = function(num){
	if(num - Math.floor(num) != 0){
		num = num - Math.floor(num);
		while(num.toFixed(5) - Math.floor(num.toFixed(5)) != 0){
			num *= 10;
		}
		return +num.toFixed(5);
	}
	else{
		return num;
	}
}
let targets = [ [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2,2.2],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3]];
/*for(let arr of targets){
	let index = 0;
	while(index < arr.length){
		let i = Math.floor(Math.random()*3)+1;
		arr[index] = 1 + (i/10);
		index++;
	}
}*/
console.log(targets);
player = {
	X : canvas.width*0.5,
	Y : canvas.height*0.9,
	width : 100,
	height : 20,
	color : "blue",
	dx : 1,
};
ball = {
	X : canvas.width*0.5,
	Y : canvas.height*0.9 - 5,
	radius : 5,
	color : "blue",
	dr : 0.5,
}
let margin = 5;
obstacle = {
	width : (canvas.width - margin*(targets[0].length+1))/targets[0].length,
	height : (player.Y - disFromLine - margin*targets.length)/targets.length,
	color : ["blue","red","green"],
}
let lives = 3;
//SOUNDS
let hit = new Audio("Audios/hit.wav");

//CUSTOUM FUNCTIONS
function npx(str){
	return str.slice(0,-2);
}
let started = false;
let screentimeout = true;
//SPECIAL
let special = false
//START LOOP
let r = 25;
let numOPoints = 18;
let deg = Math.PI/180;
let dtheta = 15*deg;
let dr = 0.5;
let theta = 90;
let t = 0;
let rightKey = false;
let leftKey = false;
let justvar = true;
gameloop = 0;
let obstaclesLeft = targets.length*targets[0].length;
function drawTargets(){
	let i = 0;
	while(i < targets.length){
		let j = 0;
		while(j < targets[i].length){
			if(targets[i][j] >= 1){
				canvasCtx.fillStyle = obstacle.color[getColor(targets[i][j])-1];
				canvasCtx.fillRect(margin*(j+1) + j*obstacle.width,margin*(i +1) +i*obstacle.height,
									obstacle.width,obstacle.height);
				canvasCtx.fillStyle = "black";
			}
			j++;
		}
		i++;
	}
}
function drawPlayer(){
	canvasCtx.fillStyle = player.color;
	canvasCtx.fillRect(player.X - player.width/2,player.Y,player.width,player.height);
	canvasCtx.fillStyle = "black";
}
function drawBall(){
	canvasCtx.fillStyle = ball.color;
	canvasCtx.beginPath();
	canvasCtx.moveTo(0,0);
	canvasCtx.arc(ball.X,ball.Y, ball.radius, 0, 2*Math.PI);
	canvasCtx.fill();
	canvasCtx.fillStyle = "black";
}
function reset(){
	canvasCtx.clearRect(0,0,canvas.width,canvas.height);
}
function draw(angle, sd, dis){
	canvasCtx.fillStyle = "grey"
	let i = 0;
	while(i < numOPoints){
		canvasCtx.beginPath();
		canvasCtx.moveTo(0,0);
		let x = (sd + i*dis)*Math.cos(angle*deg);
		let y = -(sd + i*dis)*Math.sin(angle*deg);
		if((sd+i*dis) < (disFromLine/Math.sin(angle*deg))){
			canvasCtx.arc(x + ball.X, y + ball.Y, ball.radius, 0, 360*deg);
			canvasCtx.fill();
		}
		i++;
	}
	canvasCtx.fillStyle = "black";
}
document.addEventListener("keydown",function (event){
	if(event.key == "ArrowLeft"){
		if(!(leftKey)){
			leftKey = true;
		}
		}
	else if(event.key == "ArrowRight"){
		if(!(rightKey)){
			rightKey = true;
		}
	}
})
document.addEventListener("keyup",function(event){
	if(event.key == "ArrowLeft"){
		if(leftKey){
			leftKey = false;
		}
	}
	else if(event.key == "ArrowRight"){
		if(rightKey){
			rightKey = false;
		}
	}
})
document.addEventListener('keypress', function(event){
	if(event.key == " "){
		reset();
		started = true;
	}
	if(event.shiftKey){
		if(event.key = "a"){
			if(special){
				leftKey = false;
				rightKey = false;
			}
			special = !special;
		}
	}
})
{			////////////FIRST SCREENTIMEOUT
	canvasCtx.font = "80px Arial";
	canvasCtx.fillStyle = "blue";
	let textbox = canvasCtx.measureText(`Lives : ${lives}`);
	canvasCtx.fillText(`Lives : ${lives}`,canvas.width/2 - textbox.width/2,
										canvas.height/2 - 30);
	canvasCtx.fillStyle = "black";
	setTimeout(function(){
		screentimeout = false;
	},2000);
}

function checkTargets(){
	let i = 0;
	while(i < targets.length){
		let j = 0;
		while(j < targets[i].length){
			if(targets[i][j] >= 1){
				if(ball.X < (j+1)*(margin + obstacle.width) &&
					ball.X > (j+1)*margin + obstacle.width*j &&
					ball.Y < (i+1)*(margin + obstacle.height) &&
					ball.Y > (i+1)*margin + obstacle.height*i	){
						targets[i][j] -= 1;
						hit.play();
						ball.dr += 0.01;
						ball.color = obstacle.color[getColor(targets[i][j])-1];
						player.dx += 0.01;
						if(ball.Y > (i+1)*margin + obstacle.height*i){
							theta = -theta;
						}
						else{
							theta = 180 - theta;
						}
						i = targets.length;
						break;
					}
			}
			j++;
		}
		i++;
	}
}
function setgameloop(){
	if(!(started) && !screentimeout){
		if(t < r){
			t += dr;
		}
		else{
			t = 0;
		}
		if(leftKey){
			if(theta < 130){
				theta += dtheta;
			}
		}
		if(rightKey){
			if(theta > 50){
				theta -= dtheta;
			}
		}
		reset();
		draw(theta, t, r);
		drawPlayer();
		drawBall();
		drawTargets();
	}
	if(started && !screentimeout){
		if(leftKey){
			if(player.X > player.width/2){
			player.X -= player.dx;
			}
		}
		if(rightKey){
			if(player.X < canvas.width - player.width/2){
			player.X += player.dx;
			}
		}
		if(special){
			if(ball.X > player.X + 0.1*player.width){
				leftKey = false;
				rightKey = true;
			}
			else if(ball.X < player.X - 0.1*player.width){
				rightKey = false;
				leftKey = true;
			}
			else{
				leftKey = false;
				rightKey = false;
			}
		}
		ball.X += ball.dr*Math.cos(theta*deg);
		ball.Y -= ball.dr*Math.sin(theta*deg);
		if( 0 + ball.radius > ball.X || ball.X > canvas.width -ball.radius){
			theta = 180 - theta;
			document.body.style.backgroundColor = ball.color;
		}
		if( 0 + ball.radius > ball.Y){
			theta = - theta;
			document.body.style.backgroundColor = ball.color;
		}
		if(ball.Y > player.Y - ball.radius &&
			ball.Y < player.Y  - ball.radius+ ball.dr&&
			ball.X > player.X - player.width/2 &&
			ball.X < player.X + player.width/2){
			theta = (player.X + player.width/2 - ball.X)/player.width*80 + 50;
			hit.play();
		}
		reset();
		drawPlayer();
		drawBall();
		checkTargets();
		drawTargets();
		if(ball.Y > canvas.height){
			player.X = canvas.width*0.5;
			player.Y = canvas.height*0.9;
			ball.X = player.X;
			ball.Y = player.Y - ball.radius;
			theta = 90;
			started = false;
			screentimeout = true;
			reset();
			lives -= 1;
			canvasCtx.font = "80px Arial";
			canvasCtx.fillStyle = "blue";
			if(lives != 0){
				let textbox = canvasCtx.measureText(`Lives : ${lives}`);
				canvasCtx.fillText(`Lives : ${lives}`,canvas.width/2 - textbox.width/2,
									canvas.height/2 - 30);
				setTimeout(function(){
					screentimeout = false;
				},2000);
			}
			else{
				let textbox = canvasCtx.measureText(`GAME OVER`);
				canvasCtx.fillText("GAME OVER",canvas.width/2 - textbox.width/2,
										canvas.height/2 - 30);
			}
			canvasCtx.fillStyle = "black";
		}
	}
}
var gameloop = setInterval(setgameloop,1);
