// 1. CONFIGURACIÓN DE FIREBASE 
// Asegúrate de que las claves de abajo sean exactamente las tuyas
const database = firebase.database();
const jugadoresRef = database.ref('jugadores');
const juegoRef = database.ref('estadoJuego');

// 2. GENERADOR DE QR (Hacia control.html)
const generarQR = () => {
    const qrDiv = document.getElementById("qrcode");
    if (qrDiv) {
        qrDiv.innerHTML = ""; 
        let urlBase = window.location.href.split('index.html')[0];
        if (!urlBase.endsWith('/')) urlBase += '/';
        const urlMando = urlBase + 'control.html';

        new QRCode(qrDiv, {
            text: urlMando,
            width: 180,
            height: 180,
            colorDark : "#000000",
            colorLight : "#ffffff"
        });
        console.log("QR apunta a: " + urlMando);
    }
};

// 3. ESCUCHAR JUGADORES (Aquí estaba el fallo)
// Usamos 'value' para que cada vez que alguien se una, se limpie y se vuelva a dibujar la lista
jugadoresRef.on('value', (snapshot) => {
    const lista = document.getElementById('lista-jugadores');
    if (lista) {
        lista.innerHTML = ""; // Limpiamos la lista vieja
        
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const datos = childSnapshot.val();
                const li = document.createElement('li');
                
                // IMPORTANTE: El mando envía "nombre", así que aquí leemos "datos.nombre"
                li.innerHTML = `🚩 <span>${datos.nombre.toUpperCase()}</span> - LISTO`;
                
                // Estilo rápido para que se vea en el cuadro verde
                li.style.background = "rgba(139, 0, 0, 0.6)";
                li.style.margin = "5px";
                li.style.padding = "10px";
                li.style.border = "1px solid #ffca28";
                li.style.display = "inline-block";
                
                lista.appendChild(li);
            });
        } else {
            lista.innerHTML = "<p style='color: #aaa;'>Esperando combatientes...</p>";
        }
    }
});

// 4. LÓGICA DE INICIO
const iniciarTrivia = () => {
    const setupDiv = document.getElementById('setup');
    setupDiv.innerHTML = `
        <div id="pregunta-box">
            <h2 style="color: #ffca28;">MISIÓN 1: EL DESEMBARCO</h2>
            <p style="font-size: 1.5rem; font-weight: bold; color: white;">
                ¿En qué año desembarcó el yate Granma en las costas de Cuba?
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                <div style="background: rgba(139,0,0,0.8); padding: 15px; border: 2px solid #ffca28; color: white;">A) 1953</div>
                <div style="background: rgba(139,0,0,0.8); padding: 15px; border: 2px solid #ffca28; color: white; box-shadow: 0 0 10px gold;">B) 1956</div>
                <div style="background: rgba(139,0,0,0.8); padding: 15px; border: 2px solid #ffca28; color: white;">C) 1959</div>
                <div style="background: rgba(139,0,0,0.8); padding: 15px; border: 2px solid #ffca28; color: white;">D) 1952</div>
            </div>
        </div>
    `;
    juegoRef.set({ estado: 'jugando', preguntaActual: 1 });
};

// 5. BOTÓN Y CARGA
document.getElementById('btn-iniciar').addEventListener('click', iniciarTrivia);

window.onload = () => {
    generarQR();
    // Opcional: Limpiar jugadores al empezar la expo para que no salgan nombres viejos
    // jugadoresRef.remove(); 
};