let board;
let boardWidth;
let boardHeight;
let context;

let numCombo = 0;

let barrinhaWidth = 80; //80 normal
let barrinhaHeight = 12;
let velBarrinha = 18;

let ballWidth = 10;
let ballHeight = 10;
let velBallX = 5; //5 normal
let velBallY = -3; //-3 normal

let blocoWidth = 50;
let blocoHeight = 15;
let blocosArray = [];
let blocoColuna = 7; //7
let blocoLinha = 3; //3
let blocoMaxLinha = 8; //8
let blocoCont;

let blocoX = 20;
let blocoY = 50;

let pontos = 0;
let gameOver = false;

let start = false;

let difceisNivel = 6;

let contConfetti = 0;

let ball = {
    x: 0,
    y: 0,
    width: ballWidth,
    height: ballHeight,
    velocityX: velBallX,
    velocityY: velBallY
};

let barrinha = {
    x: 0,
    y: 0,
    width: barrinhaWidth,
    height: barrinhaHeight,
    velocityX: velBarrinha
};

window.onload = function () {
    board = document.getElementById("board");
    context = board.getContext("2d");

    function resizeCanvas() {
        // define a largura maxima
        const maxWidth = 430;

        boardHeight = window.innerHeight;

        boardWidth = Math.min(window.innerWidth, maxWidth);

        board.width = boardWidth;
        board.height = boardHeight;

        barrinha.width = Math.max(barrinhaWidth, boardWidth * 0.2); // 20% da largura da tela
        barrinha.x = boardWidth / 2 - barrinhaWidth / 2;
        barrinha.y = boardHeight - barrinhaHeight - 50; // distância entre a barrinha e o fim da tela

        ball.y = barrinha.y - ball.width;
        ball.x = barrinha.x + barrinhaHeight / 2 - ball.width / 2;

        ajustarTamanhoBlocos();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    requestAnimationFrame(update);

    let touchStartX = 0;
    let isTouching = false;

    board.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isTouching = true;
    });

    board.addEventListener('touchmove', (e) => {
        if (isTouching) {
            let touchX = e.touches[0].clientX;
            moveBarrinha(touchX);
        }
    });

    board.addEventListener('touchend', () => {
        isTouching = false;
    });

    function moveBarrinha(touchX) {
        let novaBarrinhaX = barrinha.x + (touchX - touchStartX);

        // Deixar barrinha na tela
        if (!parede(novaBarrinhaX)) {
            barrinha.x = novaBarrinhaX;
        }

        touchStartX = touchX;
    }

    document.addEventListener("keydown", moveBarrinhaPC);

    criarBlocos();
}

function moveBarrinhaPC(e) {
    if (e.code == "ArrowLeft") {
        let novaBarrinhaX = barrinha.x - barrinha.velocityX;
        if (!parede(novaBarrinhaX)) {
            barrinha.x = novaBarrinhaX;
        }
    } else if (e.code == "ArrowRight") {
        let novaBarrinhaX = barrinha.x + barrinha.velocityX;
        if (!parede(novaBarrinhaX)) {
            barrinha.x = novaBarrinhaX;
        }
    }
}

function startGame() {
    start = true;
    document.querySelector(".telaInicial").style.display = "none"; // oculta a tela inicial
    barras();


}

function update() {
    requestAnimationFrame(update);

    if (gameOver) { //quando perder
        document.querySelector(".telaFinal").style.display = "block";
        document.getElementById("mensagem").innerText = "Você perdeu!";
        document.getElementById("pontos").innerText = "Pontuação Final: " + pontos;
        barras();
        return;
    }

    if (!start) {
        document.querySelector(".telaInicial").style.display = "block";
        barras();
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    context.fillStyle = "orange";
    context.fillRect(barrinha.x, barrinha.y, barrinha.width, barrinha.height);

    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    if (ball.y <= 0) {
        ball.velocityY *= -1;

    } else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
        ball.velocityX *= -1;
    } else if (ball.y + ball.height >= boardHeight) {
        gameOver = true;
        context.clearRect(0, 0, board.width, board.height);
        return;
    }  

    // detecta a colisão entre a bola e a barrinha
    if (topColisao(ball, barrinha) || botColisao(ball, barrinha)) {
        ball.velocityY *= -1;
        numCombo = 0;
    } else if (leftColisao(ball, barrinha) || rightColisao(ball, barrinha)) {
        ball.velocityX *= -1;
        numCombo = 0;
    }

    context.fillStyle = "red";

    context.font = "20px sans-serif";
    context.fillText(pontos, 10, 25);

    for (let i = 0; i < blocosArray.length; i++) {
        let bloco = blocosArray[i];

        if (!bloco.break) {
            if (topColisao(ball, bloco) || botColisao(ball, bloco)) {
                document.getElementById("blocoQuebradoAudio").play();

                // vai ver se o bloco sera destruido agora ou não
                bloco.vidas -= 1;

                numCombo += 1;

                if (bloco.vidas <= 0) {
                    bloco.break = true;

                    if (numCombo >= 2) {
                        pontos += 13 * numCombo;
                    } else {
                        pontos += 13;
                    }
                    blocoCont -= 1;
                } else {
                    if (numCombo >= 2) {
                        pontos += 17 * numCombo;
                    } else {
                        pontos += 17;
                    }
                }

                ball.velocityY *= -1;

            } else if (leftColisao(ball, bloco) || rightColisao(ball, bloco)) {
                document.getElementById("blocoQuebradoAudio").play();

                bloco.vidas -= 1;

                numCombo += 1;

                if (bloco.vidas <= 0) {
                    bloco.break = true;

                    if (numCombo >= 2) {
                        pontos += 13 * numCombo;
                    } else {
                        pontos += 13;
                    }
                    blocoCont -= 1;

                } else {
                    if (numCombo >= 2) {
                        pontos += 17 * numCombo;
                    } else {
                        pontos += 17;
                    }
                }

                ball.velocityX *= -1;
            }

            // cor diferente para blocos diferentes
            let cor;
            switch (bloco.vidas) {
                case 2:
                    cor = "blueviolet"; // cor para 2 vidas
                    break;
                case 1:
                    cor = "red"; // cor para 1 vida
                    break;
            }

            context.fillStyle = cor;
            context.fillRect(bloco.x, bloco.y, bloco.width, bloco.height);
        }
    }
    //niveis
    if (blocoCont == 0) {
        numCombo = 0;

        if (blocoLinha == blocoMaxLinha) {
            context.clearRect(0, 0, board.width, board.height);
            document.querySelector(".telaFinal").style.display = "block";
            document.getElementById("pontos").innerText = "Pontuação Final: " + pontos;
            document.getElementById("mensagem").innerText = "Você venceu";
            document.querySelector(".barra1").style.display = "none";
            document.querySelector(".barra2").style.display = "none";


            if (contConfetti == 0) {
                var end = Date.now() + (3 * 1000);
                // go Buckeyes!
                var colors = ['#bb0000', '#ffffff'];
                (function frame() {
                    confetti({
                        particleCount: 2,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: colors
                    });
                    confetti({
                        particleCount: 2,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: colors
                    });
                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
                contConfetti++;
            }
            return;
        } else {
            blocoLinha = Math.min(blocoLinha + 1, blocoMaxLinha);
            pontos += 100 * blocoLinha;
            ball.y = barrinha.y - ball.width;
            ball.x = barrinha.x + barrinhaHeight / 2 - ball.width / 2;
            difceisNivel -= 1;

            velBallX += 1;
            velBallY -= 1;

            document.querySelector(".niveis").style.display = "block";
            document.getElementById("indicadorNivel").innerText = blocoLinha + "/8";

            setTimeout(() => {
                document.querySelector(".niveis").style.display = "none";
            }, 500);

            criarBlocos();
        }
    }
    context.fillStyle = "white";

    if (numCombo >= 2) {
        context.font = "15px sans-serif";
        context.fillText("x", 62, 25);
        context.font = "10px sans-serif";
        context.fillText("Combo", 62, 40);
        context.font = "20px sans-serif";
        context.fillText(numCombo, 70, 25);
    }

    context.font = "20px sans-serif";
    context.fillText(pontos, 10, 25);
    context.font = "10px sans-serif";
    context.fillText("Pontos", 15, 40);
}

function detectarColisao(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function topColisao(ball, bloco) {
    return detectarColisao(ball, bloco) &&
        ball.velocityY > 0 &&
        ball.y + ball.height >= bloco.y &&
        ball.y <= bloco.y;
}

function botColisao(ball, bloco) {
    return detectarColisao(ball, bloco) &&
        ball.velocityY < 0 &&
        ball.y <= bloco.y + bloco.height &&
        ball.y + ball.height >= bloco.y + bloco.height;
}

function leftColisao(ball, bloco) {
    return detectarColisao(ball, bloco) &&
        ball.velocityX > 0 &&
        ball.x + ball.width >= bloco.x &&
        ball.x <= bloco.x;
}

function rightColisao(ball, bloco) {
    return detectarColisao(ball, bloco) &&
        ball.velocityX < 0 &&
        ball.x <= bloco.x + bloco.width &&
        ball.x + ball.width >= bloco.x + bloco.width;
}

function parede(posicaoX) {
    return (posicaoX < -5 || posicaoX + barrinhaWidth > boardWidth + 5); //coloquei 5 para não haver espaço entre a colisao da barrinha com a parede
}

function criarBlocos() {

    blocosArray = [];
    // largura dos blocos, contando com os espaços
    let totalBlocoWidth = blocoColuna * blocoWidth + (blocoColuna - 1) * 10; // 10 é o espaçamento entre os blocos
    let posicaoInicialX = (boardWidth - totalBlocoWidth) / 2;

    let contDificl = 0;
    let vidas;

    for (let l = 0; l < blocoLinha; l++) {
        for (let c = 0; c < blocoColuna; c++) {

            contDificl += 1;

            if (contDificl % difceisNivel === 0) {
                vidas = 2;
            } else {
                vidas = 1;
            }

            let bloco = {
                x: posicaoInicialX + c * blocoWidth + c * 10, // ajustar posição com base na largura do bloco e espaço
                y: blocoY + l * blocoHeight + l * 10,
                width: blocoWidth,
                height: blocoHeight,
                break: false,
                vidas: vidas
            }
            blocosArray.push(bloco);
        }
    }
    blocoCont = blocosArray.length;
}

function jogarNovamente() {
    gameOver = false;

    ball = {
        x: 0,
        y: 0,
        width: ballWidth,
        height: ballHeight,
        velocityX: velBallX,
        velocityY: velBallY
    };

    barrinha = {
        x: 0,
        y: 0,
        width: barrinhaWidth,
        height: barrinhaHeight,
        velocityX: velBarrinha
    };

    barrinha.x = boardWidth / 2 - barrinhaWidth / 2;
    barrinha.y = boardHeight - barrinhaHeight - 50; // distância entre a barrinha e o fim da tela

    ball.y = barrinha.y - ball.width;
    ball.x = barrinha.x + barrinhaHeight / 2 - ball.width / 2;

    blocosArray = [];
    blocoColuna = 7;
    blocoLinha = 3;
    pontos = 0;
    numCombo = 0;
    criarBlocos();

    //escondendo as tela
    document.querySelector(".telaFinal").style.display = "none";
    barras();
}

function ajustarTamanhoBlocos() {
    let larguraTela = window.innerWidth ;

    if (larguraTela < 430) {
        blocoWidth = Math.min((larguraTela + 40) / 10, 50); //+40 para testes
        blocoHeight = blocoWidth / (10 / 3);
        ballWidth = Math.max(larguraTela / 50, 5);
        ballHeight = ballWidth;
    } if (larguraTela > 430) {
        blocoWidth = 50;
        blocoHeight = 15;
        ballWidth = 10;
        ballHeight = 10;
    }
}

function barras() {
    const larguraTela = window.innerWidth;

    if (larguraTela > 430 && start && !gameOver) {
        document.querySelector(".barra1").style.display = "block";
        document.querySelector(".barra2").style.display = "block";
    } else {
        document.querySelector(".barra1").style.display = "none";
        document.querySelector(".barra2").style.display = "none";
    }
}
