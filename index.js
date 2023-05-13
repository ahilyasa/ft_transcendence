// PONG GAME!

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1500;
canvas.height = 1000;

const ballRadius = canvas.width * 0.01;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = canvas.width * 0.00050;
let ballSpeedY = canvas.height * 0.00050;
let playerSpeed = 50;

class Player
{
	constructor(playerX, playerY, playerWidth, playerHeight, playerColor) 
	{
		this.playerX = playerX;
		this.playerY = playerY;
		this.playerWidth = playerWidth;
		this.playerHeight = playerHeight;
		this.playerColor = playerColor;
		this.playerScore = 0;
	}
};

function drawPlayer(player)
{
    ctx.fillStyle = player.playerColor;
    ctx.fillRect(player.playerX, player.playerY, player.playerWidth, player.playerHeight);
}

const playerHeight = canvas.height * 0.25;
const playerWidth = canvas.width * 0.01;
let players = new Array();
players.push(new Player(10, 0, playerWidth, playerHeight, "#00CED1"));
players.push(new Player(canvas.width - playerWidth - 10, 0, playerWidth, playerHeight, "#00CED1"));

function movePlayer(direction,player)
{
	if(direction == 1)
	{
		if(player.playerY + player.playerHeight < canvas.height)
			player.playerY += playerSpeed;
	}
	else
	{
		if(player.playerY > 0)
			player.playerY -= playerSpeed;
	}
}

function onKeyDown(e) 
{
	if(e.keyCode == 40)
		movePlayer(1,players[0]);
	else if(e.keyCode == 38)
		movePlayer(0, players[0]);
	else if(e.keyCode == 83)
		movePlayer(1,players[1]);
	else if(e.keyCode == 87)
		movePlayer(0, players[1]);
}

function drawBall() 
{
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#00BFFF";
    ctx.fill();
    ctx.closePath();
}

function moveBall()
{
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0)
        ballSpeedY = -ballSpeedY;
	
	for(let i = 0; i < 2; i++)
	{
		if ((i == 0 && ballX - ballRadius <= players[i].playerX + players[i].playerWidth) || (  
			i == 1 && ballX + ballRadius >= players[i].playerX))
		{
			if (ballY > players[i].playerY && ballY < players[i].playerY + players[i].playerHeight)
			{
				ballSpeedX = -ballSpeedX;
				ballSpeedX *= 1.2;
				ballSpeedX = Math.min(Math.max(ballSpeedX, -25), 25);
			}
		}
	}
    if (ballX + ballRadius > canvas.width - 15 || ballX < canvas.clientLeft + 15)
	{
		let target = ballX + ballRadius > canvas.width ? players[0] : players[1];
		setScore(target, target.playerScore + 1);
        resetBall();
    }
}

function setScore(player, value)
{
	player.playerScore = value;
	drawScore();
}

function drawScore()
{
	for (let i = 0; i < 2; i++)
		document.getElementsByClassName("score")[i].innerHTML = players[i].playerScore;
}

function resetBall()
{
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
	let rnd = Math.random();
	if(rnd > 0.5)
		ballSpeedX = canvas.width * 0.0050;
	else
		ballSpeedX = canvas.width * -0.0050;
}


function gameLoop()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(let i = 0; i < 2; i++)
		drawPlayer(players[i]);
    moveBall();
    drawBall();    
    window.requestAnimationFrame(gameLoop);
}
window.addEventListener("keydown", onKeyDown);
gameLoop();