const rutina = {
  "Torso A": [
    { nombre: "Vuelos laterales", series: 2, reps: "10-12" },
    { nombre: "Press inclinado en smith", series: 3, reps: "4-7" },
    { nombre: "Peck Deck", series: 2, reps: "6-10" },
    { nombre: "Remo sentado en máquina", series: 2, reps: "5-7" },
    { nombre: "Curl de biceps sentado", series: 2, reps: "5-8" },
    {
      nombre: "Press frances en banco inclinado",
      series: 2,
      reps: "6-10",
    },
  ],
  "Pierna A": [
    { nombre: "Movilidad", series: 1, reps: "" },
    {
      nombre: "Gemelos en prensa (4s concéntrica)",
      series: 2,
      reps: "6-10",
    },
    { nombre: "Curl femoral", series: 2, reps: "6-10" },
    { nombre: "Sentadilla en máquina Smith", series: 3, reps: "5-8" },
    { nombre: "Prensa", series: 3, reps: "5-8" },
    { nombre: "Extension de Cuadriceps", series: 2, reps: "6-10" },
    { nombre: "Aductores en máquina", series: 2, reps: "6-10" },
    { nombre: "Plancha abdominal", series: 3, reps: "30-45s" },
  ],
  "Torso B": [
    {
      nombre: "Gemelos en prensa (4s estiramiento)",
      series: 1,
      reps: "6-10",
    },
    { nombre: "Elevaciones laterales", series: 2, reps: "10-12" },
    { nombre: "Press inclinado en máquina", series: 2, reps: "5-8" },
    { nombre: "Press militar en máquina", series: 2, reps: "8-10" },
    { nombre: "Press plano en smith", series: 1, reps: "5-8" },
    { nombre: "Jalón al pecho abierto", series: 2, reps: "5-8" },
    { nombre: "Extensión de triceps unilateral", series: 2, reps: "5-8" },
    { nombre: "Curl de biceps unilateral", series: 2, reps: "5-8" },
  ],
  "Pierna B": [
    { nombre: "Movilidad", series: 1, reps: "" },
    {
      nombre: "Gemelos en prensa (4s concéntrica)",
      series: 2,
      reps: "5-8",
    },
    { nombre: "Sentadilla en smith", series: 2, reps: "5-8" },
    { nombre: "Peso muerto piernas rígidas", series: 2, reps: "5-8" },
    { nombre: "Prensa unilateral", series: 1, reps: "6-10" },
    { nombre: "Extension de cuadriceps", series: 2, reps: "fallo" },
    { nombre: "Aductores en máquina", series: 2, reps: "6-10" },
    { nombre: "Vuelos laterales", series: 2, reps: "10-12" },
  ],
};

// Detecta el día y semana
function getRutinaDelDia() {
  const hoy = new Date();
  const dia = hoy.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado

  // Si no es lunes, martes o viernes → descanso
  if (![1, 2, 5].includes(dia)) return "Descanso";

  const semana = Math.floor(
    (hoy - new Date(hoy.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000)
  );
  console.log(semana);

  const rotacionPar = {
    1: "Torso A", // Lunes
    2: "Pierna A", // Martes
    5: "Torso B", // Viernes
  };

  const rotacionImpar = {
    1: "Pierna B", // Lunes
    2: "Torso A", // Martes
    5: "Pierna A", // Viernes
  };

  const rotacion = semana % 2 === 0 ? rotacionPar : rotacionImpar;

  return rotacion[dia];
}

// Guarda el progreso (series restantes) en localStorage
function guardarProgresoLocalStorage(rutinaDia, ejercicio, seriesRestantes) {
  const hoy = new Date().toISOString().split("T")[0];
  const clave = `progreso-${hoy}`;
  let progreso = JSON.parse(localStorage.getItem(clave)) || {};
  if (!progreso[rutinaDia]) progreso[rutinaDia] = {};
  progreso[rutinaDia][ejercicio] = seriesRestantes;
  localStorage.setItem(clave, JSON.stringify(progreso));
}

// Recupera progreso guardado
function recuperarProgresoLocalStorage(rutinaDia, ejercicio, seriesTotales) {
  const hoy = new Date().toISOString().split("T")[0];
  const clave = `progreso-${hoy}`;
  let progreso = JSON.parse(localStorage.getItem(clave)) || {};
  if (progreso[rutinaDia]) {
    // Usamos hasOwnProperty para distinguir 0 de undefined
    if (progreso[rutinaDia].hasOwnProperty(ejercicio)) {
      return progreso[rutinaDia][ejercicio];
    }
  }
  return seriesTotales;
}

function renderRutina() {
  const rutinaDia = getRutinaDelDia();
  document.getElementById("rutina-dia").textContent = rutinaDia;

  const contenedor = document.getElementById("ejercicios");
  contenedor.innerHTML = "";

  if (!rutina[rutinaDia]) {
    contenedor.textContent = "Hoy es día de descanso.";
    return;
  }
  rutina[rutinaDia].forEach((ejer, idx) => {
    const div = document.createElement("div");
    div.className = "ejercicio";

    let seriesRestantes = recuperarProgresoLocalStorage(
      rutinaDia,
      ejer.nombre,
      ejer.series
    );

    const p = document.createElement("p");
    p.innerHTML = `<strong>${ejer.nombre}</strong> - ${ejer.series}x${ejer.reps} <br><span id="restantes-${idx}">Series restantes: ${seriesRestantes}</span>`;

    div.appendChild(p);

    if (seriesRestantes > 0) {
      const btn = document.createElement("button");
      btn.textContent = "✔ Terminé una serie";

      const timer = document.createElement("p");
      timer.className = "timer";

      btn.onclick = () => {
        if (seriesRestantes > 0) {
          seriesRestantes--;
          document.getElementById(
            `restantes-${idx}`
          ).textContent = `Series restantes: ${seriesRestantes}`;
          if (ejer.nombre !== "Movilidad") {
            iniciarTemporizador(timer, ejer);
          }
          guardarProgresoLocalStorage(rutinaDia, ejer.nombre, seriesRestantes);
          if (seriesRestantes === 0) {
            btn.style.display = "none";
          }
        }
      };

      div.appendChild(btn);
      div.appendChild(timer);
    }

    contenedor.appendChild(div);
  });
}

function iniciarTemporizador(el, ejer) {
  let segundos =
    ejer.nombre.toLowerCase().includes("curl") ||
    ejer.nombre.toLowerCase().includes("vuelos") ||
    ejer.nombre.toLowerCase().includes("extensión") ||
    ejer.nombre.toLowerCase().includes("peck") ||
    ejer.nombre.toLowerCase().includes("gemelos")
      ? 90 // 90 = aislados = 1:30 mins
      : 120; // 120 = compuestos = 2 mins

  const intervalo = setInterval(() => {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    el.textContent = `Descansando: ${m}:${s.toString().padStart(2, "0")}`;
    if (--segundos < 0) {
      clearInterval(intervalo);
      el.textContent = "¡Descanso terminado!";
      setTimeout(() => {
        el.textContent = "";
      }, 3000);
    }
  }, 1000);
}

renderRutina();
