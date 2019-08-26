var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var ball = {
    x: 20,
    y: canvas.width - 20,
    dx: 5,
    dy: 2,
    radius: 10
}
var paddle = {
    width: 70,
    height: 10,
    x: 0,
    y: canvas.height - 10,
    speed: 10,
    isMovingLeft: false,
    isMovingRight: false
}

var BricksConfig = {
    offsetX: 25,
    offsetY: 25,
    margin: 25,
    width: 70,
    height: 15,
    totalRow: 3,
    totalCol: 5
}
var isGameOver = false;
var isGameWin = false;
var userScore = 0;
var maxScore = BricksConfig.totalCol * BricksConfig.totalRow;

var BricksList = [];
for (var i = 0; i < BricksConfig.totalRow; i++) {
    for (var j = 0; j < BricksConfig.totalCol; j++) {
        BricksList.push({
            x: BricksConfig.offsetX + j * (BricksConfig.width + BricksConfig.margin),
            y: BricksConfig.offsetY + i * (BricksConfig.height + BricksConfig.margin),
            isBroken: false
        })
    }
}


function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
}

// 2*OFFSET+5*WIDTH+4*MARGIN=500
// OFFSET=MARGIN=25
// ->WIDTH=75

function drawBricks() {
    BricksList.forEach(function (b) {
        if (!b.isBroken) {
            context.beginPath();
            context.rect(b.x, b.y, BricksConfig.width, BricksConfig.height);
            context.fill();
            context.closePath();
        }
    })
}

document.addEventListener('keyup', function (event) {
    console.log('Key Up');
    console.log(event);

    if (event.keyCode == 37) {
        paddle.isMovingLeft = false;
    }

    if (event.keyCode == 39) {
        paddle.isMovingRight = false;
    }
});
document.addEventListener('keydown', function (event) {
    console.log('Key Down');
    console.log(event);
    if (event.keyCode == 37) {
        paddle.isMovingLeft = true;
    }
    if (event.keyCode == 39) {
        paddle.isMovingRight = true;
    }
});

function hadleBallColideBounds() {
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }
}

function hadleBallColidePaddle() {
    if (ball.x + ball.radius >= paddle.x && ball.x + ball.radius <= paddle.x + paddle.width && ball.y + ball.radius >= canvas.height - paddle.height) {
        ball.dy = -ball.dy;
    }
}

function hadleBallColideBricks() {
    BricksList.forEach(function (b) {
        if (!b.isBroken) {
            if (ball.x >= b.x && ball.x <= b.x + BricksConfig.width && ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + BricksConfig.height) {
                ball.dy = -ball.dy;
                b.isBroken = true;
                userScore += 1;
                if (userScore >= maxScore) {
                    isGameOver = true;
                    isGameWin = true;
                }
            }
        }
    })
}

function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function updatePaddlePosition() {
    if (paddle.isMovingLeft) {
        paddle.x -= paddle.speed;
    }
    if (paddle.isMovingRight) {
        paddle.x += paddle.speed;
    }
    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

function checkGameOver() {
    if (ball.y > canvas.height - ball.radius) {
        isGameOver = true;
    }
}

function hadleGameOver() {
    if (isGameWin) {
        alert('YOU WIN!!!');
        document.location.reload();
    } else {
        alert('GAME OVER!!!');
        document.location.reload();
    }
}

function draw() {
    if (!isGameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        drawBall();
        drawPaddle();
        drawBricks();
        hadleBallColideBounds();
        hadleBallColidePaddle();
        hadleBallColideBricks();
        updateBallPosition();
        updatePaddlePosition();
        checkGameOver();
        requestAnimationFrame(draw);
    } else {
        hadleGameOver();
    }
}

draw();