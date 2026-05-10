// 1. CONFIGURACIÓN DE FIREBASE
// (Asegúrate de que estas claves coincidan con las de tu consola de Firebase)
const jugadoresRef = database.ref('jugadores');
const juegoRef = database.ref('estadoJuego');

// 2. GENERADOR DE QR AUTOMÁTICO (PARA GITHUB)
const generarQR = () => {
    const qrDiv = document.getElementById("qrcode");
    if (qrDiv) {
        qrDiv.innerHTML = ""; // Limpia si había uno antes
        
        // Detecta el link actual (GitHub o Local)
        let urlMando = window.location.href;
        
        if (urlMando.includes('index.html')) {
            urlMando = urlMando.replace('index.html', 'control.html');
        } else {
            // Si termina en /, le sumamos control.html
            urlMando = urlMando.endsWith('/') ? urlMando + 'control.html' : urlMando + '/control.html';
        }

        new QRCode(qrDiv, {
            text: urlMando,
            width: 150,
            height: 150,
            colorDark : "#000000",
            colorLight : "#ffffff",
        });
        console.log("Mando disponible en: " + urlMando);
    }
};

// 3. ESCUCHAR JUGADORES EN TIEMPO REAL
jugadoresRef.on('value', (snapshot) => {
    const lista = document.getElementById('lista-jugadores');
    if (lista) {
        lista.innerHTML = ""; 
        snapshot.forEach((childSnapshot) => {
            const datos = childSnapshot.val();
            const li = document.createElement('li');
            li.innerHTML = `🚩 <span>${datos.nombre}</span> - LISTO`;
            lista.appendChild(li);
        });
    }
});

// 4. LÓGICA DE LAS PREGUNTAS (SISTEMA DE TRIVIA)
const iniciarTrivia = () => {
    const setupDiv = document.getElementById('setup');
    
    // Cambiamos el diseño para mostrar la pregunta
    setupDiv.innerHTML = `
        <div id="pregunta-box" style="animation: aparecer 0.8s ease-out;">
            <h2 style="color: #ffca28; text-shadow: 2px 2px #000;">MISIÓN 1: EL DESEMBARCO</h2>
            <p style="font-size: 1.5rem; margin: 20px 0; font-weight: bold;">
                ¿En qué año desembarcó el yate Granma en las costas de Cuba?
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                <div style="background: rgba(139,0,0,0.8); padding: 15px; border: 2px solid #ffca28;">A) 1953</div>
                <div style="background: rgba(139,0,0,0.8); padding: 15px; border: 2px solid #ffca28; box-shadow: 0 0 10px gold;">B) 1956</div>
                <div style="background: rgba(139,0,0,0.8); padding: 15px; border: 2px solid #ffca28;">C) 1959</div>
                <div style="background: rgba(139,0,0,0.8); padding: 15px; border: 2px solid #ffca28;">D) 1952</div>
            </div>
            <p style="margin-top: 30px; font-style: italic; color: #aaa;">Esperando respuestas de los combatientes...</p>
        </div>
    `;
    
    // Actualizamos Firebase para que los celulares sepan que el juego empezó
    juegoRef.set({ estado: 'jugando', preguntaActual: 1 });
};

// 5. EVENTO DEL BOTÓN INICIAR
const btnIniciar = document.getElementById('btn-iniciar');
if (btnIniciar) {
    btnIniciar.addEventListener('click', () => {
        iniciarTrivia();
    });
}

// 6. EJECUCIÓN INICIAL
window.onload = () => {
    generarQR();
    // Limpiamos jugadores de la sesión anterior al recargar el Host (opcional)
    // jugadoresRef.remove(); 
};