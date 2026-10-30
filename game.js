const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const iniciarButton = document.querySelector(".start-button");
const gameMenu = document.querySelector(".game-menu");
const game = document.querySelector(".game");
const jugador1 = document.getElementById("jugador-1-name");
const jugador2 = document.getElementById("jugador-2-name");



let juegoActivo = false;

iniciarButton.onclick = ()=>{

    let jugador1Name = jugador1.value.trim();
    let jugador2Name = jugador2.value.trim();

    juegoActivo = true;

    gameMenu.style.display = "none";
    game.style.display = "flex";
}

const teclas = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
}

const teclaPresionada = document.addEventListener("keydown", (e)=>{

    const tecla = e.key.length === 1 ? e.key.toLocaleLowerCase() :e.key;

    if (tecla in teclas){
        e.preventDefault(); 
        teclas[tecla] = true;
    }
    
})

const teclaSoltada = document.addEventListener("keyup", (e)=>{

    const tecla = e.key.length === 1 ? e.key.toLocaleLowerCase() :e.key;

    if (tecla in teclas){
        e.preventDefault(); 
        teclas[tecla] = false;
    }
    
})

canvas.width = 1200;
canvas.height = 650;

const PALETA = {
    ancho: 15,
    alto: 170,
    margen: 20,
    velocidad: 6,
    color: "#ffffff"
};

const paletaIzq = {
    x: PALETA.margen,
    y: canvas.height / 2 - PALETA.alto / 2,

};

const paletaDer = {
    x: canvas.width - PALETA.margen - PALETA.ancho,
    y: canvas.height / 2 - PALETA.alto / 2,



};

const pelota = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

const PELOTA = {
    radio: 20,
    velocidadX: 4,
    velocidadY: 4,
    color: "#ffffff",


}






function dibujarPaletas(){          
    ctx.fillStyle = PALETA.color;
    ctx.fillRect(paletaIzq.x, paletaIzq.y, PALETA.ancho, PALETA.alto);
    ctx.fillRect(paletaDer.x, paletaDer.y, PALETA.ancho, PALETA.alto);
}

function dibujarPelota(){
    ctx.beginPath();
    ctx.arc(pelota.x, pelota.y, PELOTA.radio, 0 , Math.PI * 2);
    ctx.fillStyle = PELOTA.color;
    ctx.fill();
    ctx.closePath()
}

function moverPaletas() {

    

    if (teclas["w"]) {
        paletaIzq.y -= PALETA.velocidad;
        if (paletaIzq.y < PALETA.margen) {
            paletaIzq.y = PALETA.margen;
        }
    }
    if (teclas["s"]) {
        paletaIzq.y += PALETA.velocidad;
        if (paletaIzq.y + PALETA.alto > canvas.height - PALETA.margen) {
            paletaIzq.y = canvas.height - PALETA.alto - PALETA.margen;
        }
    }

    if (teclas["ArrowUp"]) {
        paletaDer.y -= PALETA.velocidad;
        if (paletaDer.y < PALETA.margen) {
            paletaDer.y = PALETA.margen;
        }
    }
    if (teclas["ArrowDown"]) {
        paletaDer.y += PALETA.velocidad;
        if (paletaDer.y + PALETA.alto > canvas.height - PALETA.margen) {
            paletaDer.y = canvas.height - PALETA.alto - PALETA.margen;
        }
    }

}

function moverPelota(){

    let y0Der = paletaDer.y;
    let y1Der = paletaDer.y + PALETA.alto;

    let y0Izq = paletaIzq.y;
    let y1Izq = paletaIzq.y + PALETA.alto;
    
    pelota.x += PELOTA.velocidadX;
    pelota.y += PELOTA.velocidadY;

    if (pelota.y - PELOTA.radio <= 0 || pelota.y + PELOTA.radio >= canvas.height){
        PELOTA.velocidadY = -PELOTA.velocidadY;
    }

    if (pelota.x + PELOTA.radio >= paletaDer.x && 
        pelota.x - PELOTA.radio <= paletaDer.x + PALETA.ancho && 
        pelota.y + PELOTA.radio >= paletaDer.y && 
        pelota.y - PELOTA.radio <= paletaDer.y + PALETA.alto){

            pelota.x = paletaDer.x - PELOTA.radio;
            PELOTA.velocidadX = -PELOTA.velocidadX
        };

    if (pelota.x - PELOTA.radio <= paletaIzq.x + PALETA.ancho && 
        pelota.x + PELOTA.radio >= paletaIzq.x && 
        pelota.y + PELOTA.radio >= paletaIzq.y && 
        pelota.y - PELOTA.radio <= paletaIzq.y + PALETA.alto){

            pelota.x = paletaIzq.x + PALETA.ancho + PELOTA.radio;
            PELOTA.velocidadX = -PELOTA.velocidadX;
        };


    

}



function dibujar (){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (juegoActivo){
        moverPaletas();
        moverPelota();
    }

    dibujarPaletas();           
    dibujarPelota();  
    requestAnimationFrame(dibujar);
}

dibujar();

