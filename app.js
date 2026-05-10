// 1. CONFIGURACIÓN DE FIREBASE (Asegúrate de que sea la misma de tu index.html)
const jugadoresRef = database.ref('jugadores');
const juegoRef = database.ref('estadoJuego');

// 2. GENERADOR DE QR FORZADO A CONTROL.HTML
const generarQR = () => {
    const qrDiv = document.getElementById("qrcode");
    if (qrDiv) {
        qrDiv.innerHTML = ""; 
        
        // Obtenemos la URL actual de la barra de direcciones
        let urlBase = window.location.href;
        
        // Limpiamos si termina en index.html para no duplicar
        urlBase = urlBase.split('index.html')[0];
        
        // Nos aseguramos de que termine en /
        if (!urlBase.endsWith('/')) {
            urlBase += '/';
        }
        
        // Forzamos que el QR apunte al mando
        const urlMando = urlBase + 'control.html';

        new QRCode(qrDiv, {
            text: urlMando,
            width: 180,
            height: 180,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H // Mayor seguridad de lectura
        });
        
        console.log("QR GENERADO HACIA: " + urlMando);
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
            // Usamos el estilo que definimos en el CSS
            li.innerHTML = `🚩 <span>${datos.nombre}</span> - LISTO`;
            lista.appendChild(li);
        });
    }
});

// 4. LÓGICA PARA INICIAR LA TRIVIA
const iniciarTrivia = () => {
    const setupDiv = document.getElementById('setup');
    
    // Cambiamos el contenido de la caja principal
    setupDiv.innerHTML = `
        <div id="pregunta-box" style="animation: aparecer 0.8s ease-out;">
            <h2 style="color: #ffca28; text-shadow: 2px 2px #000;">MISIÓN 1: EL DESEMBARCO</h2>
            <p style="font-size: 1.5rem; margin: 20px 0; font-weight: bold; color: white;">
                ¿En qué año desembarcó el yate Granma en las costas de Cuba?
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                <div style="background: rgba(139,0,0,0.8); padding: 15px; border: 2px solid #ffca28; color: white;">A) 1953</div>
                <div style="background: rgba(139,0,0,0.8); padding: 15px; border: 2px solid #ffca28; color: white; box-shadow: 0 0 10px gold;">B) 1956</div>
                <div style="background: rgba(139,0,0,0.8); padding: 15px; border: 2px solid #ffca28; color: white;">C) 1959</div>
                <div style="background: rgba(139,0,0,0.8); padding: 15px; border: 2px solid #ffca28; color: white;">D) 1952</div>
            </div>
            <p style="margin-top: 30px; font-style: italic; color: #ffca28;">¡Respondan en sus dispositivos!</p>
        </div>
    `;
    
    // Avisamos a Firebase que la trivia comenzó
    juegoRef.set({ 
        estado: 'jugando', 
        preguntaActual: 1,
        timestamp: Date.now()
    });
};

// 5. CONFIGURACIÓN DEL BOTÓN
const btnIniciar = document.getElementById('btn-iniciar');
if (btnIniciar) {
    btnIniciar.addEventListener('click', () => {
        iniciarTrivia();
    });
}

// 6. AL CARGAR LA PÁGINA
window.onload = () => {
    generarQR();
};