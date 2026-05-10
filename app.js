const firebaseConfig = {
    apiKey: "AIzaSyAihdShTcUktHAewx1dXLNM_D0jQWVsNUs",
    authDomain: "historia-revoluc.firebaseapp.com",
    databaseURL: "https://historia-revoluc-default-rtdb.firebaseio.com",
    projectId: "historia-revoluc",
    storageBucket: "historia-revoluc.firebasestorage.app",
    messagingSenderId: "383656491875",
    appId: "1:383656491875:web:d7111a270494cdcb58f156"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- 1. GENERACIÓN DEL QR ---
const qrContainer = document.getElementById("qrcode");
if (qrContainer) {
    const urlMando = window.location.href.replace("index.html", "control.html");
    new QRCode(qrContainer, {
        text: urlMando,
        width: 200,
        height: 200
    });
}

// --- 2. BOTONES DE CONTROL (PC) ---
const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');

if (btnStart) {
    btnStart.onclick = () => {
        document.getElementById('game-overlay').style.display = 'flex';
        let c = 3;
        const cd = document.getElementById('countdown');
        const t = setInterval(() => {
            c--;
            if(c > 0) cd.innerText = c;
            else {
                clearInterval(t);
                cd.innerText = "¡YA!";
                setTimeout(() => {
                    cd.style.display = 'none';
                    db.ref('estadoJuego').set({ estado: 'jugando' });
                }, 800);
            }
        }, 1000);
    };
}

if (btnReset) {
    btnReset.onclick = () => {
        if(confirm("¿Reiniciar toda la partida y borrar jugadores?")) {
            db.ref('jugadores').remove();
            db.ref('estadoJuego').set({ estado: 'espera' });
            db.ref('respuestasRecibidas').remove();
            location.reload();
        }
    };
}

// --- 3. LISTA DE JUGADORES (PC) ---
const pList = document.getElementById('players-list');
if (pList) {
    db.ref('jugadores').on('value', snap => {
        pList.innerHTML = "";
        snap.forEach(child => {
            pList.innerHTML += `<span style="background:#8b0000; padding:5px 10px; border-radius:15px; border:1px solid #ffca28; font-size:14px;">🚩 ${child.val().nombre}</span>`;
        });
    });
}

// --- 4. LÓGICA PARA EL CELULAR (CONTROL) ---
const btnUnirse = document.getElementById('btn-unirse');
let miId = localStorage.getItem('miIdRevolucion') || "";

if (btnUnirse) {
    btnUnirse.onclick = () => {
        const nom = document.getElementById('nombre').value.trim();
        if(nom) {
            const nuevo = db.ref('jugadores').push();
            miId = nuevo.key;
            localStorage.setItem('miIdRevolucion', miId);
            nuevo.set({ nombre: nom, puntos: 0 });
            document.getElementById('registro').style.display = 'none';
            document.getElementById('espera').style.display = 'block';
        }
    };
}

// CAMBIO DE FONDO Y PANTALLAS EN CELULAR
db.ref('estadoJuego').on('value', snap => {
    const estado = snap.val() ? snap.val().estado : 'espera';
    const bg = document.getElementById('bg-layer');
    const pEspera = document.getElementById('espera');
    const pJuego = document.getElementById('juego');

    if(bg) { 
        if(estado === 'jugando') {
            bg.className = 'juego-bg';
            if(pEspera) pEspera.style.display = 'none';
            if(pJuego) pJuego.style.display = 'block';
        } else {
            bg.className = 'espera-bg';
            if(pEspera && miId) pEspera.style.display = 'block';
            if(pJuego) pJuego.style.display = 'none';
        }
    }
});

// FUNCIÓN PARA ENVIAR RESPUESTA
window.enviar = function(letra) {
    if(miId) {
        db.ref('respuestasRecibidas/' + miId).set({ opcion: letra });
        alert("Respuesta " + letra + " enviada a la base.");
    }
};

// --- 5. PASAR DIAPOSITIVAS (PC) ---
let currentS = 0;
window.onkeydown = (e) => {
    if(e.key === "ArrowRight") { 
        const actual = document.getElementById('s'+currentS);
        const siguiente = document.getElementById('s'+(currentS+1));
        if(siguiente) {
            actual.classList.remove('active');
            currentS++;
            siguiente.classList.add('active');
        }
    }
    if(e.key === "ArrowLeft") {
        const actual = document.getElementById('s'+currentS);
        const anterior = document.getElementById('s'+(currentS-1));
        if(anterior) {
            actual.classList.remove('active');
            currentS--;
            anterior.classList.add('active');
        }
    }
};