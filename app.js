const jugadoresRef = database.ref('jugadores');
const juegoRef = database.ref('estadoJuego');

// Generar QR hacia el mando
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
            height: 180
        });
        console.log("QR listo hacia: " + urlMando);
    }
};

// Escuchar quién se conecta
jugadoresRef.on('value', (snapshot) => {
    const lista = document.getElementById('lista-jugadores');
    if (lista) {
        lista.innerHTML = ""; 
        snapshot.forEach((child) => {
            const li = document.createElement('li');
            li.innerHTML = `🚩 <span>${child.val().nombre}</span> - LISTO`;
            lista.appendChild(li);
        });
    }
});

// Botón de inicio
document.getElementById('btn-iniciar').addEventListener('click', () => {
    document.getElementById('setup').innerHTML = `
        <div style="padding:20px; border:2px solid #ffca28; background:rgba(0,0,0,0.5);">
            <h2 style="color:#ffca28;">MISIÓN 1: EL DESEMBARCO</h2>
            <p style="font-size:1.5rem; color:white;">¿En qué año desembarcó el Granma?</p>
        </div>
    `;
    juegoRef.set({ estado: 'jugando' });
});

// Arrancar QR al cargar
window.onload = generarQR;