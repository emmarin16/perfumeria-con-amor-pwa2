if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(res => console.log('Service Worker registrado con éxito'))
            .catch(err => console.log('Error al registrar el Service Worker', err));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const botonesReserva = document.querySelectorAll('.btn-gold-dark');
    let contadorCarrito = 0;
    const badgeCarrito = document.querySelector('.badge');

    botonesReserva.forEach(boton => {
        boton.addEventListener('click', () => {
            contadorCarrito++;
            if(badgeCarrito) {
                badgeCarrito.innerText = contadorCarrito;
                
                boton.innerText = "¡Añadido!";
                boton.classList.replace('btn-gold-dark', 'btn-success');
                
                setTimeout(() => {
                    boton.innerText = "Añadir";
                    boton.classList.replace('btn-success', 'btn-gold-dark');
                }, 2000);
            }
            console.log(`Producto añadido a Perfumería con Amor. Total: ${contadorCarrito}`);
        });
    });
});