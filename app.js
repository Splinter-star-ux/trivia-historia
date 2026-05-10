// CONFIGURACIÓN FIREBASE (Usa la tuya)
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

let miId = "";

// --- LÓGICA PARA EL CONTROL (CELULAR) ---
if (document.getElementById('btn-unirse')) {
    document.getElementById('btn-unirse').onclick = () => {
        const nom = document.getElementById('nombre').value;
        if(nom) {
            const nuevo = db.ref('jugadores').push();
            miId = nuevo.key;
            nuevo.set({ nombre: nom, puntos: 0 });
            document.getElementById('registro').style.display = 'none';
            document.getElementById('espera').style.display = 'block';
        }
    };
}

function enviar(letra) {
    if(miId) db.ref('respuestasRecibidas/' + miId).set({ opcion: letra });
}

// CAMBIO DE FONDO DINÁMICO EN EL CELULAR
db.ref('estadoJuego').on('value', snap => {
    const estado = snap.val() ? snap.val().estado : 'espera';
    const bg = document.getElementById('bg-layer');
    const pEspera = document.getElementById('espera');
    const pJuego = document.getElementById('juego');

    if(bg) { // Solo si estamos en el control
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

// --- LÓGICA PARA EL HOST (PC) ---
if (document.getElementById('btn-start')) {
    // Generar QR al cargar
    new QRCode(document.getElementById("qrcode"), { text: window.location.href.replace("index.html", "control.html"), width: 200, height: 200 });

    // Cambiar diapositivas con flechas
    let currentS = 0;
    window.onkeydown = (e) => {
        if(e.key === "ArrowRight") { 
            document.getElementById('s'+currentS).classList.remove('active');
            currentS++;
            document.getElementById('s'+currentS).classList.add('active');
        }
    };

    // Iniciar Trivia
    document.getElementById('btn-start').onclick = () => {
        document.getElementById('game-overlay').style.display = 'flex';
        iniciarPregunta();
    };
}

function iniciarPregunta() {
    let count = 3;
    const cd = document.getElementById('countdown');
    cd.innerText = count;
    const timer = setInterval(() => {
        count--;
        if(count > 0) cd.innerText = count;
        else {
            clearInterval(timer);
            cd.innerText = "¡YA!";
            setTimeout(() => {
                cd.style.display = 'none';
                document.getElementById('question-area').style.display = 'block';
                db.ref('estadoJuego').set({ estado: 'jugando' });
                // Aquí podrías poner el resto de tu lógica de tiempo...
            }, 1000);
        }
    }, 1000);
}