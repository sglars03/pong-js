const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

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
    velocidadX: 10,
    velocidadY: 10,
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

    // if (paletaDer.x + PELOTA.radio - pelota.x <= 0 && y0Der <= pelota.y + PELOTA.radio && y1Der >= pelota.y + PELOTA.radio  || pelota.x + PELOTA.radio - paletaIzq.x <= 0 && y0Izq <= pelota.y + PELOTA.radio && y1Izq >= pelota.y + PELOTA.radio ){
    //     PELOTA.velocidadX = -PELOTA.velocidadX
    // }

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
    moverPaletas();
    moverPelota();
    dibujarPaletas();           
    dibujarPelota();  
    requestAnimationFrame(dibujar);
}

dibujar();

