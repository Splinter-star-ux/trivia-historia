const jugadoresRef = database.ref('jugadores');
const juegoRef = database.ref('estadoJuego');

// Reiniciar estado de juego al cargar la página en PC
juegoRef.set({ estado: 'espera' });

const generarQR = () => {
    const qrDiv = document.getElementById("qrcode");
    if (qrDiv) {
        qrDiv.innerHTML = ""; // Limpiar antes de generar
        
        let urlBase = window.location.href.split('index.html')[0];
        if (!urlBase.endsWith('/')) urlBase += '/';
        const urlMando = urlBase + 'control.html';

        new QRCode(qrDiv, {
            text: urlMando,
            width: 180,
            height: 180,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        console.log("QR listo para: " + urlMando);
    }
};

// Escuchar y mostrar jugadores
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

// Acción de iniciar operación
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

// Acción de reiniciar (Limpiar base de datos)
document.getElementById('btn-reiniciar').onclick = () => {
    if(confirm("¿Quieres borrar a todos los reclutas y reiniciar la sala?")) {
        jugadoresRef.remove();
        juegoRef.set({ estado: 'espera' });
        setTimeout(() => { location.reload(); }, 500);
    }
};

// Asegurar que el QR se genere al cargar
window.onload = () => {
    generarQR();
    // Reintento de seguridad un segundo después
    setTimeout(generarQR, 1000);
};