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

let container, stats, clock, gui, previousAction;
let camera, scene, renderer;
// Alien
let model, actions, activeAction, mixer;
// Alien Extra 1
let modelExtra1, actionsExtra1, activeAction1, mixerExtra1;
// Alien Extra 2
let modelExtra2, actionsExtra2, activeAction2, mixerExtra2;
// Alien Extra 3
let modelExtra3, actionsExtra3, activeAction3, mixerExtra3;

// Sonido
let audio, audio1, audio2,  audio3, audio4, audio5;

const playButton = document.getElementById('playButton');

const cantidad_de_particulas = 2000;

// CONFIGURACIÓN DE PROPIEDAD Y VALOR INICIAL DEL CICLO DE ANIMACIÓN (CLIP)
// EL NOMBRE DE ESTA PROPIEDAD ('ciclo') ESTÁ VINCULADO CON EL NOMBRE A MOSTRAR EN EL MENÚ
// i.e. LO QUE SE MUESTRA EN EL MENÚ ES 'ciclo'. 	
const api = { ciclo: 'caminar' };

let directionalLight1, directionalLight2, directionalLight3;
let time = 0;
let bandera = false;


// ------------------ INICIALIZACIÓN ------------------


init();
animate();

function init() {
    // SE CREA UN CONTENEDOR Y SE VINCULA CON EL DOCUMENTO (HTML)
    container = document.createElement('div');
    document.body.appendChild(container);

    // SE CREA Y CONFIGURA LA CÁMARA PRINCIPAL
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.25, 100);
    camera.position.set(- 10, 3, 10);
    camera.lookAt(new THREE.Vector3(0, 2, 0));

    // SE CREA LA ESCENA Y SE ASIGNA COLOR DE FONDO
    scene = new THREE.Scene();
    // SE CONFIGURA EL COLOR DE FONDO
    scene.background = new THREE.Color(0x000000); //e0e0e0

    // SE CONFIGURA LA NEBLINA
    scene.fog = new THREE.Fog(0xCBCBCB, 0, 200); //0x90aede, 20, 100

    // SE CREA UN RELOJ
    clock = new THREE.Clock();

    // ------------------ SONIDO Ambiente ------------------

    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    camera.add(listener); // Agregar el listener al objeto de la cámara para que siga al usuario

    audioLoader.load('./src/sounds/ambient.mp3', function (buffer) {
        audio = new THREE.Audio(listener);
        audio.setBuffer(buffer);
        audio.setLoop(true); // Repetir la reproducción
        audio.setVolume(0.9); // Volumen (de 0 a 1)
        audio.add(listener);
    });

    // --------------------------------- Bailes Sonido ---------------------------------------

    const audioLoader1 = new THREE.AudioLoader();
    const listener1 = new THREE.AudioListener();
    camera.add(listener1); // Agregar el listener al objeto de la cámara para que siga al usuario

    audioLoader1.load('./src/sounds/breakdance.mp3', function (buffer) {
        audio1 = new THREE.Audio(listener1);
        audio1.setBuffer(buffer);
        audio1.setLoop(true); // Repetir la reproducción
        audio1.setVolume(0); // Volumen (de 0 a 1)
        audio1.add(listener1);
    });

    const audioLoader2 = new THREE.AudioLoader();
    const listener2 = new THREE.AudioListener();
    camera.add(listener2); // Agregar el listener al objeto de la cámara para que siga al usuario

    audioLoader2.load('./src/sounds/twerk.mp3', function (buffer) {
        audio2 = new THREE.Audio(listener2);
        audio2.setBuffer(buffer);
        audio2.setLoop(false); // Repetir la reproducción
        audio2.setVolume(0); // Volumen (de 0 a 1)
        audio2.add(listener2);
    });

    const audioLoader3 = new THREE.AudioLoader();
    const listener3 = new THREE.AudioListener();
    camera.add(listener3); // Agregar el listener al objeto de la cámara para que siga al usuario

    audioLoader3.load('./src/sounds/hiphopmove.mp3', function (buffer) {
        audio3 = new THREE.Audio(listener3);
        audio3.setBuffer(buffer);
        audio3.setLoop(true); // Repetir la reproducción
        audio3.setVolume(0); // Volumen (de 0 a 1)
        audio3.add(listener3);
    });

    const audioLoader4 = new THREE.AudioLoader();
    const listener4 = new THREE.AudioListener();
    camera.add(listener4); // Agregar el listener al objeto de la cámara para que siga al usuario

    audioLoader4.load('./src/sounds/satisfaction.mp3', function (buffer) {
        audio4 = new THREE.Audio(listener4);
        audio4.setBuffer(buffer);
        audio4.setLoop(true); // Repetir la reproducción
        audio4.setVolume(0); // Volumen (de 0 a 1)
        audio4.add(listener4);
    });

    const audioLoader5 = new THREE.AudioLoader();
    const listener5 = new THREE.AudioListener();
    camera.add(listener5); // Agregar el listener al objeto de la cámara para que siga al usuario

    audioLoader5.load('./src/sounds/rumba.mp3', function (buffer) {
        audio5 = new THREE.Audio(listener5);
        audio5.setBuffer(buffer);
        audio5.setLoop(true); // Repetir la reproducción
        audio5.setVolume(0); // Volumen (de 0 a 1)
        audio5.add(listener5);
    });


    // ------------------ LUCES ------------------

    // LUZ DIRECCIONAL
    directionalLight1 = new THREE.HemisphereLight(0xff0000, 0xff0000, 1); // Rojo
    directionalLight2 = new THREE.HemisphereLight(0x00ff00, 0x00ff00, 1); // Verde
    directionalLight3 = new THREE.HemisphereLight(0x0000ff, 0x0000ff, 1); // Azul

    scene.add(directionalLight1, directionalLight2, directionalLight3);



    const dirLight5 = new THREE.DirectionalLight(0xFDFF00, 0.5);
    dirLight5.position.set(5, 5, 28);
    scene.add(dirLight5);

    // LUZ PUNTUAL
    const spotLight = new THREE.SpotLight(0xFDFF00, 10);
    spotLight.position.set(5, 7, 28);
    spotLight.target.position.set(5, 0, 28); // Define el objetivo de la luz

    scene.add(spotLight);
    scene.add(spotLight.target);

    const spotLight2 = new THREE.SpotLight(0xFDFF00, 10);
    spotLight2.position.set(5, 0, 28);
    spotLight2.target.position.set(6, 10, 29); // Define el objetivo de la luz

    scene.add(spotLight2);
    scene.add(spotLight2.target);


    // LUZ HEMISFÉRICA
    const hemisphereLight = new THREE.HemisphereLight(0xFDFF00, 0xFDFF00, 0.03);
    scene.add(hemisphereLight);


    // ------------------ PARTÍCULAS ------------------
    // Crear una geometría para las partículas
    const particlesGeometry = new THREE.BufferGeometry();
    // Define las posiciones de las partículas
    const positions = [];
    const rango = 100;
    // Llenar el arreglo con posiciones aleatorias para las partículas fuera del rango central
    for (let i = 0; i < cantidad_de_particulas; i++) {
        let x, y, z;
        do {
            // Generar posiciones aleatorias dentro del rango
            x = Math.random() * rango * 2 - rango;
            y = Math.random() * rango * 2 - rango;
            z = Math.random() * rango * 2 - rango;
        } while (x >= -50 && x <= 50 && y >= -50 && y <= 50 && z >= -50 && z <= 50); // Omitir el área de -50 a 50 en cada eje

        positions.push(x, y, z);
    }
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    // Crear un material para las partículas
    const particlesMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    // Crear el objeto de partículas y agregarlo a la escena
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // ------------------ ESCENARIO -----------------
    // Cargar el modelo del escenario
    const loaderEscenario = new GLTFLoader();

    loaderEscenario.load('./src/models/gltf/Escenario.glb',
        function (gltf) {

            // Obtener el modelo del escenario del archivo GLTF (.glb)
            const modeloEscenario = gltf.scene;

            // Agregar el modelo del escenario a la escena principal
            scene.add(modeloEscenario);

        }, undefined, function (e) {

            // Mostrar información de error en caso de fallo en la carga
            console.error(e);
        });


    // ------------------ PISO ------------------
    // CREACIPON DE LA MALLA PARA EL PSIO
    //const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1000, 1000 ), 
    // MATERIAL (color)
    //    new THREE.MeshBasicMaterial( { color: 0x693414, depthWrite: false } ) );

    // const textureLoader = new THREE.TextureLoader();
    // const texture = textureLoader.load('./src/textura/piso.jpg');

    // // Crear el plano con la textura
    // const planeGeometry = new THREE.PlaneBufferGeometry(500, 500); // Dimensiones del plano
    // const planeMaterial = new THREE.MeshBasicMaterial({ map: texture }); // Material con la textura
    // planeMaterial.emissive = new THREE.Color(0x000000); // Color negro
    // // O
    // planeMaterial.emissive = null; // Valor nulo (sin efecto emissive)


    // // Escalar la textura (repetirla 2 veces en el eje x y 3 veces en el eje y)
    // planeMaterial.map.repeat.set(250, 250);
    // planeMaterial.map.wrapS = THREE.RepeatWrapping; // Envolver la textura horizontalmente
    // planeMaterial.map.wrapT = THREE.RepeatWrapping; // Envolver la textura verticalmente


    // const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    // mesh.rotation.x = - Math.PI / 2;
    // mesh.position.y = -3; // Posicionar el plano debajo de los personajes
    // scene.add(mesh);

    // CREACIÓN DE CUADRICULA "GUÍA"
    //const grid = new THREE.GridHelper( 15, 4, 0xff0000, 0x000000 );
    // OPACIDAD DE LAS LÍNEAS (lo opuesto a transparencia)
    //		0.0 = transparente
    //		1.0 = sin transparencia
    //grid.material.opacity = 0.2;
    //grid.material.transparent = true;
    //scene.add( grid );


    // ------------------ MODELO 3D ------------------

    const loader = new GLTFLoader();
    loader.load('./src/models/gltf/Alien_animated.glb', function (gltf) {
        // SE OBTIENE EL MODELO (scene) DEL ARCHIVO GLTF (.GLB)
        model = gltf.scene;

        const animations = gltf.animations;
        // SE AGREGA A LA ESCENA PRINCIPAL
        scene.add(model);

        // Imprimir los nombres de los clips de animación
        animations.forEach((clip, index) => {
            console.log(`Clip ${index + 1}: ${clip.name}`);
        });

        // CREACIÓN DE LA INTERFAZ GRÁFICA
        createGUI(model, gltf.animations);

    }, undefined, function (e) {
        // SE MUESTRA INFORMACIÓN DE ERROR
        console.error(e);
    });

    // ------------------ Alien Extra 1 ------------------

    const loader1 = new GLTFLoader();
    loader1.load('./src/models/gltf/Roblox.glb', function (gltf) {
        // SE OBTIENE EL MODELO (scene) DEL ARCHIVO GLTF (.GLB)
        modelExtra1 = gltf.scene;

        // SE OBTIENEN LAS ANIMACIONES DEL ARCHIVO GLTF (.GLB)
        const animations1 = gltf.animations;

        // INSTANCIACIÓN DEL OBJETO QUE CONTROLA LA TRANSICIÓN (MEZCLA) ENTRE CLIPS DE ANIMACIÓN
        mixerExtra1 = new THREE.AnimationMixer(modelExtra1);

        // ARREGLO VACÍO PARA LOS "CLIPS" DE ANIMACIÓN
        actionsExtra1 = {};

        // Cambiar la posición del personaje
        modelExtra1.position.set(20, 0, -10); // Cambia x, y, z según tus necesidades

        // Cambiar la rotación del personaje
        modelExtra1.rotation.y = Math.PI / -2;

        // SE AGREGA A LA ESCENA PRINCIPAL
        scene.add(modelExtra1);

        // Imprimir los nombres de los clips de animación
        animations1.forEach((clip, index) => {
            console.log(`Clip ${index + 1}: ${clip.name}`);
        });

        // Crear las acciones de animación y configurarlas
        animations1.forEach((clip) => {
            const action1 = mixerExtra1.clipAction(clip);
            action1.clampWhenFinished = true;
            action1.loop = THREE.LoopRepeat;
            actionsExtra1[clip.name] = action1;
        });

        // ------------------ CICLOS ------------------
        // SE CONFIGURA EL MENÚ PARA SELECCIÓN DE CICLOS
        //const ciclosFolder = gui.addFolder( 'Ciclos de Animación PJ2 ' );
        // SE CONFIGURA SUB-MENÚ (LISTA DESPLEGABLE)
        //const clipCtrl = ciclosFolder.add( api, 'ciclo' ).options( ciclos );

        // SE DEFINE FUNCIÓN TIPO CallBack, EJECUTABLE CADA QUE SE SELECCIONE UNA OPCIÓN DEL MENÚ DESPLEGABLE
        //clipCtrl.onChange( function () {
        //    console.log('Se seleccionó la opción "'+api.ciclo+'""');
        // SEGÚN EL CICLO SELECCIONADO, SE USA SU NOMBRE Y UN VALOR NUMÉRICO (duración)
        //    fadeToAction( api.ciclo, 0.5 );
        //} );

        // SE CREA MENÚ
        //ciclosFolder.open();

        // SE DEFINE CICLO DE ANIMACIÓN INICIAL
        activeAction1 = actionsExtra1['Roblox'];
        activeAction1.play();

    }, undefined, function (e) {
        // SE MUESTRA INFORMACIÓN DE ERROR
        console.error(e);
    });


    // ------------------ Alien Extra 2 ------------------

    const loader2 = new GLTFLoader();
    loader2.load('./src/models/gltf/Nave.glb', function (gltf) {
        // SE OBTIENE EL MODELO (scene) DEL ARCHIVO GLTF (.GLB)
        modelExtra2 = gltf.scene;

        // SE OBTIENEN LAS ANIMACIONES DEL ARCHIVO GLTF (.GLB)
        const animations2 = gltf.animations;

        // INSTANCIACIÓN DEL OBJETO QUE CONTROLA LA TRANSICIÓN (MEZCLA) ENTRE CLIPS DE ANIMACIÓN
        mixerExtra2 = new THREE.AnimationMixer(modelExtra2);

        // ARREGLO VACÍO PARA LOS "CLIPS" DE ANIMACIÓN
        actionsExtra2 = {};

        // Cambiar la posición del personaje
        modelExtra2.position.set(-20, 4, 0); // Cambia x, y, z según tus necesidades

        // Cambiar la rotación del personaje
        modelExtra2.rotation.y = Math.PI / 2;

        // SE AGREGA A LA ESCENA PRINCIPAL
        scene.add(modelExtra2);

        // Imprimir los nombres de los clips de animación
        animations2.forEach((clip, index) => {
            console.log(`Clip ${index + 1}: ${clip.name}`);
        });

        // Crear las acciones de animación y configurarlas
        animations2.forEach((clip) => {
            const action2 = mixerExtra2.clipAction(clip);
            action2.clampWhenFinished = true;
            action2.loop = THREE.LoopRepeat;
            actionsExtra2[clip.name] = action2;
        });

        // SE DEFINE CICLO DE ANIMACIÓN INICIAL
        activeAction2 = actionsExtra2['Animation'];
        activeAction2.play();

    }, undefined, function (e) {
        // SE MUESTRA INFORMACIÓN DE ERROR
        console.error(e);
    });


    // ------------------ Alien Extra 3 ------------------

    const loader3 = new GLTFLoader();
    loader3.load('./src/models/gltf/Alien_Silla.glb', function (gltf) {
        // SE OBTIENE EL MODELO (scene) DEL ARCHIVO GLTF (.GLB)
        modelExtra3 = gltf.scene;

        // SE OBTIENEN LAS ANIMACIONES DEL ARCHIVO GLTF (.GLB)
        const animations3 = gltf.animations;

        // INSTANCIACIÓN DEL OBJETO QUE CONTROLA LA TRANSICIÓN (MEZCLA) ENTRE CLIPS DE ANIMACIÓN
        mixerExtra3 = new THREE.AnimationMixer(modelExtra3);

        // ARREGLO VACÍO PARA LOS "CLIPS" DE ANIMACIÓN
        actionsExtra3 = {};

        // Cambiar la posición del personaje
        modelExtra3.position.set(24, 0, 15); // Cambia x, y, z según tus necesidades

        // Cambiar la rotación del personaje
        modelExtra3.rotation.y = Math.PI / 2;

        // SE AGREGA A LA ESCENA PRINCIPAL
        scene.add(modelExtra3);

        // Imprimir los nombres de los clips de animación
        animations3.forEach((clip, index) => {
            console.log(`Clip ${index + 1}: ${clip.name}`);
        });

        // Crear las acciones de ani)ción y configurarlas
        animations3.forEach((clip) => {
            const action3 = mixerExtra3.clipAction(clip);
            action3.clampWhenFinished = true;
            action3.loop = THREE.LoopOnce;
            actionsExtra3[clip.name] = action3;
        });

        // SE DEFINE CICLO DE ANIMACIÓN INICIAL
        activeAction3 = actionsExtra3['Sentarse'];
        activeAction3.play();

    }, undefined, function (e) {
        // SE MUESTRA INFORMACIÓN DE ERROR
        console.error(e);
    });

    // ------------------ Renderizado --------------------


    // PROCESO DE RENDERIZADO DE LA ESCENA
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // CONFIGURACIÓN DE FUNCION CallBack EN CASO DE CAMBIO DE TAMAÑO DE LA VENTANA
    window.addEventListener('resize', onWindowResize, false);

    // CONTROL DE ORBITACIÓN CON EL MOUSE
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.target.set(0, 2, 0);
    controls.update();

    // ------------------ ESTADOS ------------------
    stats = new Stats();
    container.appendChild(stats.dom);

}

function createGUI(model, animations) {
    // OPCIONES (CONSTANTES) PARA MENÚ DE CICLOS
    const ciclos = ['caminar', 'breakdance', 'rumba', 'hiphopdance', 'hiphopmove'];
    // OPCIONES (CONSTANTES) PARA MENÚ DE CAPTURAS DE MOVIMIENTO
    const capturas = ['defeated', 'lookaround', 'nervouslookaround', 'jumping', 'twerk'];

    // INSTANCIACIÓN DEL OBJETO QUE CREA LA INTERFAZ
    gui = new GUI();
    // INSTANCIACIÓN DEL OBJETO QUE CONTROLA LA TRANSICIÓN (MEZCLA) ENTRE CLIPS DE ANIMACIÓN
    mixer = new THREE.AnimationMixer(model);


    // ARREGLO VACÍO PARA LOS "CLIPS" DE ANIMACIÓN
    actions = {};

    // SE VISUALIZA EN CONSOLA LOS NOMBRES DE LAS ANIMACIONES
    console.log('Lista de animaciones: ');
    console.log(animations);

    // RECORRIDO DEL ARREGLO DE ANIMACIONES PASADO COMO PARÁMETRO
    for (let i = 0; i < animations.length; i++) {
        // TRANSFORMACIÓN DE ANIMACIONES A "CLIPS"
        const clip = animations[i];
        const action = mixer.clipAction(clip);
        actions[clip.name] = action;

        // SE CONFIGURAN LOS CLIPS QUE << NO >> REALIZARÁN UN LOOP INFINITO QUE SON:
        //
        // 	1. Todos aquellos cuyos nombres aparecen en el arreglo "capturas"
        // 		--> capturas.indexOf( clip.name ) >= 0
        //
        //	2. Sólo 'Death', 'Sitting' y 'Standing' del arreglo ciclos
        // 		--> ciclos.indexOf( clip.name ) >= 4
        //
        if (capturas.indexOf(clip.name) >= 0 || ciclos.indexOf(clip.name) >= 5) {
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
        }
    }

    // ------------------ CICLOS ------------------
    // SE CONFIGURA EL MENÚ PARA SELECCIÓN DE CICLOS
    const ciclosFolder = gui.addFolder('Ciclos de Animación');
    // SE CONFIGURA SUB-MENÚ (LISTA DESPLEGABLE)
    const clipCtrl = ciclosFolder.add(api, 'ciclo').options(ciclos);

    // SE DEFINE FUNCIÓN TIPO CallBack, EJECUTABLE CADA QUE SE SELECCIONE UNA OPCIÓN DEL MENÚ DESPLEGABLE
    clipCtrl.onChange(function () {
        console.log('Se seleccionó la opción "' + api.ciclo + '""');
        // SEGÚN EL CICLO SELECCIONADO, SE USA SU NOMBRE Y UN VALOR NUMÉRICO (duración)
        fadeToAction(api.ciclo, 0.5);

        bandera = false;

        // Seleccionar el audio según el ciclo
        if (api.ciclo == 'breakdance') {
            // Intentar reproducir el audio automáticamente
            audio1.play();
            if (audio2 !== undefined || audio3 !== undefined || audio4 !== undefined || audio5 !== undefined) {
                if (audio2.isPlaying) {
                    audio2.stop();
                }
                if (audio3.isPlaying) {
                    audio3.stop();
                }
                if (audio4.isPlaying) {
                    audio4.stop();
                }
                if (audio5.isPlaying) {
                    audio5.stop();
                }
            }
        } else if (api.ciclo == 'hiphopmove') {
            // Pausar la reproducción si no se selecciona 'hiphopmove'
            audio3.play();
            if (audio1 !== undefined || audio2 !== undefined || audio4 !== undefined || audio5 !== undefined) {
                if (audio1.isPlaying) {
                    audio1.stop();
                }
                if (audio2.isPlaying) {
                    audio2.stop();
                }
                if (audio4.isPlaying) {
                    audio4.stop();
                }
                if (audio5.isPlaying) {
                    audio5.stop();
                }
            }
        }else if (api.ciclo == 'hiphopdance') {
            // Pausar la reproducción si no se selecciona 'hiphopdance'
            bandera = true;
            audio4.play();
            if (audio1 !== undefined || audio2 !== undefined || audio3 !== undefined || audio5 !== undefined) {
                if (audio1.isPlaying) {
                    audio1.stop();
                }
                if (audio2.isPlaying) {
                    audio2.stop();
                }
                if (audio3.isPlaying) {
                    audio3.stop();
                }
                if (audio5.isPlaying) {
                    audio5.stop();
                }
            }
        } else if (api.ciclo == 'rumba') {
            // Pausar la reproducción si no se selecciona 'rumba'
            audio5.play();
            if (audio1 !== undefined || audio2 !== undefined || audio3 !== undefined || audio4 !== undefined) {
                if (audio1.isPlaying) {
                    audio1.stop();
                }
                if (audio2.isPlaying) {
                    audio2.stop();
                }
                if (audio3.isPlaying) {
                    audio3.stop();
                }
                if (audio4.isPlaying) {
                    audio4.stop();
                }
            }
        } else {
            if (audio1 !== undefined || audio2 !== undefined || audio3 !== undefined) {
                if (audio1.isPlaying) {
                    audio1.stop();
                }
                if (audio2.isPlaying) {
                    audio2.stop();
                }
                if (audio3.isPlaying) {
                    audio3.stop();
                }
                if (audio4.isPlaying) {
                    audio4.stop();
                }
                if (audio5.isPlaying) {
                    audio5.stop();
                }
            }
        }
    });

    // SE CREA MENÚ
    ciclosFolder.open();

    // ------------------ CAPTURAS ------------------
    // SE CONFIGURA EL MENÚ PARA SELECCIÓN DE CAPTURAS
    const capturaFolder = gui.addFolder('Captura de Movimiento');

    // SE DEFINE FUNCIÓN TIPO CallBack, EJECUTABLE CADA QUE SE SELECCIONE UNA OPCIÓN DEL MENÚ
    function crearCapturaCallback(name) {
        api[name] = function () {
            console.log('se dio clic sobre la opción "' + name + '""');
            // SE ACTIVA LA ANIMACIÓN DE LA CAPTURA DE MOVIMIENTO, CON UNA TRANSICIÓN DE 0.2 SEGUNDOS
            fadeToAction(name, 0.2);
            // SE ESPECIFICA LA FUNCIÓN CallBack QUE REGRESA AL ESTADO PREVIO (ciclo de animación) 
            mixer.addEventListener('finished', restoreState);

            if (name == 'twerk') {
                // Intentar reproducir el audio automáticamente
                audio2.play();
                if (audio1 !== undefined || audio3 !== undefined || audio4 !== undefined || audio5 !== undefined) {
                    if (audio1.isPlaying) {
                        audio1.stop();
                    }
                    
                    if (audio3.isPlaying) {
                        audio3.stop();
                    }
                    if (audio4.isPlaying) {
                        audio4.stop();
                    }
                    if (audio5.isPlaying) {
                        audio5.stop();
                    }
                }
            } else {
                if (audio2.isPlaying) {
                    audio2.stop();
                }
            }
        };
        // SE LA OPCIÓN CON SU FUNCIÓN Y EL NOMBRE DE LA ANIMACIÓN
        capturaFolder.add(api, name);
    }

    // SE DEFINE FUNCIÓN TIPO CallBack, EJECUTABLE CADA QUE SE FINALICE UNA ACCIÓN
    function restoreState() {
        // SE REMUEVE LA FUNCIÓN CallBack QUE REGRESA AL ESTADO PREVIO (ciclo de animación) 
        mixer.removeEventListener('finished', restoreState);
        // SE RE-ACTIVA EL CICLO DE ANIMACIÓN ACTUAL, CON UNA TRANSICIÓN DE 0.2 SEGUNDOS
        fadeToAction(api.ciclo, 0.2);
    }

    // SE AGREGAN LAS OPCIONES AL MENÚ (YA CONFIGURADAS CON SU CallBack)
    for (let i = 0; i < capturas.length; i++) {
        crearCapturaCallback(capturas[i]);
    }
    // SE CREA MENÚ
    capturaFolder.open();

    // SE DEFINE CICLO DE ANIMACIÓN INICIAL
    activeAction = actions['caminar'];
    activeAction.play();
}
/** ---------------------------------------------------------------------------------------------
DE PREFERENCIA ***NO MODIFICAR*** LAS SIGUIENTES FUNCIONES A MENOS QUE SEA ESTRICAMENTE NECESARIO
--------------------------------------------------------------------------------------------- **/

// FUNCIÓN PARA EL CONTROL DE TRANSICIONES ENTRE ANIMACIONES
function fadeToAction(name, duration) {
    previousAction = activeAction;
    activeAction = actions[name];

    if (previousAction !== activeAction) {
        previousAction.fadeOut(duration);
    }

    activeAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();
}

// FUNCIÓN PARA EL REESCALADO DE VENTANA
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Función para actualizar el color de las luces en el bucle de renderizado
function updateLightsColor() {
    // Calcular el cambio de color utilizando la función Math.sin()
    const redValue = Math.sin(time);
    const greenValue = Math.sin(time + Math.PI * 2 / 3);
    const blueValue = Math.sin(time + Math.PI * 4 / 3);

    // Actualizar los colores de las luces
    directionalLight1.color.setRGB(redValue, 0, 0);
    directionalLight2.color.setRGB(0, greenValue, 0);
    directionalLight3.color.setRGB(0, 0, blueValue);

    // Incrementar el tiempo para el siguiente fotograma
    time += 0.2; // Puedes ajustar la velocidad del cambio de color según sea necesario
}


// PARA LA ANIMACIÓN - INVOCACIÓN RECURSIVA
function animate() {
    const dt = clock.getDelta();

    if (mixer)
        mixer.update(dt);

    if (mixerExtra1)
        mixerExtra1.update(dt);

    if (mixerExtra2)
        mixerExtra2.update(dt);

    if (mixerExtra3)
        mixerExtra3.update(dt);

    if (bandera)
        updateLightsColor();
        
    if (bandera == false) {
        directionalLight1.color.setRGB(0, 0, 0);
        directionalLight2.color.setRGB(0, 0, 0);
        directionalLight3.color.setRGB(0, 0, 0);
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
}

// ------------------ REPRODUCCIÓN DE SONIDO ------------------
playButton.addEventListener('click', function () {
    // Verificar si el audio está reproduciéndose
    if (audio !== undefined) {
        if (audio.isPlaying) {
            audio.stop(); // Pausar la reproducción si está en curso
            audio1.setVolume(0); // Pausar la reproducción si está en curso
            audio2.setVolume(0); // Pausar la reproducción si está en curso
            audio3.setVolume(0); // Pausar la reproducción si está en curso
            audio4.setVolume(0); // Pausar la reproducción si está en curso
            audio5.setVolume(0); // Pausar la reproducción si está en curso
            
        } else {
            audio.play(); // Iniciar la reproducción si está pausado o no se ha iniciado
            audio1.setVolume(3); // Iniciar la reproducción si está pausado o no se ha iniciado
            audio2.setVolume(3); // Iniciar la reproducción si está pausado o no se ha iniciado
            audio3.setVolume(3); // Iniciar la reproducción si está pausado o no se ha iniciado
            audio4.setVolume(3); // Iniciar la reproducción si está pausado o no se ha iniciado
            audio5.setVolume(2); // Iniciar la reproducción si está pausado o no se ha iniciado
        }
    }
});