const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const teclas = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
}

const teclaPresionada = document.addEventListener("keydown", (e)=>{

    if (e.key in teclas){
        teclas[e.key] = true;
        console.log(e.key);
        console.log(teclas)
    }
    
})

const teclaSoltada = document.addEventListener("keyup", (e)=>{

    if (e.key in teclas){
        teclas[e.key] = false;
        console.log(e.key);
        console.log(teclas)
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

const PELOTA = {
    radio: 20,
    velocidadX: 5,
    velocidadY: 5,
    color: "#ffffff"
}

const pelota = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

const paletaIzq = {
    x: PALETA.margen,
    y: canvas.height / 2 - PALETA.alto / 2
};

const paletaDer = {
    x: canvas.width - PALETA.margen - PALETA.ancho,
    y: canvas.height / 2 - PALETA.alto / 2
};


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


function dibujar (){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moverPaletas();
    dibujarPaletas();             
    dibujarPelota();  
    requestAnimationFrame(dibujar);
}

dibujar();

