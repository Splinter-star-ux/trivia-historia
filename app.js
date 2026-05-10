// 1. Generar el QR
const qrDiv = document.getElementById("qrcode");
const urlMando = window.location.href.replace('index.html', 'control.html');
new QRCode(qrDiv, {
    text: urlMando,
    width: 150,
    height: 150
});

// 2. Mostrar jugadores (Asegúrate de tener configurado Firebase antes)
database.ref('jugadores').on('value', (snapshot) => {
    const lista = document.getElementById('lista-jugadores');
    lista.innerHTML = ""; 
    snapshot.forEach((childSnapshot) => {
        const p = childSnapshot.val();
        const li = document.createElement('li');
        li.style.color = "#ffca28";
        li.innerText = `🚩 ${p.nombre} - LISTO`;
        lista.appendChild(li);
    });
});