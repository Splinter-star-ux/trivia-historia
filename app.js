const jugadoresRef = database.ref('jugadores');
const juegoRef = database.ref('estadoJuego');

// Limpiar estado al cargar
juegoRef.set({ estado: 'espera' });

function generarQR() {
    const qrDiv = document.getElementById("qrcode");
    if (!qrDiv) return;

    qrDiv.innerHTML = ""; // Limpiar el cuadro blanco
    
    // Obtenemos la URL de tu GitHub Pages automáticamente
    let urlMando = window.location.href.replace("index.html", "") + "control.html";
    
    try {
        new QRCode(qrDiv, {
            text: urlMando,
            width: 180,
            height: 180,
            colorDark : "#000000",
            colorLight : "#ffffff"
        });
        console.log("QR generado para: " + urlMando);
    } catch (e) {
        console.error("Error al crear QR, reintentando...", e);
    }
}

// Escuchar jugadores
jugadoresRef.on('value', (snap) => {
    const lista = document.getElementById('lista-jugadores');
    if (lista) {
        lista.innerHTML = "";
        snap.forEach((child) => {
            const li = document.createElement('li');
            li.innerHTML = `🚩 <span>${child.val().nombre}</span> - LISTO`;
            lista.appendChild(li);
        });
    }
});

// Botones
document.getElementById('btn-iniciar').onclick = () => {
    document.getElementById('setup').innerHTML = "<h2>¡MISIÓN INICIADA!</h2><p>Revisa tu celular</p>";
    juegoRef.set({ estado: 'jugando' });
};

document.getElementById('btn-reiniciar').onclick = () => {
    if(confirm("¿Reiniciar sala?")) {
        jugadoresRef.remove();
        juegoRef.set({ estado: 'espera' });
        location.reload();
    }
};

// FUERZA EL QR AL CARGAR Y 1 SEGUNDO DESPUÉS
window.onload = () => {
    generarQR();
    setTimeout(generarQR, 1000); 
};