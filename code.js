// Canvas ve 2D çizim bağlamları
var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');
var scoreText = document.getElementById("score");

// Ekran boyutlarını ayarlar
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

// Sprite dizileri
const IdleFrames = [];
const RunRightFrames = [];
const RunLeftFrames = [];
const staggerFrames = 2;

let gameFrame = 0, frameIndex = 0;

// Booleans
let isLeftRunning = false;
let isRightRunning = false;
let canFire = false;
let isDead = false;
let isShooting = false;
let isHit = false;
let isGameStopped = false;
let isGameStarted = false;

var score = 0;

const kunai = new Image();
kunai.src = "Ninja/Kunai.png";

// Playerın değişkenleri
var playerValues = {
    x: cvs.width / 2,
    y: cvs.height - 117,
    idleWitdh: 33,
    idleHeight: 62,
    runWidth: 51,
    runHeight: 65,
    speed: 10,
}

// Kunai değişkenleri
var kunaiValues = {
    x: playerValues.x + 25,
    y: cvs.height - 75,
    width: 16,
    height: 80,
}

// Ball values
var balls = [];

// Açılış Fonksiyonu
function opening()
{
    if(!isGameStarted)
    {
        var open_bg = new Image();
        var button = new Image();
        var play = new Image();
    
        open_bg.src = "UI/frame.png";
        button.src = "UI/button.png";
        play.src = "UI/Icon_Play.png";
    
        // Resmi çiz
        ctx.drawImage(open_bg, (cvs.width /2) - 150 ,( cvs.height /2) - 250 , open_bg.width + 80, open_bg.height + 160);
        ctx.drawImage(button, (cvs.width /2) -25 ,( cvs.height /2) + 120 , button.width / 3, button.height /3 );
        ctx.drawImage(play, (cvs.width /2) -15 ,( cvs.height /2) + 130 , play.width / 4, play.height /4 );
    
    
        // Metni çiz
        var text_1 = "HAREKET"; 
        var text_1_X = (cvs.width / 2) - (ctx.measureText(text_1).width / 2) + 15; 
        var text_1_Y = (cvs.height / 2) -180 ;
    
        var text_2 = "SALDIRI"; 
        var text_2_X = (cvs.width / 2) - (ctx.measureText(text_2).width / 2) + 15; 
        var text_2_Y = (cvs.height / 2) - 70 ;
    
        var text_3 = "DURAKLATMA"; 
        var text_3_X = (cvs.width / 2) - (ctx.measureText(text_3).width / 2) + 15; 
        var text_3_Y = (cvs.height / 2) + 60 ;
    
        var button_1 = "A / D"; 
        var button_1_X = (cvs.width / 2) - (ctx.measureText(button_1).width / 2) + 15; 
        var button_1_Y = (cvs.height / 2) + - 130 ;
    
        var button_2 = "SPACE"; 
        var button_2_X = (cvs.width / 2) - (ctx.measureText(button_2).width / 2) + 15; 
        var button_2_Y = (cvs.height / 2)  - 10;
    
        var button_3 = "ESC"; 
        var button_3_X = (cvs.width / 2) - (ctx.measureText(button_3).width / 2) + 15; 
        var button_3_Y = (cvs.height / 2) + 110 ;
    
    
        // Metinlerin boyutunu ve rengini ayarla
        ctx.font = "bold 20px Droid Sans";
    
        ctx.fillText(button_1, button_1_X, button_1_Y);
        ctx.fillText(button_2, button_2_X, button_2_Y);
        ctx.fillText(button_3, button_3_X, button_3_Y);
    
        ctx.fillStyle = "black"; 
        ctx.font = "bold 20px Open Sans";
    
        ctx.fillText(text_1, text_1_X, text_1_Y);
        ctx.fillText(text_2, text_2_X, text_2_Y);
        ctx.fillText(text_3, text_3_X, text_3_Y);
    
        // Play butonuna basılınca oyunun başlamasını sağla
        cvs.addEventListener('click', function(event) 
        {
            var mouseX = event.clientX - cvs.getBoundingClientRect().left;
            var mouseY = event.clientY - cvs.getBoundingClientRect().top;
    
            // Butonun koordinatları
            var buttonX = (cvs.width /2) -25;
            var buttonY = ( cvs.height /2) + 120;
    
            // Butonun boyutları
            var buttonWidth = button.width / 3;
            var buttonHeight = button.height /3;
    
            // Butona tıklanıp tıklanmadığını kontrol et
            if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) 
            {
                isGameStarted = true;
                console.log("Butona tıklandı!");
            }
        });
    }
  


}

// 16 farklı topdan herhangi birini oluşturmasını sağlar ve oluşan topu diziye ekler.
function createBall() 
{
    var randomBallNumber = Math.floor(Math.random() * 16) + 1;
    var ball = {
        src: `Ballsprites/Ball_${randomBallNumber}.png`,
        x: Math.random() * (cvs.width - 200),
        y: -100,
        x_speed: 2.5,
        y_speed: 2.5,
        size: 50,
        gravity: 0.25,
        offset: 45,
    };

    balls.push(ball);
}

// Playerın spritelarını ayrı ayrı dizilerde tutar.
for (let i = 0; i < 10; i++) 
{
    const idleImages = new Image();
    const runRightImages = new Image();
    const runLeftImages = new Image();

    idleImages.src = `Ninja/Idle/Idle__00${i}.png`;
    runRightImages.src = `Ninja/RunRight/Run__00${i}.png`;
    runLeftImages.src = `Ninja/RunLeft/Run__00${i}.png`;

    IdleFrames.push(idleImages);
    RunRightFrames.push(runRightImages);
    RunLeftFrames.push(runLeftImages);
}

// Arka planın ve zeminin rengini ayarlar ve zemini çizer.
function drawBG() 
{
    var bgColor = "#A3D8FF";
    var foreColor = "#4A3F35";
    var lineColor = "#2F2519";
    var lineWidth = 10;
    var offset = -10;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    ctx.fillStyle = foreColor;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(offset, cvs.height - offset);
    ctx.lineTo(offset, cvs.height - 50);
    ctx.lineTo(cvs.width - offset, cvs.height - 50);
    ctx.lineTo(cvs.width - offset, cvs.height - offset);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

// Karakterin hareketine ve yönüne göre spriteları kullanarak animasyonlarını oluşturur.
function drawPlayer() 
{
    if (isLeftRunning) 
    {
        playerValues.x = (playerValues.x < 15) ? 0 : (playerValues.x -= playerValues.speed);
        ctx.drawImage(RunLeftFrames[frameIndex], playerValues.x, playerValues.y, playerValues.runWidth, playerValues.runHeight);
        frameIndex = (frameIndex === 9) ? 0 : (frameIndex + 1);
    } else if (isRightRunning) 
    {
        playerValues.x = (playerValues.x > cvs.width - 100) ? cvs.width - 85 : (playerValues.x += playerValues.speed);
        ctx.drawImage(RunRightFrames[frameIndex], playerValues.x, playerValues.y, playerValues.runWidth, playerValues.runHeight);
        frameIndex = (frameIndex === 9) ? 0 : (frameIndex + 1);
    } else
    {
        ctx.drawImage(IdleFrames[frameIndex], playerValues.x, playerValues.y, playerValues.idleWitdh, playerValues.idleHeight);
        frameIndex = (frameIndex === 9) ? 0 : (frameIndex + 1);
    }
}

// Playerın fırlattığı bıçağı oluşturur ve yukarıya doğru hareket etmesini sağlar.
function drawKunai() 
{
    if (canFire) 
    {
        isShooting = true;

        kunaiValues.y -= 75;
        kunaiValues.x = playerValues.x + 25;
        ctx.drawImage(kunai, kunaiValues.x, kunaiValues.y, kunaiValues.width / 2, kunaiValues.height / 2);

        if (kunaiValues.y < -50) 
        {
            kunaiValues.y = cvs.height - 75;
            canFire = false;
            isShooting = false;
        }
    }
}

// Parametre olarak verilen değere göre ball objesini oluşturur.
function drawBall(ballValue) 
{
    var ballImg = new Image();
    ballImg.src = ballValue.src;
    ctx.drawImage(ballImg, ballValue.x, ballValue.y, ballValue.size, ballValue.size);
}

// Oluşturulan ball objesinin kenarlardan sekmesini sağlar.
function moveBall(ballValue) 
{
    // Topun yeni konumunu güncelle
    ballValue.x += ballValue.x_speed;
    ballValue.y += ballValue.y_speed;

    // Yerçekimini topun hızına ekleyerek uygula
    ballValue.y_speed += ballValue.gravity;

    // Topun sağ veya sol kenara çarpıp çarpmadığını kontrol et
    if (ballValue.x + ballValue.size >= cvs.width || ballValue.x <= 0) 
    {
        ballValue.x_speed = -ballValue.x_speed;
    }

    // Topun alt kenara çarpıp çarpmadığını kontrol et
    if (ballValue.y + ballValue.size >= cvs.height - ballValue.offset) 
    {
        ballValue.y_speed = -ballValue.y_speed * 0.99;
        ballValue.y = cvs.height - ballValue.offset - ballValue.size;
    }
}

// Tuşları basıldğında işlemleri gerçekleştirir.
document.addEventListener("keydown", function (event) 
{
    if (event.key === "d" || event.key === "D") 
    {
        isRightRunning = true;
    } 
    else if (event.key === "a" || event.key === "A")
    {
        isLeftRunning = true;
    } 
    else if (event.key === " ") 
    {
        canFire = true;
    }
    else if(event.key == "Escape")
    {
        isGameStopped = true;
    }
});

// Bir tuşa basmayı bıraktığında çalışacak olan koddur.
document.addEventListener("keyup", function (event) 
{
    if (event.key === "d" || event.key === "D") 
    {
        isRightRunning = false;
        frameIndex = 0;
    } else if (event.key === "a" || event.key === "A") 
    {
        isLeftRunning = false;
        frameIndex = 0;
    }
});


// Ball objesinin bıçak ve playerı çarpıp çarpmadığını kontrol eden fonksiyon.
function checkCollision(circleX, circleY, circleRadius, rectX, rectY, rectWidth, rectHeight) 
{
    // Calculate distance between circle's center and the rectangle's center
    var distX = Math.abs(circleX - rectX - rectWidth / 2);
    var distY = Math.abs(circleY - rectY - rectHeight / 2);

    // If the distance is greater than half of the rectangle's width and half of the rectangle's height, no collision
    if (distX > (rectWidth / 2 + circleRadius) || distY > (rectHeight / 2 + circleRadius)) 
    {
        return false;
    }

    // If the distance is less than or equal to half of the rectangle's width or half of the rectangle's height, collision
    if (distX <= (rectWidth / 2) || distY <= (rectHeight / 2)) 
    {
        return true;
    }

    // Calculate the distance between the circle's center and the rectangle's corner
    var dx = distX - rectWidth / 2;
    var dy = distY - rectHeight / 2;
    return (dx * dx + dy * dy <= (circleRadius * circleRadius));
}

// Oyunu yeniden başlatır.
function restartGame() 
{
    location.reload(); 
}

// ESC ye basılınca yani oyun durunca çalışan fonksiyon.
function drawPauseScreen() 
{
    // Durma ekranını çiz
    var pauseBG = new Image();
    var playIcon = new Image();

    pauseBG.src = "UI/button_2.png";
    playIcon.src = "UI/Icon_Play.png";

    ctx.drawImage(pauseBG,(cvs.width /2) - 50,( cvs.height /2) - 100 , pauseBG.width / 2, pauseBG.height / 2);
    ctx.drawImage(playIcon,(cvs.width /2) - 50,( cvs.height /2) - 100 , playIcon.width / 2, playIcon.height / 2);

    // Oynatma butonuna tıklama olayını ekle
    cvs.addEventListener('click', function(event) 
    {
        var mouseX = event.clientX - cvs.getBoundingClientRect().left;
        var mouseY = event.clientY - cvs.getBoundingClientRect().top;

        var buttonX = (cvs.width / 2) - 50;
        var buttonY = (cvs.height / 2) - 100;
        var buttonWidth = pauseBG.width / 2;
        var buttonHeight = pauseBG.height / 2;

        // Butona tıklanıp tıklanmadığını kontrol et
        if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) 
        {
            isGameStopped = false;
        }
    });
}

// Her framede oyunun yenilenmesini ve fonksiyonların çalışmasını sağlayan fonksiyon.
function animate() 
{
    if (!isDead && !isGameStopped) 
    {
        // Oyun devam ediyorsa oyunu güncelle
        if (gameFrame % staggerFrames == 0) 
        {
            drawBG();
            drawKunai();
            drawPlayer();
            opening();
        }

        if(isGameStarted)
        {
            for (var i = 0; i < balls.length; i++) 
            {
                drawBall(balls[i]);
                moveBall(balls[i]);
            }
    
            for (let i = 0; i < balls.length; i++) 
            {
                if (checkCollision(balls[i].x, balls[i].y, balls[i].size / 2, kunaiValues.x, kunaiValues.y, kunaiValues.width / 2, kunaiValues.height / 2)) 
                {
                    if (isShooting && !isHit) 
                    {
                        score += Math.round(Math.random() * 20 + 10);
                        console.log("Score : " + score);
                        isHit = true;
    
                        balls.splice(i, 1);
    
                        setTimeout(() => {
                            isHit = false;
                        }, 1500);
                    }
                    break;
                }
                if (checkCollision(balls[i].x, balls[i].y, balls[i].size / 2, playerValues.x, playerValues.y, playerValues.idleWitdh, playerValues.idleHeight)) 
                {
                    isDead = true;
                    console.log("Dead : " + isDead);
                    break;
                }
    
            }
    
            scoreText.innerText = "Skor : " + score;
    
        }
       
        gameFrame++;
        requestAnimationFrame(animate);
    } 
    else
    {
        if(isDead)
        {
            restartGame();
        }
    
        if(isGameStopped)
        {
            drawPauseScreen();
        }

        requestAnimationFrame(animate);
    }

   

       
}


// İlk topu oluştur
createBall();

// Her 4 saniyede bir top oluştur
setInterval(function () 
{
    if(balls.length < 10 && isGameStarted)
    {
        createBall();
    }

}, 3000);

// Animasyon döngüsünü başlat
setInterval(animate, 100000);

animate();
