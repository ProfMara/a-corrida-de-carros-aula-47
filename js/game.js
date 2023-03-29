class Game{
    constructor(){
        this.botao = createButton("");
        
        this.tituloPlacar = createElement("h2");
        this.lugar1 = createElement("h2");
        this.lugar2 = createElement("h2");
        
        this.movendo = false;
    }
    posicionar(){
        this.botao.position(width*0.66, 100);
        this.botao.class("resetButton");
        
        //definir a posição do elemento
        this.tituloPlacar.position(width*0.33,50);
        this.tituloPlacar.class("resetText");
        this.tituloPlacar.html("PLACAR");

        this.lugar1.position(width * 0.33, 100);
        this.lugar1.class("leadersText");

        this.lugar2.position(width * 0.33, 150);
        this.lugar2.class("leadersText");
        
        //define o que ocorre quando clica nele
        this.botao.mousePressed(()=>{
            //indica a raiz do banco de dados
            database.ref("/").set({
                //escreve esses valores no banco
                gameState:0, playerCount:0,vencedores:0
            });
            //recarrega a página local
            window.location.reload();
        });
    }

    mostrarPlacar(){
        //MATRIZ DE OBJETOS DE JOGADORES
        var players = Object.values(allPlayers);
        var lugar1, lugar2;
        //situação 1: ninguém cruzou a linha de chegada
        if(players[0].rank == 0 && players[1].rank == 0){
            //primeiro lugar: jogador 0
            lugar1 = players[0].rank 
             + "&emsp;"
             + players[0].nome 
             + "&emsp;" 
             + players[0].score;
            //segundo lugar: jogador 1
            lugar2 = players[1].rank 
            + "&emsp;" 
            + players[1].nome 
            + "&emsp;" 
            + players[1].score;
        }
        //SITUAÇÃO B: o player 0 cruzou a linha de chegada
        if(players[0].rank == 1){
            //primeiro lugar: jogador 0
            lugar1 = players[0].rank 
             + "&emsp;"
             + players[0].nome 
             + "&emsp;" 
             + players[0].score;
            //segundo lugar: jogador 1
            lugar2 = players[1].rank 
            + "&emsp;" 
            + players[1].nome 
            + "&emsp;" 
            + players[1].score;
        }
        //SITUAÇÃO C: o player 1 cruzou a linha de chegada primeiro
        if(players[1].rank == 1){
            //primeiro lugar: jogador 1
            lugar1 = players[1].rank 
             + "&emsp;"
             + players[1].nome 
             + "&emsp;" 
             + players[1].score;
            //segundo lugar: jogador 0
            lugar2 = players[0].rank 
            + "&emsp;" 
            + players[0].nome 
            + "&emsp;" 
            + players[0].score;
        }

        this.lugar1.html(lugar1);
        this.lugar2.html(lugar2);
    }



    
    start(){
        //cria o objeto form da classe Form
        form = new Form();
        //chama o método exibir do formulário
        form.exibir();

        //cria uma instância de novo jogador
        player = new Player();
        //pega a quantidade de jogadores no bd
        player.getCount();

        //cria a sprite do carro1
        car1 = createSprite(width/2 - 100, height-100);
        car1.addImage("carro", carimg1);
        car1.scale = 0.07;

        //cria a sprite do carro2
        car2 = createSprite(width/2 + 100, height-100);
        car2.addImage("carro", carimg2);
        car2.scale = 0.07;

        //adiciona as duas sprites na matriz cars
        cars = [car1, car2];

        //definir os grupos....
        coins = new Group();
        fuels = new Group();
        obsG1 = new Group();
        obsG2 = new Group();

        var obstacles1 = [
            { x: width / 2 - 150, y: height - 1300, image: obsImg1  },
            { x: width / 2 + 250, y: height - 1800, image: obsImg1 },
            { x: width / 2 - 180, y: height - 3300, image: obsImg1 },
            { x: width / 2 - 150, y: height - 4300, image: obsImg1 },
            { x: width / 2, y: height - 5300, image: obsImg1 },
            { x: width / 2 - 180, y: height - 5500, image: obsImg1 }
        ];
        var obstacles2 = [
            { x: width / 2 + 250, y: height - 800, image: obsImg2 },
            { x: width / 2 - 180, y: height - 2300, image: obsImg2 },
            { x: width / 2, y: height - 2800, image: obsImg2 },
            { x: width / 2 + 180, y: height - 3300, image: obsImg2 },
            { x: width / 2 + 250, y: height - 3800, image: obsImg2 },
            { x: width / 2 + 250, y: height - 4800, image: obsImg2 },
        ];
        //criando as sprites...
        this.addSprites(coins, coinImg, 35, 0.5);
        this.addSprites(fuels, fuelImg, 20, 0.02);
        //adicionando o primeiro grupo de obstáculos....
        this.addSprites(obsG1, obsImg1, obstacles1.length, 0.04, obstacles1)

    }
    addSprites(grupo, imagem, numero, tamanho, posicoes = []){
        
        for(var i = 0; i < numero; i++){
            var x = 0;
            var y = 0;
            //checar se há elementos na matriz posicoes
            if(posicoes.length > 0){
                //se sim, usará os valores da matriz para definir x e y
                x = posicoes[i].x;
                y = posicoes[i].y;
            }
            //senão, irá gerar números aleatórios para definir x e y
            else{
                x = random(width*0.33, width*0.66);
                y = random(-height*5, height - 100);
            }
           //cria a sprite
           var sprite = createSprite(x,y);
           //adiciona a imagem na sprite
           sprite.addImage(imagem);
           sprite.scale = tamanho;
           grupo.add(sprite);
        }

    }


    coletarMoeda(i){
        cars[i-1].overlap(coins, function(coletor, collected){
            //aumenta a pontuação
            player.score += 10;
            //escreve o novo valor no banco de dados
            player.update();
            collected.remove();
        });
    }
    coletarComb(i){
        cars[i-1].overlap(fuels, function(coletor, collected){
            collected.remove();
            //devolve a quantidade de combustível do jogador
            player.fuel = 160;
        });
        //verifica se há combustível e se o player está se movendo
        if(player.fuel > 0 && this.movendo == true){
            //diminui a quantidade de combustível e atualiza no Banco de Dados
            player.fuel -=0.3;
            player.update();
        }
        //checa se a quantidade de combustível é menor 0
        if(player.fuel <= 0){
            //coloca o estado final para o jogo
            gameState = 2;
            //chama o método que colocará uma janela de fim de jogo
            this.gameOver();
        }
    }


    
    showFuel(){
        //atualizar as configurações
        push();
        //colocar a imagem do combustivel
        image (fuelImg, width/2 - 130, height - player.posicaoY - 100, 20, 20);
        //retângulo branco
        fill("white");
        rect(width/2 - 100, height - player.posicaoY - 100, 160, 20);
        //retângulo laranja
        fill("orange");
        rect(width/2 - 100, height - player.posicaoY - 100, player.fuel,20);
        //voltar para as configurações antigas
        pop();
    }

    play(){
        form.esconder();
        Player.getInfo();
        this.posicionar();
        //checar se allPlayers tem valor
        if(allPlayers !== undefined){
            player.pegarVencedores();
            this.mostrarPlacar();
            //colocar a imagem da pista
            image (pista, 0, -height*5 , width, height*6);
            //mostrar a barra de combustível
            this.showFuel();
            //guardar o indice da sprite do carro
            var i = 0;
            //repetir os códigos pelo número de props do objeto
            for(var plr in allPlayers){
                //guarda do banco de dados o valor x
                var x = allPlayers[plr].posX;
                //guarda do banco de dados o valor y
                var y = height - allPlayers[plr].posY;


                //muda a posição da sprite do carro
                cars[i].position.x = x;
                cars[i].position.y = y;
                //aumenta o i para posicionar o outro carro
                i++;
                //checa se o valor de i é igual ao índice do jogador
                if( i == player.indice ){
                    //pinta de vermelho
                    fill("red");
                    //desenha uma bola vermelha
                    ellipse(x,y,60);
                    //a câmera segue o jogador
                    camera.position.y = y;
                    //detecta a colisão entre o carro e a moeda
                    this.coletarMoeda(i);
                    //NÃO TRAPACEIEM NO DESAFIO >:(
                    this.coletarComb(i);

                    linhaChegada = height * 6;
                    //checar se o player ultrapassou a linha de chegada
                    if(player.posicaoY > linhaChegada){
                        //aumentar o valor do rank do jogador
                        player.rank +=1;
                        //escrever esse novo valor no banco de dados
                        Player.atualizarVencedores(player.rank);
                        gameState = 2;
                        this.mostrarRank();
                    }
                }

            }
            //chamar o método controlar carro
            this.controlarCarro();
            //desenhar as sprites
            drawSprites();
        }
    }

    controlarCarro(){
        if(keyDown(UP_ARROW)){
            player.posicaoY += 10;
            player.update();
            this.movendo = true;
        }
        if(keyDown(LEFT_ARROW) && player.posicaoX > width*0.33){
            player.posicaoX -= 10;
            player.update();
            this.esquerda = true;
        }
        if(keyDown(RIGHT_ARROW) && player.posicaoX < width*0.66){
            player.posicaoX += 10;
            player.update();
            this.esquerda = false;
        }
    }

    //lê no banco de dados e copia o valor de gameState
    getState(){
        database.ref("gameState").on("value", function(data){
            gameState = data.val();
        })
    }

    //atualiza o valor de gameState 
    update(state){
        database.ref("/").update({
            gameState:state,
        })
    }
   
    gameOver(){
        //sweet alert = alerta doce
        //gera uma janelinha que alerta o usuário
        swal({
            //define o título
            title:"Que pena!",
            //define o texto
            text:"Você perdeu!",
            //define a imagem
            imageUrl:"https://media.tenor.com/rNePywVHykEAAAAC/cry-minions.gif",
            //define o tamanho da imagem
            imageSize:"300x300",
            //define o texto do botão
            confirmButtonText:"OK",
        });
    }

    mostrarRank() {
        swal({
          title: "Incrível!! " +player.rank+ "º Lugar!" ,
          text: "Você ultrapassou a linha de chegada",
          imageUrl:"https://media.tenor.com/sZAFBih2R54AAAAC/minions.gif",
          imageSize: "300x300",
          confirmButtonText: "Ok"
        });
      }

}   