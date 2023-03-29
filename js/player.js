class Player{
    constructor(){
        this.indice = 0;
        this.posicaoX = 0;
        this.posicaoY = 0;
        this.nome = '';
        this.score = 0;
        this.fuel = 160;
        this.rank = 0;
    }
    addPlayer(){
        //checa se é o carro 1
        if(this.indice == 1){
            //CARRO 1: à esquerda
            this.posicaoX = width/2 - 100;
        }
        else{
            //CARRO 2: à direita
            this.posicaoX = width/2 + 100;
        }
        //escreve no banco de dados as informações
        //do player.
        database.ref("players/player"+this.indice).set({
            nome:this.nome, 
            posX:this.posicaoX, 
            posY:this.posicaoY,
            score:this.score,
            fuel:this.fuel,
            rank:this.rank,
        })

    }
    //o comando static cria métodos estáticos
    //os métodos estáticos são chamados pelo
    //nome da classe e não pelo nome do objeto
    static getInfo(){
        //lê do banco de dados info de todos os players
        database.ref("players").on("value", data => {
            //copia os valores e guarda na variável
            //allPlayers
            allPlayers = data.val();
        })
    }
    pegarVencedores(){
        //LÊ no banco de dados a quantidade de vencedores
        database.ref("vencedores").on("value", data =>{
            //guarda na memória do jogo na propriedade rank do jogador
            player.rank = data.val();
        })
    }
    static atualizarVencedores(quantidade){
        //escreve no banco de dados
        database.ref("/").update({
            vencedores:quantidade
        })
    }

    
    getDistance(){
        database.ref("players/player" + this.indice).on("value", data=>{
            var data = data.val();
            this.posicaoX = data.posX;
            this.posicaoY = data.posY;
        })
    }


    //atualiza o campo no banco de dados
    updateCount(numero) {
        database.ref("/").update({
            playerCount:numero
        })
    }

    //lê do banco de dados e copia
    getCount(){
        database.ref("playerCount").on("value", function(data){
            //toda vez que tiver uma alteração, isso será lido
            playerCount = data.val();
        })
    }
    
    update(){
        database.ref("players/player"+this.indice).update({
            posX:this.posicaoX, 
            posY:this.posicaoY, 
            score:this.score, 
            fuel:this.fuel,
            rank:this.rank,
        })
    }
}