// --- CONFIGURACIÓN Y ESTADO ---
const USERS_VALIDOS = ["daniella#404", "dani", "daniella"];
const mensajesError = [
  "Mmm… no sos vos 😉",
  "No no… probá otra vez 😏",
  "Casi… pero no 👀",
  "Autodestrucción en 3...",
  "Solo para alguien especial ♥",
];

let currentStep = 0;
let memoryLevel = "facil";

// --- ELEMENTOS DEL DOM ---
const steps = document.querySelectorAll(".login-step");
const btnLogin = document.getElementById("btn-login");
const inputUser = document.getElementById("user-input");
const loginError = document.getElementById("login-error");
const loginHeader = document.getElementById("login");
const gameContent = document.getElementById("game-content");

// --- LÓGICA DE LOGIN (TU CÓDIGO MEJORADO) ---
function showStep(step) {
  steps.forEach((s) => s.classList.remove("active"));
  steps[step].classList.add("active");
}

function intentarLogin() {
  const valor = inputUser.value.trim().toLowerCase();

  if (USERS_VALIDOS.includes(valor)) {
    ocultarError();
    currentStep = 1;
    showStep(currentStep);
    // Personalizar el saludo en el paso 1
    const welcomeTitle = document.querySelector('[data-step="1"] h1');
    welcomeTitle.textContent = `Hola, ${valor.split("#")[0]} ❤️`;
  } else {
    const mensaje =
      mensajesError[Math.floor(Math.random() * mensajesError.length)];
    mostrarError(mensaje);
    inputUser.value = "";
    inputUser.focus();
  }
}

btnLogin.addEventListener("click", (e) => {
  e.stopPropagation();
  intentarLogin();
});

inputUser.addEventListener("keydown", (e) => {
  if (e.key === "Enter") intentarLogin();
});

function mostrarError(mensaje) {
  loginError.textContent = mensaje;
  loginError.classList.remove("error-active");
  void loginError.offsetWidth; // Reflow
  loginError.classList.add("error-active");
}

function ocultarError() {
  loginError.classList.remove("error-active");
}

// --- NAVEGACIÓN DIAPOSITIVAS ---
loginHeader.addEventListener("click", (e) => {
  // Evitamos que el click en el input o botón dispare el avance
  if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;

  if (currentStep > 0 && currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  } else if (currentStep === steps.length - 1) {
    // Al llegar a la última diapositiva, el botón "Empezar" hace el resto
  }
});

// Botón "¡Empezar Desafío!" que está en el HTML
// Reemplaza esa parte por esta:
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "start-game") {
    console.log("Iniciando aventura...");

    // 1. Ocultamos el login
    loginHeader.style.display = "none";

    // 2. Mostramos el contenedor principal
    gameContent.style.display = "block";

    // 3. Forzamos que la sección del nivel 1 sea visible
    const n1 = document.getElementById("nivel-1");
    if (n1) {
      n1.style.display = "block";
    }

    // 4. Arrancamos el juego
    iniciarMemoria("facil");
  }
});

// --- JUEGO 1: MEMORIA (ESTILO JONIA) ---
const emojis = ["🐤", "❤️", "⚔️", "💎", "🔥", "👑"];
let flippedCards = [];
let matchedPairs = 0;

function iniciarMemoria(nivel) {
  memoryLevel = nivel;
  const tablero = document.getElementById("tablero-memoria");
  tablero.innerHTML = "";
  matchedPairs = 0;

  let numParejas = nivel === "facil" ? 2 : nivel === "normal" ? 4 : 6;
  let cartas = [...emojis.slice(0, numParejas), ...emojis.slice(0, numParejas)];
  cartas.sort(() => Math.random() - 0.5);

  tablero.style.gridTemplateColumns = `repeat(${numParejas <= 2 ? 2 : 4}, 1fr)`;

  cartas.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = emoji;
    card.innerText = "?";
    card.onclick = flipCard;
    tablero.appendChild(card);
  });
}

function flipCard() {
  if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
    this.innerText = this.dataset.value;
    this.classList.add("flipped");
    flippedCards.push(this);
    if (flippedCards.length === 2) setTimeout(checkMatch, 600);
  }
}

function checkMatch() {
  const [c1, c2] = flippedCards;
  if (c1.dataset.value === c2.dataset.value) {
    matchedPairs++;
    let meta = memoryLevel === "facil" ? 2 : memoryLevel === "normal" ? 4 : 6;
    if (matchedPairs === meta) gestionarVictoriaMemoria();
  } else {
    c1.innerText = "?";
    c2.innerText = "?";
    c1.classList.remove("flipped");
    c2.classList.remove("flipped");
  }
  flippedCards = [];
}

function gestionarVictoriaMemoria() {
  const btn = document.getElementById("btn-continuar-1");
  btn.classList.remove("hidden");
  btn.style.display = "inline-block";

  if (memoryLevel === "facil") {
    btn.innerText = "¡Muy Fácil! Vamos al Normal";
    btn.onclick = () => {
      btn.style.display = "none";
      iniciarMemoria("normal");
    };
  } else if (memoryLevel === "normal") {
    btn.innerHTML =
      "¡Eso amor! <br><small>¿Dificil (Opcional) o Siguiente Juego?</small>";
    btn.onclick = () => {
      if (confirm("El nivel dificil desbloquea un mensaje extra")) {
        btn.style.display = "none";
        iniciarMemoria("dificil");
      } else {
        irANivel("intermedio-1");
      }
    };
  } else {
    alert("Mi mayor victoria fue encontrarte ♥🥰.");
    irANivel("intermedio-1");
  }
}

function irANivel(id) {
  document
    .querySelectorAll("section")
    .forEach((s) => (s.style.display = "none"));
  document.getElementById(id).style.display = "block";

  // Si entramos a la diapositiva intermedia, el botón debe llevar al quiz
  if (id === "intermedio-1") {
    const btn = document.querySelector("#intermedio-1 button");
    btn.onclick = () => iniciarQuiz();
  }
}

// Lógica de navegación simple para botones intermedios
function irANivelDirecto(id) {
  irANivel(id);
}

// --- BOTÓN NO ESCAPISTA ---
const noBtn = document.getElementById("no-btn");
noBtn.addEventListener("mouseover", () => {
  const x = Math.random() * (window.innerWidth - 120);
  const y = Math.random() * (window.innerHeight - 60);
  noBtn.style.position = "fixed";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
});

// --- EL SÍ FINAL ---
document.getElementById("si-btn").addEventListener("click", () => {
  document.querySelector(".pregunta-final").innerHTML =
    "¡SABÍA QUE DIRÍAS QUE SÍ! Eres mi persona favorita. ❤️";
  document.getElementById("reproductor-flotante").classList.remove("hidden");
  document.getElementById("no-btn").style.display = "none";
  // Aquí puedes añadir confeti o una animación de plumas
});

// --- CONFIGURACIÓN DEL QUIZ ---
const preguntasPersonales = [
  {
    p: "¿Te acordas como nos conocimos?",
    r: ["En la facu", "Por Discord", "En el LoL", "Un amigo en común"],
    c: 2,
  },
  {
    p: "¿Cuáles son mis colores favoritos?",
    r: [
      "Azul y Verde",
      "Rosa y Blanco",
      "Turquesa, Rosa y Violeta",
      "Amarillo y Gris",
    ],
    c: 2,
  },
  {
    p: "¿Cómo se llaman mis perros?",
    r: ["Sol y Luna", "Meliodas y Elizabeth", "Ares y Uma", "Xayah y Rakan"],
    c: 2,
  },
  {
    p: "¿Cuál es mi main de LoL?",
    r: ["LeBlanc", "Rek'Sai", "Kalista", "Darius"],
    c: 0,
  },
  {
    p: "¿Cuál es mi Pokémon favorito?",
    r: ["Mimikyu", "Eevee", "Sylveon", "Charizard"],
    c: 0,
  },
];

const preguntasRandom = [
  {
    p: "¿Qué animal es un Vastaya?",
    r: ["Humano-Animal", "Dragón", "Robot", "Planta"],
    c: 0,
  },
  {
    p: "¿Cómo se llama la pareja de Xayah?",
    r: ["Sett", "Rakan", "Yasuo", "Ezreal"],
    c: 1,
  },
  {
    p: "¿En qué región viven Xayah y Rakan?",
    r: ["Demacia", "Noxus", "Jonia", "Freljord"],
    c: 2,
  },
  {
    p: "¿Xayah tiene cola?",
    r: ["Si y muy larga", "No", "Si, pero no se ve", "¿Qué es una cola?"],
    c: 2,
  },
];

let aciertosTotales = 0;

function iniciarQuiz() {
  irANivel("nivel-2");
  cargarPregunta();
}

function cargarPregunta() {
  const feedback = document.getElementById("quiz-feedback");
  feedback.innerText = "";

  // Elegimos si toca personal o random (alternado o random)
  let banco = Math.random() > 0.5 ? preguntasPersonales : preguntasRandom;
  let index = Math.floor(Math.random() * banco.length);
  let item = banco[index];

  const preguntaTxt = document.getElementById("quiz-pregunta");
  const opcionesCont = document.getElementById("quiz-opciones");

  preguntaTxt.innerText = item.p;
  opcionesCont.innerHTML = "";

  item.r.forEach((opc, i) => {
    const btn = document.createElement("button");
    btn.classList.add("quiz-btn");
    btn.innerText = opc;
    btn.onclick = () => verificarRespuesta(i, item.c, banco, index);
    opcionesCont.appendChild(btn);
  });
}

function verificarRespuesta(idx, correcta, banco, indexEliminar) {
  const feedback = document.getElementById("quiz-feedback");

  if (idx === correcta) {
    aciertosTotales++;
    feedback.style.color = "#ffd700";
    feedback.innerText = `¡Correcto! (${aciertosTotales}/5)`;

    // Si acertó, eliminamos esa pregunta para que no repita
    banco.splice(indexEliminar, 1);

    if (aciertosTotales >= 5) {
      setTimeout(() => irANivel("intermedio-2"), 1500);
    } else {
      setTimeout(cargarPregunta, 1200);
    }
  } else {
    feedback.style.color = "#ff4d6d";
    feedback.innerText = "¡Mmm... casi! Probemos con otra.";
    // No eliminamos la pregunta, solo barajamos y cargamos otra tras un delay
    setTimeout(cargarPregunta, 1200);
  }
}

// tercer jueguiño
let plumasEntregadas = 0;

function iniciarMision3() {
  document
    .querySelectorAll("section")
    .forEach((s) => (s.style.display = "none"));
  document.getElementById("nivel-3").style.display = "block";

  const plumas = document.querySelectorAll(".feather");
  const dropZone = document.getElementById("drop-zone");
  const textoIndicador = dropZone.querySelector("span");
  let plumasLocales = 0;

  plumas.forEach((p) => {
    p.addEventListener("dragstart", (e) =>
      e.dataTransfer.setData("text", e.target.id),
    );
  });

  dropZone.addEventListener("dragover", (e) => e.preventDefault());

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text");
    const pluma = document.getElementById(id);

    if (pluma) {
      pluma.style.visibility = "hidden";
      plumasLocales++;

      // 1. Quitar el texto al entregar la primera pluma
      if (plumasLocales === 1) {
        textoIndicador.style.display = "none";
      }

      // Cambiar color sutilmente con cada pluma
      dropZone.style.background = `rgba(255, 105, 180, ${plumasLocales * 0.2})`;

      // 2. Al completar las 3 plumas
      if (plumasLocales === 3) {
        dropZone.classList.add("corazon-lleno");

        setTimeout(() => {
          document.getElementById("nivel-3").style.display = "none";
          irANivel("final");
          if (typeof iniciarFinal === "function") iniciarFinal();
        }, 2000);
      }
    }
  });
}

// Modificar la función irANivel para conectar el intermedio-2 con la misión 3
const originalIrANivel = irANivel;
irANivel = function (id) {
  originalIrANivel(id);
  if (id === "intermedio-2") {
    const btn = document.querySelector("#intermedio-2 button");
    btn.onclick = () => iniciarMision3();
  }
  if (id === "final") {
    iniciarFinal();
  }
};

let finalCurrentStep = 1;

function iniciarFinal() {
  crearLluviaMagica();
  const finalSection = document.getElementById("final");
  const fSteps = document.querySelectorAll(".final-step");
  const noBtn = document.getElementById("no-btn");
  const siBtn = document.getElementById("si-btn");

  // Función para cambiar de paso en el final
  finalSection.onclick = (e) => {
    // No avanzar si clickea en los botones del último paso
    if (e.target.tagName === "BUTTON") return;

    if (finalCurrentStep < fSteps.length) {
      fSteps[finalCurrentStep - 1].classList.remove("active");
      finalCurrentStep++;
      fSteps[finalCurrentStep - 1].classList.add("active");
    }
  };

  // Lógica del botón NO escapista
  noBtn.addEventListener("mouseover", () => {
    const x = Math.random() * (window.innerWidth - 120);
    const y = Math.random() * (window.innerHeight - 60);
    noBtn.style.position = "fixed";
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
  });

  // Lógica del botón SÍ
  siBtn.onclick = () => {
    document.querySelector(".final-container").innerHTML = `
            <h1 class="glow-text">¡Te Quiero Mucho! ❤️</h1>
            <p style="font-size: 1.5rem;">Sabía que eras mi Duo perfecto.</p>
            <div style="margin: 20px 0;">
                <img src="duo.jpg" width="280" style="border-radius: 30px;">
            </div>
            <p>♥ Nuestra aventura comienza ahora ♥.</p>
        `;
    document.getElementById("reproductor-flotante").classList.remove("hidden");
  };
}

function crearLluviaMagica() {
    // Creamos el contenedor si no existe
    let container = document.getElementById('particles-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'particles-container';
        document.body.appendChild(container);
    }

    const tipos = ['', '❤️', '✨', '🌸']; // Los elementos que van a caer
    
    setInterval(() => {
        const p = document.createElement('div');
        p.className = 'particle';
        
        // Configuración aleatoria
        p.innerText = tipos[Math.floor(Math.random() * tipos.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 3 + 2) + 's'; // Entre 2 y 5 seg
        p.style.opacity = Math.random();
        p.style.fontSize = (Math.random() * 20 + 10) + 'px';

        container.appendChild(p);

        // Borrar para no saturar la memoria del navegador
        setTimeout(() => {
            p.remove();
        }, 5000);
    }, 300); // Crea una partícula cada 300ms
}