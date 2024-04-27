/**
	 --------------------------------
	|   INFORMACIÓN  DEL  PROYECTO   |
	 --------------------------------

    Creación de una aplicación Web 3D interactiva

	Autores:		+ 202054738 - JUAN MANUEL RODRIGUEZ SOTARRIBA
					+ 202044217 - MARVIN LOPEZ SANTIAGO
                    + 201513712 - DIWSGEN LOPEZ LOZADA

	Propósito:		1. Desarrollar una aplicación Web 3D que permita al usuario interactuar con contenido 3D.   
**/
import * as THREE from './build/three.module.js';

import Stats from './src/jsm/libs/stats.module.js';
import { GUI } from './src/jsm/libs/dat.gui.module.js';
import { OrbitControls } from './src/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './src/jsm/loaders/GLTFLoader.js';

let container, stats, clock, gui, mixer, actions1, activeAction, previousAction;
let camera, scene, renderer, model0, model;

// CONFIGURACIÓN DE PROPIEDAD Y VALOR INICIAL DEL CICLO DE ANIMACIÓN (CLIP)
// EL NOMBRE DE ESTA PROPIEDAD ('ciclo') ESTÁ VINCULADO CON EL NOMBRE A MOSTRAR EN EL MENÚ
// i.e. LO QUE SE MUESTRA EN EL MENÚ ES 'ciclo'. 	
const api = { ciclo: 'Caminar' };

const actions = {};


init();
animate();

function init() {
    // SE CREA UN CONTENEDOR Y SE VINCULA CON EL DOCUMENTO (HTML)
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // SE CREA Y CONFIGURA LA CÁMARA PRINCIPAL
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.25, 100 );
    camera.position.set( - 10, 3, 10 );
    camera.lookAt( new THREE.Vector3( 0, 2, 0 ) );

    // SE CREA LA ESCENA Y SE ASIGNA COLOR DE FONDO
    scene = new THREE.Scene();
    // SE CONFIGURA EL COLOR DE FONDO
    scene.background = new THREE.Color( 0x84b6f4 ); //e0e0e0
    // SE CONFIGURA LA NEBLINA
    //scene.fog = new THREE.Fog( 0x264d00, 10, 17 ); //0x90aede, 20, 100

    // SE CREA UN RELOJ
    clock = new THREE.Clock();


    // ------------------ LUCES ------------------

    // LUZ DIRECCIONAL
    const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    dirLight.position.set( 1, 20, 10 );
    scene.add( dirLight );

    // ------------------ ESCENARIO -----------------
    // Cargar el modelo del escenario
    const loaderEscenario = new GLTFLoader();

    loaderEscenario.load( './src/models/gltf/escenario.glb',
    function ( gltf ) {

        // Obtener el modelo del escenario del archivo GLTF (.glb)
        const modeloEscenario = gltf.scene;

        // Agregar el modelo del escenario a la escena principal
        scene.add( modeloEscenario );

    }, undefined, function ( e ) {

    // Mostrar información de error en caso de fallo en la carga
    console.error( e );
    } );


    // ------------------ MODELO 3D ------------------


    //------------------ Animaciones ------------------



    // PROCESO DE RENDERIZADO DE LA ESCENA
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    // CONFIGURACIÓN DE FUNCION CallBack EN CASO DE CAMBIO DE TAMAÑO DE LA VENTANA
    window.addEventListener( 'resize', onWindowResize, false );

    // CONTROL DE ORBITACIÓN CON EL MOUSE
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.target.set( 0, 2, 0 );
    controls.update();

    // ------------------ ESTADOS ------------------
    stats = new Stats();
    container.appendChild( stats.dom );

}



// FUNCIÓN PARA EL CONTROL DE TRANSICIONES ENTRE ANIMACIONES
function fadeToAction( name, duration ) {
    previousAction = activeAction;
    activeAction = actions[ name ];

    if ( previousAction !== activeAction ) {
        previousAction.fadeOut( duration );
    }

    activeAction
        .reset()
        .setEffectiveTimeScale( 1 )
        .setEffectiveWeight( 1 )
        .fadeIn( duration )
        .play();
}

// FUNCIÓN PARA EL REESCALADO DE VENTANA
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// PARA LA ANIMACIÓN - INVOCACIÓN RECURSIVA
function animate() {
    const dt = clock.getDelta();

    if ( mixer )
        mixer.update( dt );

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update();
}


// Definir una función para cambiar la animación
function cambiarAnimacion(nombreAnimacion) {
    // Cambiar la visibilidad de los modelos
    model0.visible = !model0.visible;

    // Detener todas las animaciones anteriores
    mixer.stopAllAction();

    // Reproducir la nueva animación
    const action = actions[nombreAnimacion];
    // Configurar la acción para que se ejecute solo una vez
    action.loop = THREE.LoopOnce;
    // Reproducir la animación
    action.play();

    // Temporizador para verificar si la animación ha terminado
    const duracionAnimacion = action.getClip().duration;
    const tiempoInicio = Date.now();

    function verificarFinalizacionAnimacion() {
        const tiempoActual = Date.now();
        const tiempoTranscurrido = tiempoActual - tiempoInicio;
        if (tiempoTranscurrido >= duracionAnimacion * 1000) {
            // La animación ha terminado
            model.visible = !model.visible;
            model0.visible = true;
        } else {
            // La animación todavía está en curso, seguir verificando
            requestAnimationFrame(verificarFinalizacionAnimacion);
        }
    }

    // Comenzar la verificación de finalización de la animación
    requestAnimationFrame(verificarFinalizacionAnimacion);
}


// Asignar un evento de teclado para la letra B
document.addEventListener('keydown', (event) => {
    if (event.key === 'b') {
        cambiarAnimacion('Silla'); // Cambiar la animación al presionar la tecla B
    }
});