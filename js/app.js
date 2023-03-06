let frames = 0;
const doendes = new Image();

doendes.src = 'img/cenario/sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const telaJogo = {

    doendeX: 390,
    doendeY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,

    desenha() {

        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);

        contexto.drawImage(

            doendes,
            telaJogo.doendeX, telaJogo.doendeY,
            telaJogo.largura, telaJogo.altura,
            telaJogo.x, telaJogo.y,
            telaJogo.largura, telaJogo.altura
        );

        contexto.drawImage(

            doendes,
            telaJogo.doendeX, telaJogo.doendeY,
            telaJogo.largura, telaJogo.altura,
            (telaJogo.x + telaJogo.largura), telaJogo.y,
            telaJogo.largura, telaJogo.altura
        )
    }
}

function criarChao() {

    const chao = {
        doendeX: 0,
        doendeY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,

        atualiza() {

            const movimentoChao = 1;
            const repetir = chao.largura / 2;
            const movimentacao = chao.x - movimentoChao;

            chao.x = movimentacao % repetir;

        },

        desenha() {

            contexto.drawImage(

                doendes,
                chao.doendeX, chao.doendeY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura
            );

            contexto.drawImage(

                doendes,
                chao.doendeX, chao.doendeY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura
            )
        }
    }

    return chao;
}

function emColisao(flappyBird, chao) {

    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        
        return true;
    }

    return false;
}

function criarFlappyBird() {

    const flappyBird = {

        doendeX: 0,
        doendeY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,

        pular() {

            console.log("devo pular");
            console.log('[antes]', flappyBird.velocidade)
            flappyBird.velocidade = -flappyBird.pulo;
            console.log('[depois]', flappyBird.velocidade)

        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {

            if (emColisao(flappyBird, global.chao)) {
                
                console.log("em colisão");

                mudarDeTela(Telas.FIM_JOGO);

                return;
            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            {
                doendeX: 0, doendeY: 0
            },
            {
                doendeX: 0, doendeY: 26
            },
            {
                doendeX: 0, doendeY: 52
            },
            {
                doendeX: 0, doendeY: 26
            }
        ],
        frameAtual: 0,
        atualizaFrameAtual() {

            const intervaloFrames = 10;
            const passouIntervalo = frames % intervaloFrames === 0;

            if (passouIntervalo) {
                
                const baseIncremento = 1;
                const incremento = baseIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;

                flappyBird.frameAtual =incremento % baseRepeticao;
            }
        },

        desenha() {

            flappyBird.atualizaFrameAtual();

            const { doendeX, doendeY } = flappyBird.movimentos[flappyBird.frameAtual];

            contexto.drawImage(

                doendes,
                doendeX, doendeY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura
            )
        }
    
    }

    return flappyBird;
}
function criarCanos() {

    const canos = {

        largura: 52,
        altura: 400,

        chao: {

            doendeX: 0,
            doendeY: 169
        },

        ceu: {
            doendeX: 52,
            doendeY: 169
        },

        desenha() {

            canos.pares.forEach(function(par) {

                const yRandom = par.y;
                const espacamentoCano = 90;
                const canoCeuX = par.x;
                const canoCeuY = yRandom;

                contexto.drawImage(
                    doendes,
                    canos.ceu.doendeX, canos.ceu.doendeY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura
                )

                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoCano + yRandom; 
                contexto.drawImage(

                    doendes,
                    canos.chao.doendeX, canos.chao.doendeY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura
                )

                par.canoCeu = {

                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }

                par.canoChao = {

                    x: canoChaoX,
                    y: canoChaoY
                }
            })
        },
        temColisaoComFlappyBird(par) {

            const cabecaFlappyBird = global.flappyBird.y;
            const peFlappyBird = global.flappyBird.y + global.flappyBird.altura;

            if ((global.flappyBird.x + global.flappyBird.largura) >= par.x) {
                
                if (cabecaFlappyBird <= par.canoCeu.y) {
                    
                    return true;
                }

                if (peFlappyBird >= par.canoChao.y) {
                    
                    return true;
                }
            }
        },
        pares: [],
        atualiza() {

            const excedeuFrames = frames % 100 === 0;

            if (excedeuFrames) {
                
                canos.pares.push({

                    x: canvas.width,
                    y: -150 * (Math.random() + 1)
                })
            }

            canos.pares.forEach(function(par) {

                par.x = par.x - 2;

                if (canos.temColisaoComFlappyBird(par)) {
                    
                    mudarDeTela(Telas.FIM_JOGO);    
                }

                if (par.x + canos.largura <= 0) {
                    
                    canos.pares.shift();
                }
            })
        }
    }

    return canos;
}

function criarPlacar() {

    const placar = {

        pontuacao: 0,
        desenha() {

            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
        },
        atualiza() {

            const intervaloFrames = 10;
            const passouIntervalo = frames % intervaloFrames === 0;

            if (passouIntervalo) {
                
                placar.pontuacao = placar.pontuacao + 1;
            }
        }
    }

    return placar;
}

const global = {};
let telaAtiva = {};

function mudarDeTela(novaTela) {

    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        
        telaAtiva.inicializa();
    }
}

const Telas = {

    inicio: {

        inicializa() {

            global.flappyBird = criarFlappyBird();
            global.chao = criarChao();
            global.canos = criarCanos();
        
        },
        desenha() {
    
            telaJogo.desenha();
            global.flappyBird.desenha();
            global.chao.desenha();
        },

        click() {

            mudarDeTela(Telas.JOGO)
        },

        atualiza() {

            global.chao.atualiza();
        }
    }
}

Telas.JOGO = {

    inicializa() {

        global.placar = criarPlacar();
    },
    desenha() {

        telaJogo.desenha();
        global.canos.desenha();
        global.chao.desenha();
        global.flappyBird.desenha();
        global.placar.desenha();
        
    },

    click() {

        global.flappyBird.pular();
    },

    atualiza() {

        global.canos.atualiza();
        global.chao.atualiza();
        global.flappyBird.atualiza();
        global.placar.atualiza();

    }
}

Telas.FIM_JOGO = {

    desenha() {

    },

    atualiza(){},

    click() {

        mudarDeTela(Telas.inicio);
    }
}
function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;

    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {

    if (telaAtiva.click) {
        
        telaAtiva.click();
    }
})

mudarDeTela(Telas.inicio);

loop();