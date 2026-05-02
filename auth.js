
const IP_SERVIDOR = 'http://34.31.23.74';


function toggleForms() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const title = document.getElementById('formTitle');
  const mensajeEl = document.getElementById('mensaje');
  
  mensajeEl.textContent = ""; // Limpiar mensajes

  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    title.textContent = 'Iniciar Sesión';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    title.textContent = 'Crear Cuenta';
  }
}

// Lógica de Registro
document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre = document.getElementById('regNombre').value;
  const correo = document.getElementById('regCorreo').value;
  const password = document.getElementById('regPassword').value;
  const mensajeEl = document.getElementById('mensaje');

  fetch(`${IP_SERVIDOR}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      mensajeEl.style.color = "green";
      mensajeEl.textContent = data.mensaje;
      setTimeout(toggleForms, 2000); // Cambia al login después de 2 segundos
    } else {
      mensajeEl.style.color = "red";
      mensajeEl.textContent = data.mensaje;
    }
  })
  .catch(err => {
    mensajeEl.style.color = "red";
    mensajeEl.textContent = "Error al conectar con el servidor.";
  });
});

// Lógica de Login y Redirección
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const correo = document.getElementById('loginCorreo').value;
  const password = document.getElementById('loginPassword').value;
  const mensajeEl = document.getElementById('mensaje');

  fetch(`${IP_SERVIDOR}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      mensajeEl.style.color = "green";
      mensajeEl.textContent = "¡Bienvenida, " + data.usuario + "! Redirigiendo...";
      
   
      localStorage.setItem('usuarioActivo', data.usuario);
      
      // REDIRECCIÓN A LA PÁGINA PRINCIPAL
      setTimeout(() => {
        window.location.href = "index.html"; 
      }, 1500);

    } else {
      mensajeEl.style.color = "red";
      mensajeEl.textContent = data.mensaje;
    }
  })
  .catch(err => {
    mensajeEl.style.color = "red";
    mensajeEl.textContent = "Error al conectar con el servidor.";
  });
});
