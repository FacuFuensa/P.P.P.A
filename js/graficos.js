/* ============================================================
   P.P.P.A. — graficos.js
   Estadísticas visuales con Chart.js (datos ficticios e
   ilustrativos). Los gráficos se crean recién cuando entran
   en pantalla y se repintan al cambiar el tema claro/oscuro.
   ============================================================ */
(function () {
  'use strict';

  var PPPA = window.PPPA || {};
  var seccion = document.getElementById('estadisticas');
  if (!seccion) { return; }

  /* Colores de marca fijos (los del escudo) */
  var LILA = '#B687E0';
  var LILA_FUERTE = '#8A5BC4';
  var ORO = '#AC8A3E';
  var ORO_CLARO = '#D4B468';
  var VERDE = '#5BC8A0';

  /* Colores que dependen del tema (se leen de las variables CSS) */
  function coloresDelTema() {
    var estilos = getComputedStyle(seccion);
    return {
      texto: (estilos.getPropertyValue('--texto') || '#F2EAFB').trim(),
      textoSuave: (estilos.getPropertyValue('--texto-suave') || '#C2AEDC').trim(),
      linea: (estilos.getPropertyValue('--linea') || 'rgba(242,234,251,.16)').trim()
    };
  }

  /* ------------------------------------------------------------
     FÁBRICAS DE GRÁFICOS: cada función crea un gráfico completo
     ------------------------------------------------------------ */
  var fabricas = {

    /* 1) EMPLEO — líneas comparando el plan con la tendencia actual */
    graficoEmpleo: function (lienzo, c) {
      return new Chart(lienzo, {
        type: 'line',
        data: {
          labels: ['2026', '2027', '2028', '2029', '2030'],
          datasets: [
            {
              label: 'Con plan Potencia',
              data: [382, 401, 423, 446, 468],
              borderColor: LILA,
              backgroundColor: 'rgba(182, 135, 224, 0.22)',
              fill: true,
              tension: 0.35,
              borderWidth: 3,
              pointBackgroundColor: LILA,
              pointRadius: 5,
              pointHoverRadius: 7
            },
            {
              label: 'Tendencia actual',
              data: [382, 386, 391, 395, 398],
              borderColor: c.textoSuave,
              borderDash: [7, 6],
              fill: false,
              tension: 0.35,
              borderWidth: 2,
              pointRadius: 3,
              pointBackgroundColor: c.textoSuave
            }
          ]
        },
        options: opcionesBase(c, {
          scales: ejes(c, 'miles de empleos')
        })
      });
    },

    /* 2) EDUCACIÓN — barras de becas y escuelas técnicas */
    graficoEducacion: function (lienzo, c) {
      return new Chart(lienzo, {
        type: 'bar',
        data: {
          labels: ['2027', '2028', '2029', '2030'],
          datasets: [
            {
              label: 'Becas Potencia (miles)',
              data: [3, 6, 8, 10],
              backgroundColor: LILA,
              borderRadius: 9,
              maxBarThickness: 44
            },
            {
              label: 'Escuelas técnicas renovadas',
              data: [12, 18, 24, 30],
              backgroundColor: ORO_CLARO,
              borderRadius: 9,
              maxBarThickness: 44
            }
          ]
        },
        options: opcionesBase(c, {
          scales: ejes(c, 'cantidad acumulada')
        })
      });
    },

    /* 3) TURISMO — anillo con el origen de los visitantes */
    graficoTurismo: function (lienzo, c) {
      return new Chart(lienzo, {
        type: 'doughnut',
        data: {
          labels: ['NOA', 'Buenos Aires', 'Resto del país', 'Internacional'],
          datasets: [{
            data: [38, 27, 19, 16],
            backgroundColor: [LILA, ORO_CLARO, LILA_FUERTE, VERDE],
            borderWidth: 3,
            borderColor: 'transparent',
            hoverOffset: 10
          }]
        },
        options: opcionesBase(c, {
          cutout: '58%',
          plugins: {
            legend: leyenda(c),
            tooltip: {
              callbacks: {
                label: function (item) { return ' ' + item.label + ': ' + item.parsed + '%'; }
              }
            }
          }
        })
      });
    },

    /* 4) DEPORTES — radar de inversión por disciplina */
    graficoDeportes: function (lienzo, c) {
      return new Chart(lienzo, {
        type: 'radar',
        data: {
          labels: ['Fútbol', 'Hockey', 'Atletismo', 'Básquet', 'Natación', 'Rugby'],
          datasets: [
            {
              label: 'Inversión hoy',
              data: [60, 40, 30, 45, 25, 35],
              borderColor: c.textoSuave,
              backgroundColor: 'rgba(127, 107, 160, 0.15)',
              borderWidth: 2,
              pointBackgroundColor: c.textoSuave,
              pointRadius: 3
            },
            {
              label: 'Plan Potencia',
              data: [85, 70, 65, 75, 60, 55],
              borderColor: LILA,
              backgroundColor: 'rgba(182, 135, 224, 0.3)',
              borderWidth: 3,
              pointBackgroundColor: LILA,
              pointRadius: 4
            }
          ]
        },
        options: opcionesBase(c, {
          scales: {
            r: {
              min: 0,
              max: 100,
              angleLines: { color: c.linea },
              grid: { color: c.linea },
              pointLabels: { color: c.texto, font: { family: 'Archivo', weight: '700', size: 12 } },
              ticks: { display: false }
            }
          }
        })
      });
    }
  };

  /* ------------------------------------------------------------
     OPCIONES COMUNES (tipografía, leyendas y ejes)
     ------------------------------------------------------------ */
  function leyenda(c) {
    return {
      labels: {
        color: c.texto,
        font: { family: 'Archivo', weight: '700', size: 12 },
        usePointStyle: true,
        pointStyle: 'rectRounded',
        padding: 16
      }
    };
  }

  function ejes(c, tituloY) {
    return {
      x: {
        ticks: { color: c.textoSuave, font: { family: 'Archivo', weight: '600' } },
        grid: { display: false }
      },
      y: {
        ticks: { color: c.textoSuave, font: { family: 'Archivo' } },
        grid: { color: c.linea },
        title: { display: !!tituloY, text: tituloY || '', color: c.textoSuave, font: { family: 'Archivo', size: 11 } }
      }
    };
  }

  function opcionesBase(c, extra) {
    var base = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1100, easing: 'easeOutQuart' },
      plugins: { legend: leyenda(c) }
    };
    /* mezcla superficial de opciones extra */
    for (var clave in extra) {
      if (Object.prototype.hasOwnProperty.call(extra, clave)) {
        if (clave === 'plugins') {
          for (var sub in extra.plugins) {
            if (Object.prototype.hasOwnProperty.call(extra.plugins, sub)) {
              base.plugins[sub] = extra.plugins[sub];
            }
          }
        } else {
          base[clave] = extra[clave];
        }
      }
    }
    return base;
  }

  /* ------------------------------------------------------------
     CREACIÓN PEREZOSA + REPINTADO AL CAMBIAR EL TEMA
     ------------------------------------------------------------ */
  var instancias = {}; /* id del canvas -> instancia de Chart */
  var creados = {};    /* id del canvas -> true si ya se construyó */

  function crearGrafico(id) {
    var lienzo = document.getElementById(id);
    if (!lienzo || !fabricas[id]) { return; }

    /* Si Chart.js aún no cargó (respaldo CDN en camino), reintenta */
    if (typeof window.Chart === 'undefined') {
      reintentar(id);
      return;
    }

    if (instancias[id]) { instancias[id].destroy(); }
    instancias[id] = fabricas[id](lienzo, coloresDelTema());
    creados[id] = true;
  }

  var intentos = {};
  function reintentar(id) {
    intentos[id] = (intentos[id] || 0) + 1;
    if (intentos[id] > 25) {
      var contenedor = document.getElementById(id);
      if (contenedor && contenedor.parentElement) {
        contenedor.parentElement.innerHTML =
          '<p style="padding:20px;text-align:center;">⚠️ No se pudo cargar la librería de gráficos.</p>';
      }
      return;
    }
    setTimeout(function () { crearGrafico(id); }, 250);
  }

  var ids = ['graficoEmpleo', 'graficoEducacion', 'graficoTurismo', 'graficoDeportes'];

  if ('IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      for (var i = 0; i < entradas.length; i++) {
        if (entradas[i].isIntersecting) {
          crearGrafico(entradas[i].target.id);
          observador.unobserve(entradas[i].target);
        }
      }
    }, { threshold: 0.2 });

    for (var j = 0; j < ids.length; j++) {
      var lienzo = document.getElementById(ids[j]);
      if (lienzo) { observador.observe(lienzo); }
    }
  } else {
    /* Respaldo: crear todos de inmediato */
    for (var k = 0; k < ids.length; k++) { crearGrafico(ids[k]); }
  }

  /* Repintar con los colores nuevos cuando cambia el tema */
  if (PPPA.alCambiarTema) {
    PPPA.alCambiarTema(function () {
      for (var i = 0; i < ids.length; i++) {
        if (creados[ids[i]]) { crearGrafico(ids[i]); }
      }
    });
  }

})();
