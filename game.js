
const iconoMusica = document.getElementById("icono-musica");
const canvasJuego = document.getElementById("myCanvas");
const canvasMenu = document.getElementById("myCanvasMenu");

const contextoJuego = canvasJuego.getContext("2d");
const contextoMenu = canvasMenu.getContext("2d");

const botonIniciar = document.querySelector(".boton-iniciar");
const menuJuego = document.querySelector(".menu-juego");
const pantallaJuego = document.querySelector(".pantalla-juego");
const botonPausar = document.querySelector(".boton-pausar");

const inputJugador1 = document.getElementById("jugador-1-name");
const inputJugador2 = document.getElementById("jugador-2-name");

const nombresJugador1 = document.querySelectorAll(".jugador-1-nombre");
const nombresJugador2 = document.querySelectorAll(".jugador-2-nombre");

const marcadorGolesJugador1 = document.querySelector(".num-goles-1");
const marcadorGolesJugador2 = document.querySelector(".num-goles-2");

const marcadorPartidasJugador1 = document.querySelector(".num-partidas-1");
const marcadorPartidasJugador2 = document.querySelector(".num-partidas-2");

const nombreControlJugador1 = document.querySelector(".controles-jug-1");
const nombreControlJugador2 = document.querySelector(".controles-jug-2");


const musicaMenu = new Audio(
    "The Whole Other - 8-Bit Dreamscape ♫ NO COPYRIGHT 8-bit Music(M4A_128K).m4a"
);

musicaMenu.loop = true;
musicaMenu.volume = 0.6;

let musicaReproduciendose = false;

document.addEventListener("click", function activarMusicaInicial() {
    if (!musicaReproduciendose) {
        musicaMenu.play().then(() => {
            musicaReproduciendose = true;
            iconoMusica.style.color = "#dbd9d9";
            document.removeEventListener("click", activarMusicaInicial);
        });
    }
});

iconoMusica.addEventListener("click", (evento) => {
    evento.stopPropagation();

    if (musicaMenu.paused) {
        musicaMenu.play();
        musicaReproduciendose = true;
        iconoMusica.style.color = "#dbd9d9";
    } else {
        musicaMenu.pause();
        musicaReproduciendose = false;
        iconoMusica.style.color = "#4e4b4b";
    }
});

// ============================================================
// ESTADO GENERAL DEL JUEGO
// ============================================================

let juegoActivo = false;
let juegoPausado = false;
let cuentaRegresivaActiva = false;
let segundosCuentaRegresiva = 3;
let bordeResaltado = false;

let partidasGanadasJugador1 = 0;
let partidasGanadasJugador2 = 0;
let golesJugador1 = 0;
let golesJugador2 = 0;

// ============================================================
// CONFIGURACIÓN DEL CANVAS Y ELEMENTOS DEL JUEGO
// ============================================================

canvasMenu.width = window.innerWidth;
canvasMenu.height = window.innerHeight;

canvasJuego.width = 1200;
canvasJuego.height = 650;

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
};

const paletaIzquierda = {
    x: PALETA.margen,
    y: canvasJuego.height / 2 - PALETA.alto / 2
};

const paletaDerecha = {
    x: canvasJuego.width - PALETA.margen - PALETA.ancho,
    y: canvasJuego.height / 2 - PALETA.alto / 2
};

const pelota = {
    x: canvasJuego.width / 2,
    y: canvasJuego.height / 2
};

const pelotaMenu = {
    x: canvasMenu.width / 2,
    y: canvasMenu.height / 2
};

const teclasPresionadas = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

// ============================================================
// CONTROLES DEL TECLADO
// ============================================================

document.addEventListener("keydown", (evento) => {
    const elementoActivo = evento.target.tagName;

    if (
        elementoActivo === "INPUT" ||
        elementoActivo === "TEXTAREA" ||
        evento.target.isContentEditable
    ) {
        return;
    }

    const tecla = evento.key.length === 1
        ? evento.key.toLocaleLowerCase()
        : evento.key;

    if (tecla in teclasPresionadas) {
        evento.preventDefault();
        teclasPresionadas[tecla] = true;
    }
});

document.addEventListener("keyup", (evento) => {
    const elementoActivo = evento.target.tagName;

    if (
        elementoActivo === "INPUT" ||
        elementoActivo === "TEXTAREA" ||
        evento.target.isContentEditable
    ) {
        return;
    }

    const tecla = evento.key.length === 1
        ? evento.key.toLocaleLowerCase()
        : evento.key;

    if (tecla in teclasPresionadas) {
        evento.preventDefault();
        teclasPresionadas[tecla] = false;
    }
});

// ============================================================
// INICIO Y PAUSA DE LA PARTIDA
// ============================================================

botonIniciar.onclick = () => {
    const nombreJugador1 = inputJugador1.value.trim();
    const nombreJugador2 = inputJugador2.value.trim();

    if (nombreJugador1 === "" || nombreJugador2 === "") {
        alert("Ingresa el nombre de los jugadores para comenzar");

        if (nombreJugador1 === "") {
            inputJugador1.style.borderColor = "red";
        }

        if (nombreJugador2 === "") {
            inputJugador2.style.borderColor = "red";
        }

        return;
    }

    inputJugador1.style.borderColor = "#dbd9d9";
    inputJugador2.style.borderColor = "#dbd9d9";

    musicaMenu.volume = 0.3;

    nombreControlJugador1.innerText = nombreJugador1;
    nombreControlJugador2.innerText = nombreJugador2;

    menuJuego.style.display = "none";
    pantallaJuego.style.display = "flex";

    nombresJugador1.forEach((elemento) => {
        elemento.innerText = nombreJugador1;
    });

    nombresJugador2.forEach((elemento) => {
        elemento.innerText = nombreJugador2;
    });

    cuentaRegresivaActiva = true;
    segundosCuentaRegresiva = 3;

    pelota.x = canvasJuego.width / 2;
    pelota.y = canvasJuego.height / 2;

    const intervaloCuentaRegresiva = setInterval(() => {
        segundosCuentaRegresiva--;

        if (segundosCuentaRegresiva === 0) {
            clearInterval(intervaloCuentaRegresiva);
            cuentaRegresivaActiva = false;
            juegoActivo = true;

            PELOTA.velocidadX = Math.random() > 0.5 ? 4 : -4;
            PELOTA.velocidadY = Math.random() > 0.5 ? 4 : -4;
        }
    }, 1000);
};

botonPausar.onclick = () => {
    juegoPausado = !juegoPausado;
    botonPausar.innerText = juegoPausado ? "REANUDAR" : "PAUSAR";

    if (juegoPausado) {
        for (const tecla in teclasPresionadas) {
            teclasPresionadas[tecla] = false;
        }
    }
};


document.addEventListener("keydown", (e)=>{

    const tag = e.target.tagName;
    if (tag === "INPUT" && juegoActivo === false || tag === "TEXTAREA" && juegoActivo === false || e.target.isContentEditable && juegoActivo === false) return 

    if (e.key === " "){

        e.preventDefault();
        juegoPausado = !juegoPausado;
    botonPausar.innerText = juegoPausado ? "REANUDAR" : "PAUSAR";

    if (juegoPausado) {
        for (const tecla in teclasPresionadas) {
            teclasPresionadas[tecla] = false;
        }
    }
    }
});



// ============================================================
// ANIMACIÓN DEL MENÚ
// ============================================================

function dibujarPelotaMenu() {
    contextoMenu.beginPath();
    contextoMenu.arc(
        pelotaMenu.x,
        pelotaMenu.y,
        PELOTA.radio,
        0,
        Math.PI * 2
    );
    contextoMenu.fillStyle = PELOTA.color;
    contextoMenu.fill();
    contextoMenu.closePath();
}

function moverPelotaMenu() {
    pelotaMenu.x += PELOTA.velocidadX;
    pelotaMenu.y += PELOTA.velocidadY;

    if (
        pelotaMenu.y - PELOTA.radio <= 0 ||
        pelotaMenu.y + PELOTA.radio >= canvasMenu.height
    ) {
        PELOTA.velocidadY = -PELOTA.velocidadY;
    }

    if (pelotaMenu.x + PELOTA.radio >= canvasMenu.width) {
        PELOTA.velocidadX = -PELOTA.velocidadX;
    }

    if (pelotaMenu.x - PELOTA.radio <= 0) {
        PELOTA.velocidadX = -PELOTA.velocidadX;
    }
}

function animarMenu() {
    contextoMenu.clearRect(
        0,
        0,
        canvasMenu.width,
        canvasMenu.height
    );

    if (!juegoActivo) {
        moverPelotaMenu();
    }

    dibujarPelotaMenu();
    requestAnimationFrame(animarMenu);
}

animarMenu();

// ============================================================
// DIBUJO DE LOS ELEMENTOS DEL JUEGO
// ============================================================

function dibujarPaletas() {
    contextoJuego.fillStyle = PALETA.color;

    contextoJuego.fillRect(
        paletaIzquierda.x,
        paletaIzquierda.y,
        PALETA.ancho,
        PALETA.alto
    );

    contextoJuego.fillRect(
        paletaDerecha.x,
        paletaDerecha.y,
        PALETA.ancho,
        PALETA.alto
    );
}

function dibujarPelota() {
    contextoJuego.beginPath();
    contextoJuego.arc(
        pelota.x,
        pelota.y,
        PELOTA.radio,
        0,
        Math.PI * 2
    );
    contextoJuego.fillStyle = PELOTA.color;
    contextoJuego.fill();
    contextoJuego.closePath();
}

// ============================================================
// MOVIMIENTO DE LAS PALETAS
// ============================================================

function moverPaletas() {
    if (teclasPresionadas.w) {
        paletaIzquierda.y -= PALETA.velocidad;

        if (paletaIzquierda.y < PALETA.margen) {
            paletaIzquierda.y = PALETA.margen;
        }
    }

    if (teclasPresionadas.s) {
        paletaIzquierda.y += PALETA.velocidad;

        if (paletaIzquierda.y + PALETA.alto > canvasJuego.height - PALETA.margen) {
            paletaIzquierda.y = canvasJuego.height - PALETA.alto - PALETA.margen;
        }
    }

    if (teclasPresionadas.ArrowUp) {
        paletaDerecha.y -= PALETA.velocidad;

        if (paletaDerecha.y < PALETA.margen) {
            paletaDerecha.y = PALETA.margen;
        }
    }

    if (teclasPresionadas.ArrowDown) {
        paletaDerecha.y += PALETA.velocidad;

        if (paletaDerecha.y + PALETA.alto > canvasJuego.height - PALETA.margen) {
            paletaDerecha.y = canvasJuego.height - PALETA.alto - PALETA.margen;
        }
    }
}

// ============================================================
// PUNTUACIÓN Y MOVIMIENTO DE LA PELOTA
// ============================================================

function moverPelota() {
    pelota.x += PELOTA.velocidadX;
    pelota.y += PELOTA.velocidadY;

    // Rebote contra los bordes superior e inferior.
    if (
        pelota.y - PELOTA.radio <= 0 ||
        pelota.y + PELOTA.radio >= canvasJuego.height
    ) {
        PELOTA.velocidadY = -PELOTA.velocidadY;
    }

    // Punto para el jugador 1.
    if (pelota.x + PELOTA.radio >= canvasJuego.width) {
        bordeResaltado = !bordeResaltado;

        if (bordeResaltado) {
            canvasJuego.style.borderColor = "rgb(215, 70, 53)";

            setTimeout(() => {
                canvasJuego.style.borderColor = "#dbd9d9";
                bordeResaltado = !bordeResaltado;
            }, 200);
        }

        golesJugador1++;
        marcadorGolesJugador1.innerText = golesJugador1;

        if (golesJugador1 == 10) {
            golesJugador1 = 0;
            golesJugador2 = 0;

            marcadorGolesJugador1.innerText = 0;
            marcadorGolesJugador2.innerText = 0;

            partidasGanadasJugador1++;
            marcadorPartidasJugador1.innerText = partidasGanadasJugador1;

            PELOTA.velocidadX = Math.abs(PELOTA.velocidadX) + 1;
            PELOTA.velocidadY = Math.abs(PELOTA.velocidadX) + 1;
            PALETA.velocidad += 0.5;
        }

        pelota.x = canvasJuego.width / 2;
        pelota.y = canvasJuego.height / 2;
        PELOTA.velocidadX = -PELOTA.velocidadX;
    }

    // Punto para el jugador 2.
    if (pelota.x - PELOTA.radio <= 0) {
        bordeResaltado = !bordeResaltado;

        if (bordeResaltado) {
            canvasJuego.style.borderColor = "rgb(215, 70, 53)";

            setTimeout(() => {
                canvasJuego.style.borderColor = "#dbd9d9";
                bordeResaltado = !bordeResaltado;
            }, 200);
        }

        golesJugador2++;
        marcadorGolesJugador2.innerText = golesJugador2;

        if (golesJugador2 == 10) {
            golesJugador1 = 0;
            golesJugador2 = 0;

            marcadorGolesJugador1.innerText = 0;
            marcadorGolesJugador2.innerText = 0;

            partidasGanadasJugador2++;
            partidasGanadasJugador1++;
            marcadorPartidasJugador2.innerText = partidasGanadasJugador2;

            PELOTA.velocidadX = Math.abs(PELOTA.velocidadX) + 1;
            PELOTA.velocidadY = Math.abs(PELOTA.velocidadX) + 1;
            PALETA.velocidad += 0.5;
        }

        pelota.x = canvasJuego.width / 2;
        pelota.y = canvasJuego.height / 2;
        PELOTA.velocidadX = -PELOTA.velocidadX;
    }

    // Colisión con la paleta derecha.
    if (
        pelota.x + PELOTA.radio >= paletaDerecha.x &&
        pelota.x - PELOTA.radio <= paletaDerecha.x + PALETA.ancho &&
        pelota.y + PELOTA.radio >= paletaDerecha.y &&
        pelota.y - PELOTA.radio <= paletaDerecha.y + PALETA.alto
    ) {
        pelota.x = paletaDerecha.x - PELOTA.radio;
        PELOTA.velocidadX = -PELOTA.velocidadX;
    }

    // Colisión con la paleta izquierda.
    if (
        pelota.x - PELOTA.radio <= paletaIzquierda.x + PALETA.ancho &&
        pelota.x + PELOTA.radio >= paletaIzquierda.x &&
        pelota.y + PELOTA.radio >= paletaIzquierda.y &&
        pelota.y - PELOTA.radio <= paletaIzquierda.y + PALETA.alto
    ) {
        pelota.x = paletaIzquierda.x + PALETA.ancho + PELOTA.radio;
        PELOTA.velocidadX = -PELOTA.velocidadX;
    }
}

// ============================================================
// BUCLE PRINCIPAL DEL JUEGO
// ============================================================

function dibujarJuego() {
    contextoJuego.clearRect(
        0,
        0,
        canvasJuego.width,
        canvasJuego.height
    );

    if (juegoActivo && !juegoPausado) {
        moverPaletas();
        moverPelota();
    }

    dibujarPaletas();
    dibujarPelota();

    if (cuentaRegresivaActiva) {
        contextoJuego.fillStyle = "rgba(255, 255, 255, 0.9)";
        contextoJuego.font = "bold 180px 'Segoe UI', Tahoma, sans-serif";
        contextoJuego.textAlign = "center";
        contextoJuego.textBaseline = "middle";

        contextoJuego.fillText(
            segundosCuentaRegresiva,
            canvasJuego.width / 2,
            canvasJuego.height / 2
        );
    }

    requestAnimationFrame(dibujarJuego);
}

dibujarJuego();
