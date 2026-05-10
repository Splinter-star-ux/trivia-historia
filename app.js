const jugadoresRef = database.ref('jugadores');
const juegoRef = database.ref('estadoJuego');

// Resetear estado al abrir la página
juegoRef.set({ estado: 'espera' });

const generarQR = () => {
    const qrDiv = document.getElementById("qrcode");
    if (qrDiv) {
        qrDiv.innerHTML = ""; 
        let urlBase = window.location.href.split('index.html')[0];
        if (!urlBase.endsWith('/')) urlBase += '/';
        const urlMando = urlBase + 'control.html';
        new QRCode(qrDiv, { text: urlMando, width: 180, height: 180 });
    }
};

// Actualizar lista de jugadores en tiempo real
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

// Lógica del botón INICIAR
const btnIniciar = document.getElementById('btn-iniciar');
if(btnIniciar) {
    btnIniciar.onclick = () => {
        document.getElementById('setup').innerHTML = `
            <h2 style="color:#ffca28;">¡MISIÓN EN CURSO!</h2>
            <p>Atención a los mandos móviles.</p>
        `;
        juegoRef.set({ estado: 'jugando' });
    };
}

// Lógica del botón REINICIAR (El que limpia todo)
document.getElementById('btn-reiniciar').onclick = () => {
    if(confirm("¿Quieres borrar los jugadores y reiniciar la sala?")) {
        // 1. Borramos jugadores
        jugadoresRef.remove();
        // 2. Volvemos el juego a espera
        juegoRef.set({ estado: 'espera' });
        // 3. Recargamos la página para que el QR y todo se limpie
        setTimeout(() => { location.reload(); }, 500);
    }
};

window.onload = generarQR;