/* ============================================================
   P.P.P.A. — juego.js
   Minijuego "Conviértete en Gobernador de Tucumán".
   El jugador enfrenta 8 situaciones; cada decisión modifica
   cuatro indicadores: Economía, Educación, Salud y Popularidad.
   Al final recibe un puntaje y una calificación de gestión.
   ============================================================ */
(function () {
  'use strict';

  var PPPA = window.PPPA || {};

  /* ------------------------------------------------------------
     1. DATOS DEL JUEGO: situaciones, opciones y efectos
     Claves de efectos: eco (economía), edu (educación),
     sal (salud), pop (popularidad).
     ------------------------------------------------------------ */
  var SITUACIONES = [
    {
      titulo: 'El primer presupuesto',
      texto: 'Arranca tu gestión y aparece una sorpresa: hay un excedente de $10.000 millones. Todos los ministros quieren ese dinero. ¿Qué hacés?',
      opciones: [
        {
          texto: 'Construir dos hospitales modulares en el interior',
          efectos: { eco: -8, edu: 0, sal: 15, pop: 6 },
          resultado: 'Las nuevas guardias descomprimen los hospitales de la capital. La inversión fue grande, pero la salud pública respira.'
        },
        {
          texto: 'Lanzar una ola de becas estudiantiles',
          efectos: { eco: -6, edu: 15, sal: 0, pop: 5 },
          resultado: 'Miles de estudiantes vuelven a las aulas con su beca Potencia. La deserción escolar baja por primera vez en años.'
        },
        {
          texto: 'Guardarlo en un fondo anticrisis',
          efectos: { eco: 10, edu: 0, sal: -2, pop: -7 },
          resultado: 'Las cuentas quedan blindadas, pero la oposición te apoda "el gobernador alcancía" y la gente esperaba obras.'
        }
      ]
    },
    {
      titulo: 'La fábrica internacional',
      texto: 'Una automotriz internacional quiere instalar su planta en Tucumán… pero exige 10 años sin pagar impuestos provinciales.',
      opciones: [
        {
          texto: 'Aceptar todas sus condiciones',
          efectos: { eco: 12, edu: 0, sal: 0, pop: -6 },
          resultado: 'La planta se instala y genera empleo, pero los comerciantes locales protestan: ellos sí pagan todos sus impuestos.'
        },
        {
          texto: 'Negociar: 5 años de beneficios a cambio de 80% de empleo tucumano',
          efectos: { eco: 8, edu: 2, sal: 0, pop: 6 },
          resultado: 'Acuerdo histórico: la fábrica llega, contrata gente de la provincia y hasta financia un centro de capacitación técnica.'
        },
        {
          texto: 'Rechazar la propuesta',
          efectos: { eco: -7, edu: 0, sal: 0, pop: 2 },
          resultado: 'La automotriz se instala en otra provincia. Algunos celebran tu firmeza, pero se pierden cientos de empleos potenciales.'
        }
      ]
    },
    {
      titulo: 'Paro docente',
      texto: 'Los gremios docentes anuncian un paro por tiempo indeterminado pidiendo un 30% de aumento. Las clases están en riesgo.',
      opciones: [
        {
          texto: 'Otorgar el 30% de aumento de inmediato',
          efectos: { eco: -10, edu: 12, sal: 0, pop: 4 },
          resultado: 'Las clases vuelven al día siguiente y los docentes celebran, pero el ministro de Economía no duerme: el gasto se disparó.'
        },
        {
          texto: 'Acordar un aumento escalonado más capacitación paga',
          efectos: { eco: -4, edu: 8, sal: 0, pop: 4 },
          resultado: 'Tras una semana de diálogo se firma el acuerdo: sueldos que suben por etapas y cursos pagos. Todos ceden un poco y ganan todos.'
        },
        {
          texto: 'Descontar los días de paro',
          efectos: { eco: 4, edu: -10, sal: 0, pop: -8 },
          resultado: 'El conflicto se endurece y el paro se extiende tres semanas. Los chicos pierden clases y tu imagen cae en picada.'
        }
      ]
    },
    {
      titulo: 'Brote de dengue',
      texto: 'Llega el verano y con él un brote de dengue en el Gran San Miguel de Tucumán. Los casos crecen día a día.',
      opciones: [
        {
          texto: 'Campaña masiva de fumigación y descacharreo',
          efectos: { eco: -5, edu: 0, sal: 12, pop: 4 },
          resultado: 'Brigadas casa por casa, fumigación y publicidad por todos lados. El brote se controla en cuatro semanas. Bien jugado.'
        },
        {
          texto: 'Minimizarlo: "es un brote como todos los años"',
          efectos: { eco: 0, edu: 0, sal: -15, pop: -10 },
          resultado: 'El brote se descontrola y los hospitales colapsan. Los noticieros nacionales hablan de la "crisis del dengue tucumana".'
        },
        {
          texto: 'Hospitales de campaña y telemedicina para atender rápido',
          efectos: { eco: -3, edu: 0, sal: 9, pop: 2 },
          resultado: 'La atención rápida evita lo peor y el sistema aguanta. Aprendiste que la próxima hay que prevenir antes del verano.'
        }
      ]
    },
    {
      titulo: 'La sede deportiva',
      texto: 'El Mundial Sub-20 de fútbol busca subsedes en Argentina. Postularse exige invertir en el estadio y en infraestructura deportiva.',
      opciones: [
        {
          texto: 'Invertir fuerte: estadio renovado y polideportivos nuevos',
          efectos: { eco: -8, edu: 0, sal: 4, pop: 12 },
          resultado: '¡Tucumán es subsede mundialista! La provincia sale en todos los canales y los chicos llenan los polideportivos nuevos.'
        },
        {
          texto: 'Postularse junto a Salta y compartir los costos',
          efectos: { eco: 2, edu: 0, sal: 2, pop: 6 },
          resultado: 'La candidatura conjunta del NOA gana la subsede gastando la mitad. Jugada inteligente: fútbol y cuentas en orden.'
        },
        {
          texto: 'No participar: es mucho gasto',
          efectos: { eco: 4, edu: 0, sal: 0, pop: -7 },
          resultado: 'El Mundial pasa de largo por Tucumán. Las cuentas agradecen, pero la gente no te lo perdona tan fácil.'
        }
      ]
    },
    {
      titulo: 'Sequía en el campo',
      texto: 'Una sequía histórica golpea a los cañeros y citricultores. El campo tucumano pide ayuda urgente.',
      opciones: [
        {
          texto: 'Subsidio directo e inmediato a los productores',
          efectos: { eco: -8, edu: 0, sal: 0, pop: 8 },
          resultado: 'El alivio llega rápido y el campo te lo reconoce, aunque el subsidio se evapora tan rápido como la lluvia que no cayó.'
        },
        {
          texto: 'Obras de riego y créditos blandos para tecnificar',
          efectos: { eco: 6, edu: 0, sal: 0, pop: 3 },
          resultado: 'Tarda más en notarse, pero el sistema de riego deja al campo preparado para la próxima sequía. Inversión inteligente.'
        },
        {
          texto: 'Que el mercado lo resuelva solo',
          efectos: { eco: -10, edu: 0, sal: 0, pop: -9 },
          resultado: 'Cientos de pequeños productores quiebran y la cosecha se pierde. El interior entero te da la espalda.'
        }
      ]
    },
    {
      titulo: 'El crédito internacional',
      texto: 'Un banco de desarrollo te ofrece un crédito gigante para obras. La plata tienta… pero la deuda hay que pagarla.',
      opciones: [
        {
          texto: 'Tomarlo completo: obras por todos lados',
          efectos: { eco: -9, edu: 4, sal: 4, pop: 8 },
          resultado: 'La provincia es un festival de obras y tu imagen vuela… hasta que llega el primer vencimiento de la deuda. Ay.'
        },
        {
          texto: 'Tomar la mitad, solo para escuelas y hospitales',
          efectos: { eco: -3, edu: 7, sal: 7, pop: 0 },
          resultado: 'Deuda manejable e inversión donde más rinde: aulas y salas de salud nuevas. Los economistas aplauden discretamente.'
        },
        {
          texto: 'Rechazarlo: cero deuda nueva',
          efectos: { eco: 5, edu: 0, sal: 0, pop: -4 },
          resultado: 'Tucumán se mantiene sin deuda nueva. Sólido, aunque varias obras esperadas quedan en la lista de promesas.'
        }
      ]
    },
    {
      titulo: 'El último año',
      texto: 'Se acerca el final del mandato y queda energía (y presupuesto) para un solo gran objetivo. ¿Dónde lo ponés?',
      opciones: [
        {
          texto: 'Gira mediática y publicidad de gestión',
          efectos: { eco: -3, edu: -3, sal: -3, pop: 10 },
          resultado: 'Tu cara está en cada pantalla de la provincia. La imagen sube… aunque algunos preguntan dónde quedaron las obras.'
        },
        {
          texto: 'Terminar todas las obras de salud y educación',
          efectos: { eco: 0, edu: 8, sal: 8, pop: 3 },
          resultado: 'Cortás cintas de escuelas y hospitales terminados. Sin fuegos artificiales, pero con resultados que quedan para siempre.'
        },
        {
          texto: 'Cerrar el mandato con superávit récord',
          efectos: { eco: 10, edu: 0, sal: 0, pop: -5 },
          resultado: 'Entregás las cuentas más ordenadas de la historia provincial. Los libros de economía te citarán; los votantes, no tanto.'
        }
      ]
    }
  ];

  /* Calificaciones finales según el puntaje promedio */
  var CALIFICACIONES = [
    {
      minimo: 75, emoji: '🏆', titulo: '¡Gobernador Excelente!',
      mensaje: 'Equilibraste economía, educación, salud y popularidad como un verdadero estadista. Tucumán es oficialmente la provincia potencia de la Argentina. ¡La historia te va a recordar!'
    },
    {
      minimo: 60, emoji: '🌟', titulo: 'Buen Gobernador',
      mensaje: 'Gestión sólida: la provincia avanzó y la gente lo nota. Te faltó un toque de audacia para entrar al podio de los grandes, pero te vas por la puerta ancha.'
    },
    {
      minimo: 45, emoji: '😐', titulo: 'Gobernador Promedio',
      mensaje: 'Sobreviviste al cargo: ni desastre ni maravilla. Tucumán sigue igual que como lo encontraste. La próxima vez, animate a decidir con más visión de largo plazo.'
    },
    {
      minimo: 0, emoji: '🔥', titulo: 'Gobernador en Crisis',
      mensaje: 'La provincia termina en crisis: indicadores por el piso y cacerolazos en la Plaza Independencia. Tranqui: gobernar es difícil… ¡tocá "Gobernar de nuevo" y demostrá que aprendiste!'
    }
  ];

  /* ------------------------------------------------------------
     2. REFERENCIAS AL DOM
     ------------------------------------------------------------ */
  var pantallaInicio = document.getElementById('juegoInicio');
  var pantallaJuego = document.getElementById('juegoPrincipal');
  var pantallaFinal = document.getElementById('juegoFinal');
  if (!pantallaInicio || !pantallaJuego || !pantallaFinal) { return; }

  var refs = {
    numero: document.getElementById('situacionNumero'),
    titulo: document.getElementById('situacionTitulo'),
    texto: document.getElementById('situacionTexto'),
    opciones: document.getElementById('situacionOpciones'),
    consecuencia: document.getElementById('panelConsecuencia'),
    consecuenciaTexto: document.getElementById('consecuenciaTexto'),
    consecuenciaEfectos: document.getElementById('consecuenciaEfectos'),
    botonSiguiente: document.getElementById('botonSiguiente'),
    finalEmoji: document.getElementById('finalEmoji'),
    finalTitulo: document.getElementById('finalTitulo'),
    finalPuntaje: document.getElementById('finalPuntaje'),
    finalBarras: document.getElementById('finalBarras'),
    finalMensaje: document.getElementById('finalMensaje')
  };

  /* Metadatos de cada indicador para pintar el tablero */
  var INDICADORES = {
    eco: { nombre: '💰 Economía',    barra: 'barraEco', valor: 'valorEco', color: 'var(--c-eco)' },
    edu: { nombre: '📚 Educación',   barra: 'barraEdu', valor: 'valorEdu', color: 'var(--c-edu)' },
    sal: { nombre: '🏥 Salud',       barra: 'barraSal', valor: 'valorSal', color: 'var(--c-sal)' },
    pop: { nombre: '⭐ Popularidad', barra: 'barraPop', valor: 'valorPop', color: 'var(--c-pop)' }
  };

  /* ------------------------------------------------------------
     3. ESTADO DEL JUEGO
     ------------------------------------------------------------ */
  var estado = { indice: 0, valores: { eco: 50, edu: 50, sal: 50, pop: 50 } };

  function limitar(valor) { return Math.max(0, Math.min(100, valor)); }

  /* Pinta el tablero de indicadores con animación de barras */
  function pintarTablero() {
    for (var clave in INDICADORES) {
      if (!Object.prototype.hasOwnProperty.call(INDICADORES, clave)) { continue; }
      var meta = INDICADORES[clave];
      var barra = document.getElementById(meta.barra);
      var texto = document.getElementById(meta.valor);
      var valor = estado.valores[clave];
      if (barra) {
        barra.style.width = valor + '%';
        /* Alerta visual si el indicador está crítico */
        var caja = barra.closest('.indicador');
        if (caja) { caja.classList.toggle('critico', valor <= 20); }
      }
      if (texto) { texto.textContent = String(valor); }
    }
  }

  /* ------------------------------------------------------------
     4. FLUJO DEL JUEGO
     ------------------------------------------------------------ */
  function mostrarSituacion() {
    var situacion = SITUACIONES[estado.indice];

    refs.numero.textContent = 'Situación ' + (estado.indice + 1) + ' de ' + SITUACIONES.length;
    refs.titulo.textContent = situacion.titulo;
    refs.texto.textContent = situacion.texto;

    /* Construye los botones de opciones (A, B, C…) */
    refs.opciones.innerHTML = '';
    var letras = ['A', 'B', 'C', 'D'];
    situacion.opciones.forEach(function (opcion, indice) {
      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'boton-opcion';

      var letra = document.createElement('span');
      letra.className = 'opcion-letra';
      letra.textContent = letras[indice];

      var contenido = document.createElement('span');
      contenido.textContent = opcion.texto;

      boton.appendChild(letra);
      boton.appendChild(contenido);
      boton.addEventListener('click', function () { elegirOpcion(opcion); });
      refs.opciones.appendChild(boton);
    });

    refs.opciones.classList.remove('oculto');
    refs.consecuencia.classList.add('oculto');
  }

  function elegirOpcion(opcion) {
    /* 1) Aplica los efectos de la decisión */
    var suma = 0;
    for (var clave in opcion.efectos) {
      if (!Object.prototype.hasOwnProperty.call(opcion.efectos, clave)) { continue; }
      estado.valores[clave] = limitar(estado.valores[clave] + opcion.efectos[clave]);
      suma += opcion.efectos[clave];
    }
    pintarTablero();

    /* 2) Sonido según el saldo de la decisión */
    if (PPPA.sonido) { PPPA.sonido.tocar(suma >= 0 ? 'bueno' : 'malo'); }

    /* 3) Muestra la consecuencia con fichas de efectos */
    refs.consecuenciaTexto.textContent = opcion.resultado;
    refs.consecuenciaEfectos.innerHTML = '';
    var retardo = 0;
    for (var c in INDICADORES) {
      if (!Object.prototype.hasOwnProperty.call(INDICADORES, c)) { continue; }
      var delta = opcion.efectos[c] || 0;
      if (delta === 0) { continue; }
      var ficha = document.createElement('span');
      ficha.className = 'efecto ' + (delta > 0 ? 'efecto-pos' : 'efecto-neg');
      ficha.style.setProperty('--d', (retardo * 0.1) + 's');
      ficha.textContent = INDICADORES[c].nombre + ' ' + (delta > 0 ? '+' : '') + delta;
      refs.consecuenciaEfectos.appendChild(ficha);
      retardo++;
    }

    refs.opciones.classList.add('oculto');
    refs.consecuencia.classList.remove('oculto');
    refs.botonSiguiente.textContent = (estado.indice === SITUACIONES.length - 1)
      ? 'Ver resultado final 🏁'
      : 'Siguiente situación →';
  }

  function avanzar() {
    estado.indice++;
    if (estado.indice >= SITUACIONES.length) {
      mostrarFinal();
    } else {
      mostrarSituacion();
      /* Mantiene el tablero a la vista en pantallas chicas */
      pantallaJuego.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* ------------------------------------------------------------
     5. PANTALLA FINAL: puntaje, calificación y confeti
     ------------------------------------------------------------ */
  function mostrarFinal() {
    var v = estado.valores;
    var promedio = Math.round((v.eco + v.edu + v.sal + v.pop) / 4);

    var calificacion = CALIFICACIONES[CALIFICACIONES.length - 1];
    for (var i = 0; i < CALIFICACIONES.length; i++) {
      if (promedio >= CALIFICACIONES[i].minimo) { calificacion = CALIFICACIONES[i]; break; }
    }

    refs.finalEmoji.textContent = calificacion.emoji;
    refs.finalTitulo.textContent = calificacion.titulo;
    refs.finalPuntaje.textContent = String(promedio);
    refs.finalMensaje.textContent = calificacion.mensaje;

    /* Barras finales por indicador */
    refs.finalBarras.innerHTML = '';
    for (var clave in INDICADORES) {
      if (!Object.prototype.hasOwnProperty.call(INDICADORES, clave)) { continue; }
      var meta = INDICADORES[clave];

      var fila = document.createElement('div');
      fila.className = 'final-barra';

      var etiqueta = document.createElement('span');
      etiqueta.className = 'final-barra-etiqueta';
      etiqueta.textContent = meta.nombre;

      var pista = document.createElement('div');
      pista.className = 'final-barra-pista';
      var relleno = document.createElement('div');
      relleno.className = 'final-barra-relleno';
      relleno.style.background = meta.color;
      relleno.setAttribute('data-ancho', v[clave] + '%');
      pista.appendChild(relleno);

      var numero = document.createElement('span');
      numero.className = 'final-barra-valor';
      numero.textContent = String(v[clave]);

      fila.appendChild(etiqueta);
      fila.appendChild(pista);
      fila.appendChild(numero);
      refs.finalBarras.appendChild(fila);
    }

    pantallaJuego.classList.add('oculto');
    pantallaFinal.classList.remove('oculto');

    /* Anima las barras un instante después de mostrarse */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var rellenos = refs.finalBarras.querySelectorAll('.final-barra-relleno');
        for (var j = 0; j < rellenos.length; j++) {
          rellenos[j].style.width = rellenos[j].getAttribute('data-ancho');
        }
      });
    });

    if (promedio >= 60) {
      if (PPPA.sonido) { PPPA.sonido.tocar('ganar'); }
      lanzarConfeti();
    } else if (PPPA.sonido) {
      PPPA.sonido.tocar('malo');
    }
  }

  /* ------------------------------------------------------------
     6. CONFETI (canvas propio, sin librerías)
     ------------------------------------------------------------ */
  function lanzarConfeti() {
    var lienzo = document.getElementById('lienzoConfeti');
    if (!lienzo) { return; }
    var seccion = lienzo.parentElement;
    lienzo.width = seccion.clientWidth;
    lienzo.height = seccion.clientHeight;

    var ctx = lienzo.getContext('2d');
    var colores = ['#B687E0', '#AC8A3E', '#D4B468', '#FFFFFF', '#8A5BC4'];
    var piezas = [];
    for (var i = 0; i < 170; i++) {
      piezas.push({
        x: Math.random() * lienzo.width,
        y: -20 - Math.random() * lienzo.height * 0.4,
        ancho: 6 + Math.random() * 7,
        alto: 8 + Math.random() * 9,
        color: colores[Math.floor(Math.random() * colores.length)],
        velocidad: 2.2 + Math.random() * 3.4,
        vaiven: Math.random() * Math.PI * 2,
        giro: Math.random() * Math.PI
      });
    }

    var inicio = null;
    var DURACION = 4200; /* milisegundos de lluvia de confeti */

    function cuadro(marca) {
      if (!inicio) { inicio = marca; }
      var transcurrido = marca - inicio;
      ctx.clearRect(0, 0, lienzo.width, lienzo.height);

      for (var j = 0; j < piezas.length; j++) {
        var p = piezas[j];
        p.y += p.velocidad;
        p.x += Math.sin(p.vaiven + transcurrido / 300) * 1.4;
        p.giro += 0.06;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.giro);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.ancho / 2, -p.alto / 2, p.ancho, p.alto * Math.abs(Math.cos(p.giro)));
        ctx.restore();
      }

      if (transcurrido < DURACION) {
        requestAnimationFrame(cuadro);
      } else {
        ctx.clearRect(0, 0, lienzo.width, lienzo.height);
      }
    }
    requestAnimationFrame(cuadro);
  }

  /* ------------------------------------------------------------
     7. CONTROLES PRINCIPALES
     ------------------------------------------------------------ */
  function reiniciar() {
    estado.indice = 0;
    estado.valores = { eco: 50, edu: 50, sal: 50, pop: 50 };
    pintarTablero();
    pantallaInicio.classList.add('oculto');
    pantallaFinal.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    mostrarSituacion();
  }

  document.getElementById('botonComenzar').addEventListener('click', function () {
    if (PPPA.sonido) { PPPA.sonido.tocar('abrir'); }
    reiniciar();
  });

  refs.botonSiguiente.addEventListener('click', function () {
    if (PPPA.sonido) { PPPA.sonido.tocar('click'); }
    avanzar();
  });

  document.getElementById('botonReiniciar').addEventListener('click', function () {
    if (PPPA.sonido) { PPPA.sonido.tocar('click'); }
    reiniciar();
    pantallaJuego.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

})();
