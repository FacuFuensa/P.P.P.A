/* ============================================================
   P.P.P.A. — main.js
   Núcleo de la interfaz: tema claro/oscuro, sonidos, menú,
   animaciones de aparición, contadores y sala de prensa.
   Expone el objeto global PPPA para los demás módulos.
   ============================================================ */
(function () {
  'use strict';

  /* Objeto global compartido entre módulos */
  var PPPA = window.PPPA = window.PPPA || {};

  /* ------------------------------------------------------------
     1. MOTOR DE SONIDO (Web Audio API — sin archivos externos)
     Genera pequeños efectos sintetizados. Se puede silenciar
     con el botón 🔊 y la preferencia queda guardada.
     ------------------------------------------------------------ */
  PPPA.sonido = (function () {
    var contexto = null;
    var activado = localStorage.getItem('pppa-sonido') !== '0';

    /* El AudioContext solo puede crearse tras un gesto del usuario */
    function obtenerContexto() {
      if (!contexto) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) { return null; }
        contexto = new AC();
      }
      if (contexto.state === 'suspended') { contexto.resume(); }
      return contexto;
    }

    /* Reproduce una nota simple con envolvente suave */
    function nota(frecuencia, duracion, tipo, volumen, retardo) {
      var ctx = obtenerContexto();
      if (!ctx) { return; }
      var t = ctx.currentTime + (retardo || 0);
      var osc = ctx.createOscillator();
      var gan = ctx.createGain();
      osc.type = tipo || 'sine';
      osc.frequency.setValueAtTime(frecuencia, t);
      gan.gain.setValueAtTime(0.0001, t);
      gan.gain.exponentialRampToValueAtTime(volumen || 0.12, t + 0.015);
      gan.gain.exponentialRampToValueAtTime(0.0001, t + duracion);
      osc.connect(gan).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + duracion + 0.05);
    }

    /* Catálogo de efectos del sitio */
    var efectos = {
      click:  function () { nota(420, 0.07, 'square', 0.05); },
      voltear:function () { nota(520, 0.08, 'triangle', 0.07); nota(740, 0.09, 'triangle', 0.06, 0.06); },
      abrir:  function () { nota(360, 0.09, 'sine', 0.09); nota(560, 0.12, 'sine', 0.08, 0.07); },
      cerrar: function () { nota(560, 0.08, 'sine', 0.07); nota(360, 0.11, 'sine', 0.06, 0.06); },
      bueno:  function () { nota(523, 0.12, 'triangle', 0.1); nota(659, 0.16, 'triangle', 0.1, 0.09); },
      malo:   function () { nota(311, 0.14, 'sawtooth', 0.06); nota(208, 0.2, 'sawtooth', 0.06, 0.1); },
      ganar:  function () {
        var notas = [523, 659, 784, 1046];
        for (var i = 0; i < notas.length; i++) {
          nota(notas[i], 0.18, 'triangle', 0.11, i * 0.12);
        }
      }
    };

    return {
      activado: function () { return activado; },
      alternar: function () {
        activado = !activado;
        localStorage.setItem('pppa-sonido', activado ? '1' : '0');
        if (activado) { efectos.click(); }
        return activado;
      },
      tocar: function (nombre) {
        if (!activado || !efectos[nombre]) { return; }
        try { efectos[nombre](); } catch (e) { /* audio no disponible: se ignora */ }
      }
    };
  })();

  /* ------------------------------------------------------------
     2. TEMA CLARO / OSCURO (persistente en localStorage)
     ------------------------------------------------------------ */
  var botonTema = document.getElementById('botonTema');
  var oyentesTema = []; /* los gráficos se vuelven a pintar al cambiar el tema */

  PPPA.alCambiarTema = function (callback) { oyentesTema.push(callback); };
  PPPA.temaActual = function () { return document.documentElement.getAttribute('data-theme'); };

  function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    if (botonTema) {
      botonTema.textContent = (tema === 'oscuro') ? '☀️' : '🌙';
      botonTema.title = (tema === 'oscuro') ? 'Modo claro' : 'Modo oscuro';
    }
    for (var i = 0; i < oyentesTema.length; i++) { oyentesTema[i](tema); }
  }

  /* Tema guardado o preferencia del sistema operativo */
  var temaGuardado = localStorage.getItem('pppa-tema');
  if (!temaGuardado) {
    temaGuardado = (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'oscuro' : 'claro';
  }
  aplicarTema(temaGuardado);

  if (botonTema) {
    botonTema.addEventListener('click', function () {
      var nuevo = (PPPA.temaActual() === 'oscuro') ? 'claro' : 'oscuro';
      localStorage.setItem('pppa-tema', nuevo);
      aplicarTema(nuevo);
      PPPA.sonido.tocar('click');
    });
  }

  /* ------------------------------------------------------------
     3. BOTÓN DE SONIDO
     ------------------------------------------------------------ */
  var botonSonido = document.getElementById('botonSonido');
  function pintarBotonSonido() {
    if (!botonSonido) { return; }
    botonSonido.textContent = PPPA.sonido.activado() ? '🔊' : '🔇';
    botonSonido.title = PPPA.sonido.activado() ? 'Silenciar' : 'Activar sonidos';
  }
  pintarBotonSonido();
  if (botonSonido) {
    botonSonido.addEventListener('click', function () {
      PPPA.sonido.alternar();
      pintarBotonSonido();
    });
  }

  /* ------------------------------------------------------------
     4. NAVEGACIÓN: barra fija, menú móvil y botón "arriba"
     ------------------------------------------------------------ */
  var navbar = document.getElementById('navbar');
  var botonMenu = document.getElementById('botonMenu');
  var navLinks = document.getElementById('navLinks');
  var botonArriba = document.getElementById('botonArriba');
  var barraProgreso = document.getElementById('barraProgreso');

  function alDesplazar() {
    var y = window.scrollY || document.documentElement.scrollTop;

    if (navbar) { navbar.classList.toggle('navbar-fija', y > 10); }
    if (botonArriba) { botonArriba.classList.toggle('visible', y > 600); }

    /* Barra de progreso de lectura */
    if (barraProgreso) {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      var avance = total > 0 ? (y / total) : 0;
      barraProgreso.style.transform = 'scaleX(' + avance + ')';
    }
  }
  window.addEventListener('scroll', alDesplazar, { passive: true });
  alDesplazar();

  if (botonMenu && navLinks) {
    botonMenu.addEventListener('click', function () {
      var abierto = navLinks.classList.toggle('nav-abierto');
      botonMenu.classList.toggle('activo', abierto);
      botonMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      PPPA.sonido.tocar('click');
    });
    /* Cierra el menú al elegir una sección */
    navLinks.addEventListener('click', function (evento) {
      if (evento.target.tagName === 'A') {
        navLinks.classList.remove('nav-abierto');
        botonMenu.classList.remove('activo');
        botonMenu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (botonArriba) {
    botonArriba.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      PPPA.sonido.tocar('click');
    });
  }

  /* ------------------------------------------------------------
     5. APARICIÓN AL HACER SCROLL (IntersectionObserver)
     Otros módulos pueden registrar elementos nuevos con
     PPPA.registrarReveal(elemento).
     ------------------------------------------------------------ */
  var observadorReveal = null;
  if ('IntersectionObserver' in window) {
    observadorReveal = new IntersectionObserver(function (entradas) {
      for (var i = 0; i < entradas.length; i++) {
        if (entradas[i].isIntersecting) {
          entradas[i].target.classList.add('visible');
          observadorReveal.unobserve(entradas[i].target);
        }
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  }

  PPPA.registrarReveal = function (elemento) {
    if (observadorReveal) { observadorReveal.observe(elemento); }
    else { elemento.classList.add('visible'); } /* respaldo sin observador */
  };

  var revelables = document.querySelectorAll('[data-reveal]');
  for (var r = 0; r < revelables.length; r++) { PPPA.registrarReveal(revelables[r]); }

  /* ------------------------------------------------------------
     6. CONTADORES ANIMADOS DEL HÉROE
     ------------------------------------------------------------ */
  function animarContador(elemento) {
    var meta = parseInt(elemento.getAttribute('data-meta'), 10) || 0;
    var formatoMiles = elemento.getAttribute('data-formato') === 'miles';
    var duracion = 1600;
    var inicio = null;

    function paso(marca) {
      if (!inicio) { inicio = marca; }
      var progreso = Math.min((marca - inicio) / duracion, 1);
      /* easing de salida para que frene suave */
      var suavizado = 1 - Math.pow(1 - progreso, 3);
      var valor = Math.round(meta * suavizado);
      elemento.textContent = formatoMiles ? valor.toLocaleString('es-AR') : String(valor);
      if (progreso < 1) { requestAnimationFrame(paso); }
    }
    requestAnimationFrame(paso);
  }

  var contadores = document.querySelectorAll('.stat-numero');
  if ('IntersectionObserver' in window) {
    var observadorContador = new IntersectionObserver(function (entradas) {
      for (var i = 0; i < entradas.length; i++) {
        if (entradas[i].isIntersecting) {
          animarContador(entradas[i].target);
          observadorContador.unobserve(entradas[i].target);
        }
      }
    }, { threshold: 0.4 });
    for (var c = 0; c < contadores.length; c++) { observadorContador.observe(contadores[c]); }
  } else {
    for (var c2 = 0; c2 < contadores.length; c2++) { animarContador(contadores[c2]); }
  }

  /* ------------------------------------------------------------
     7. TARJETAS GIRATORIAS DE "QUIÉNES SOMOS"
     Se dan vuelta con clic, Enter o barra espaciadora.
     ------------------------------------------------------------ */
  var tarjetasFlip = document.querySelectorAll('.tarjeta-flip');
  function alternarFlip(tarjeta) {
    var volteada = tarjeta.classList.toggle('volteada');
    tarjeta.setAttribute('aria-pressed', volteada ? 'true' : 'false');
    PPPA.sonido.tocar('voltear');
  }
  for (var f = 0; f < tarjetasFlip.length; f++) {
    (function (tarjeta) {
      tarjeta.addEventListener('click', function () { alternarFlip(tarjeta); });
      tarjeta.addEventListener('keydown', function (evento) {
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          alternarFlip(tarjeta);
        }
      });
    })(tarjetasFlip[f]);
  }

  /* ------------------------------------------------------------
     8. REAJUSTE DE PANELES ABIERTOS AL CAMBIAR EL TAMAÑO
     (acordeones de ministerios)
     ------------------------------------------------------------ */
  window.addEventListener('resize', function () {
    var abiertos = document.querySelectorAll('.min-tarjeta.abierta .min-panel');
    for (var i = 0; i < abiertos.length; i++) {
      abiertos[i].style.maxHeight = abiertos[i].scrollHeight + 'px';
    }
  });

})();
