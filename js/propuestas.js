/* ============================================================
   P.P.P.A. — propuestas.js
   Datos de los 12 ministerios y generación de las tarjetas
   con acordeón animado en la sección "Propuestas".
   (Propuestas tomadas de PROPUESTAS.txt)
   ============================================================ */
(function () {
  'use strict';

  var PPPA = window.PPPA || {};

  /* ------------------------------------------------------------
     1. DATOS: ministerios, descripciones y propuestas
     ------------------------------------------------------------ */
  var MINISTERIOS = [
    {
      icono: '💰',
      nombre: 'Economía',
      desc: 'Más empleo joven y más exportación tucumana.',
      propuestas: [
        'Beneficios impositivos para empresas que contraten jóvenes tucumanos.',
        'Créditos blandos para emprendedores y pequeños comercios.',
        'Apoyar a las industrias del limón, azúcar, arándanos y frutilla para aumentar exportaciones.'
      ]
    },
    {
      icono: '🎓',
      nombre: 'Educación, Trabajo y Desarrollo Social',
      desc: 'Aulas fuertes, oportunidades reales y nadie afuera.',
      propuestas: [
        'Más escuelas técnicas orientadas a programación, robótica y oficios.',
        'Pasantías para estudiantes de los últimos años de secundaria.',
        'Becas para estudiantes con buen rendimiento académico.',
        'Programas de apoyo escolar gratuitos en barrios vulnerables.'
      ]
    },
    {
      icono: '🏔️',
      nombre: 'Turismo',
      desc: 'Del cerro a las ruinas: Tucumán como destino imperdible.',
      propuestas: [
        'Promocionar más lugares como Tafí del Valle, San Javier y las Ruinas de Quilmes.',
        'Crear eventos culturales y gastronómicos durante todo el año.',
        'Mejorar la señalización y los accesos a los principales atractivos turísticos.',
        'Impulsar el turismo de aventura y el ecoturismo.'
      ]
    },
    {
      icono: '🏆',
      nombre: 'Deportes',
      desc: 'Clubes y escuelas con deporte para todas las edades.',
      propuestas: [
        'Construir y refaccionar polideportivos municipales.',
        'Entregar material deportivo a escuelas públicas.',
        'Crear una liga provincial escolar en varios deportes.',
        'Becas para deportistas destacados.',
        'Programa especial de desarrollo para hockey, fútbol, vóley y atletismo.'
      ]
    },
    {
      icono: '🌎',
      nombre: 'Relaciones Internacionales y Comercio',
      desc: 'Que el mundo conozca (y compre) lo que Tucumán produce.',
      propuestas: [
        'Buscar nuevos mercados para los productos tucumanos.',
        'Promover acuerdos con universidades extranjeras para intercambios estudiantiles.',
        'Participar en ferias internacionales para atraer inversiones.'
      ]
    },
    {
      icono: '🏘️',
      nombre: 'Interior',
      desc: 'Las mismas oportunidades en cada rincón de la provincia.',
      propuestas: [
        'Mejorar caminos y rutas en el interior de la provincia.',
        'Ampliar el acceso a internet en comunas rurales.',
        'Crear centros de atención ciudadana en pueblos alejados.'
      ]
    },
    {
      icono: '🏥',
      nombre: 'Salud',
      desc: 'Atención que llega antes y más cerca de cada barrio.',
      propuestas: [
        'Mejorar la infraestructura de los hospitales públicos.',
        'Más centros de atención primaria en barrios alejados.',
        'Campañas de prevención sobre diabetes, obesidad y salud mental.',
        'Sistema online para sacar turnos médicos.'
      ]
    },
    {
      icono: '🚨',
      nombre: 'Seguridad',
      desc: 'Prevención inteligente y respuesta rápida.',
      propuestas: [
        'Instalar más cámaras en zonas con altos índices de robos.',
        'Crear corredores seguros alrededor de las escuelas.',
        'Aumentar la capacitación policial en prevención del delito.',
        'Incorporar una aplicación para denuncias rápidas.'
      ]
    },
    {
      icono: '⚖️',
      nombre: 'Justicia',
      desc: 'Una justicia rápida, digital y al alcance de todos.',
      propuestas: [
        'Agilizar las causas judiciales mediante expedientes digitales.',
        'Crear oficinas de mediación para resolver conflictos sin llegar a juicio.',
        'Fortalecer la asistencia jurídica gratuita.'
      ]
    },
    {
      icono: '💻',
      nombre: 'Modernización del Estado',
      desc: 'Un Estado tan ágil como una app, sin colas ni papeles.',
      propuestas: [
        'Digitalizar todos los trámites provinciales.',
        'Reducir los tiempos de espera en hospitales y oficinas públicas mediante turnos online.',
        'Eliminar trámites repetidos e innecesarios.'
      ]
    },
    {
      icono: '🛡️',
      nombre: 'Defensa',
      desc: 'Enfocada en emergencias: es donde la provincia puede actuar.',
      propuestas: [
        'Equipar mejor a Defensa Civil.',
        'Crear planes de acción ante inundaciones y tormentas fuertes.',
        'Capacitar a escuelas y barrios para actuar ante emergencias.'
      ]
    },
    {
      icono: '🤝',
      nombre: 'Coordinación del Gobierno',
      desc: 'Un gobierno transparente que rinde cuentas todos los meses.',
      propuestas: [
        'Crear una aplicación provincial para seguir obras, reclamos y trámites.',
        'Publicar cada mes en internet en qué se gasta el dinero público.',
        'Unificar los trámites provinciales en una sola plataforma.'
      ]
    }
  ];

  /* ------------------------------------------------------------
     2. GENERACIÓN DE LAS TARJETAS EN EL DOM
     ------------------------------------------------------------ */
  var grilla = document.getElementById('grillaMinisterios');
  if (!grilla) { return; }

  MINISTERIOS.forEach(function (ministerio, indice) {
    var tarjeta = document.createElement('article');
    tarjeta.className = 'min-tarjeta';
    tarjeta.setAttribute('data-reveal', '');
    /* pequeño escalonado de aparición por columnas */
    tarjeta.style.setProperty('--d', ((indice % 3) * 0.08) + 's');

    var idPanel = 'min-panel-' + indice;
    var idBoton = 'min-boton-' + indice;

    var itemsLista = ministerio.propuestas.map(function (texto) {
      return '<li>' + texto + '</li>';
    }).join('');

    tarjeta.innerHTML =
      '<button class="min-cabecera" type="button" id="' + idBoton + '"' +
      ' aria-expanded="false" aria-controls="' + idPanel + '">' +
        '<span class="min-icono" aria-hidden="true">' + ministerio.icono + '</span>' +
        '<span class="min-info">' +
          '<h3 class="min-nombre">' + ministerio.nombre + '</h3>' +
          '<p class="min-desc">' + ministerio.desc + '</p>' +
        '</span>' +
        '<span class="min-flecha" aria-hidden="true">▾</span>' +
      '</button>' +
      '<div class="min-panel" id="' + idPanel + '" role="region" aria-labelledby="' + idBoton + '">' +
        '<ul class="min-lista">' + itemsLista + '</ul>' +
      '</div>';

    grilla.appendChild(tarjeta);

    /* Comportamiento del acordeón (abrir/cerrar con animación) */
    var boton = tarjeta.querySelector('.min-cabecera');
    var panel = tarjeta.querySelector('.min-panel');

    boton.addEventListener('click', function () {
      var abierta = tarjeta.classList.toggle('abierta');
      boton.setAttribute('aria-expanded', abierta ? 'true' : 'false');
      panel.style.maxHeight = abierta ? panel.scrollHeight + 'px' : '0px';
      if (PPPA.sonido) { PPPA.sonido.tocar(abierta ? 'abrir' : 'cerrar'); }
    });

    /* Registra la tarjeta en el observador de aparición */
    if (PPPA.registrarReveal) { PPPA.registrarReveal(tarjeta); }
  });

})();
