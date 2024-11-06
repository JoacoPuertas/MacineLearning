let handPose;
let video;
let hands = [];
let estado = 0; // Control de las pantallas/estados
let boton1 = { x: 185, y: 405, w: 200, h: 210 }; // Definimos las coordenadas del botón cuadrado
let estadoMano = ""; // Variable para almacenar el estado de la mano (abierta o cerrada)
let manoCerradaDuracion = 0; // Contador para la duración de la mano cerrada
let tiempoMaximo = 60 ; // 2 segundos en frames (asumiendo 60 FPS)

// variables codigo antiguo
let ancho = 1280;
let alto = 720;
let imagenes = [];
let gif;
let gifPlaying = false; // Control de estado del gif
let handInside = false;
let handInsideTimer = 0;
let currentTextAnimation = null;

function preload() {
  handPose = ml5.handPose();
  gif = loadImage("data/gifcarga.gif");
  for (let i = 0; i < 4; i++) {
    imagenes[i] = loadImage("data/pantalla" + i + ".png");
  }
}

function setup() {
  createCanvas(ancho, alto);
  // Crear el video de la webcam y ocultarlo
  video = createCapture(VIDEO);
  video.size(ancho, alto);
  video.hide();
  // Iniciar la detección de manos
  handPose.detectStart(video, gotHands);
  textSize(24);
  fill(50);
}

function draw() {
  // Dibujar el video de la webcam
  image(video, 0, 0, ancho, alto);

  // Dependiendo del estado, mostrar diferentes pantallas
  switch (estado) {
    case 0:
      drawEstado0();
      break;
    case 1:
      drawEstado1();
      break;
    case 2:
      drawEstado2();
      break;
    case 3:
      drawEstado3();
      break;
    // Agregar más pantallas si es necesario
  }

  // // Dibujar las manos detectadas
  // for (let i = 0; i < hands.length; i++) {
  //   let hand = hands[i];
  //   for (let j = 0; j < hand.keypoints.length; j++) {
  //     let keypoint = hand.keypoints[j];
  //     fill(0, 255, 0);
  //     noStroke();
  //     circle(keypoint.x, keypoint.y, 10); // Dibujar cada punto clave de la mano
  //   }
  // }

  // // Dibujar el estado de la mano (Cerrada o Abierta) en pantalla
  // fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  textSize(32);
  // text(estadoMano, ancho / 2, alto - 30); // Mostrar el estado de la mano en la parte inferior de la pantalla
  // text(handInside, 100, 100);
}


// Callback que recibe las predicciones de las manos
function gotHands(results) {
  hands = results; // Guardar las predicciones de las manos
}

// Función que detecta el hover y clic sobre un botón cuadrado
function detectHoverAndClick(bx, by, bw, bh, callback) {
  if (hands.length > 0) {
    let hand = hands[0].keypoints;

    // Comprobar si TODOS los keypoints de la mano están dentro del área del botón
    let isHovering = true;
    for (let i = 0; i < hand.length; i++) {
      let keypoint = hand[i];
      if (
        keypoint.x < bx ||
        keypoint.x > bx + bw ||
        keypoint.y < by ||
        keypoint.y > by + bh
      ) {
        isHovering = false;
        handInside = false;
        break; // Si algún keypoint está fuera del área, salir del bucle
      }
    }

    // Detectar si la mano está cerrada (basado en la distancia entre los dedos)
    let isHandClosed = isHandClosedCheck(hand);

    // Si todos los keypoints están dentro del botón y la mano está cerrada, ejecutar el callback
    if (isHovering) {
      handInside = true;
      fill(255, 255, 0, 100); // Mostrar un color de hover sobre el botón
      rect(bx, by, bw, bh);

      if (isHandClosed) {
        manoCerradaDuracion++; // Incrementar el contador si la mano está cerrada
      } else {
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }

      // Ejecutar el callback si la mano permanece cerrada durante el tiempo máximo
      if (manoCerradaDuracion >= tiempoMaximo) {
      
        callback(); // Cambiar de estado después de 2 segundos con la mano cerrada
       
      }
    } else if (!isHovering) {
      handInside = false;
    }
  }
}

// Función para detectar si la mano está cerrada (basado en la distancia entre los dedos)
function isHandClosedCheck(keypoints) {
  let thumbTip = keypoints[4]; // Punta del pulgar
  let indexTip = keypoints[8]; // Punta del dedo índice
  let middleTip = keypoints[12]; // Punta del dedo medio
  let ringTip = keypoints[16]; // Punta del dedo anular
  let pinkyTip = keypoints[20]; // Punta del dedo meñique

  // Medir la distancia entre los dedos
  let distThumbIndex = dist(thumbTip.x, thumbTip.y, indexTip.x, indexTip.y);
  let distIndexMiddle = dist(indexTip.x, indexTip.y, middleTip.x, middleTip.y);

  // Si la distancia entre los dedos es pequeña, asumimos que la mano está cerrada
  let isClosed = distThumbIndex < 50 && distIndexMiddle < 50;

  // Actualizar el estado de la mano (Cerrada o Abierta)
  if (isClosed) {
    estadoMano = "Cerrada";
  } else {
    estadoMano = "Abierta";
  }

  return isClosed; // Devuelve si la mano está cerrada o no
}

function showGifAndAnimation() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[1], 0, 0, ancho, alto);
  pop();

  if (!gifPlaying) {
    gif.reset();
    gifPlaying = true;
  }
  handInsideTimer += deltaTime;

  push();
  blendMode(SCREEN);
  image(gif, ancho / 2 - 75, alto / 2 - 75, 150, 150);
  pop();
}

function writeText(textToWrite, x, y, speed, startDelay = 0) {
  // Reiniciar la animación de texto si no existe o si es un nuevo texto
  if (!writeText.state || writeText.state.text !== textToWrite) {
    writeText.state = {
      text: textToWrite,
      x: x,
      y: y,
      charIndex: 0,
      lastTime: millis(),
      speed: speed,
      startTime: millis() + startDelay, // Espera inicial
    };
  }

  let state = writeText.state;

  // Si ya pasó el tiempo de inicio (startDelay)
  if (millis() >= state.startTime) {
    // Mostrar los caracteres uno a uno
    let displayedText = state.text.substring(0, state.charIndex);
    let parts = displayedText.split("@"); // Separar en líneas usando el carácter "@"
    let line1 = parts[0];
    let line2 = parts[1] || "";
    let line3 = parts[2] || ""; // Agregar una tercera línea

    // Asegúrate de usar la función text() de p5.js para mostrar el texto en pantalla
    window.text(line1, state.x, state.y); // Usar window.text para evitar conflictos
    if (line2) {
      window.text(line2, state.x, state.y + 30); // Segunda línea a 30px abajo de la primera
    }
    if (line3) {
      window.text(line3, state.x, state.y + 60); // Tercera línea a 60px abajo de la primera
    }

    // Incrementar el índice de caracteres basado en el tiempo
    if (millis() - state.lastTime > state.speed) {
      state.charIndex++;
      state.lastTime = millis();
    }
  }

  // Devolver si el texto está completamente escrito
  return state.charIndex >= state.text.length;
}



function drawEstado0() {
  image(imagenes[0], 0, 0, ancho, alto);

  if (handInside) {
    showGifAndAnimation();
    if (handInsideTimer >= 2700) {
      estado = 1;
      handInsideTimer = 0;
      gifPlaying = false;
      // initText(
      //   "ESTA ES UNA INFOGRAFIA SOBRE MACHINE LEARNING@EN EL MUNDO DEL CINE",
      //   ancho / 2,
      //   alto / 2,
      //   50,
      //   2000
      // );
      handInside = false;
    }
  } else {
    handInsideTimer = 0;
    gifPlaying = false;
  }
  // Llamamos a la función que detecta hover y clic sobre el botón
  detectHoverAndClick(boton1.x, boton1.y, boton1.w, boton1.h, () => {
   
  });
}

function drawEstado1() {
  image(imagenes[2], 0, 0, ancho, alto);
  textAlign(CENTER);
handInside = false;
  // Escribir texto en el estado 1
  let isTextComplete = writeText(
     "ESTA ES UNA INFOGRAFIA SOBRE MACHINE LEARNING@EN EL MUNDO DEL CINE",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  if (isTextComplete) {
    setTimeout(() => {
      estado = 2;
    }, 2000); // Cambiar de estado después de que el texto se haya completado
  }
}


function drawEstado2() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[3], 0, 0, ancho, alto);
  pop();

  if (handInside) {
    push();

    text("PARA HACER CLICK SOBRE@LOS BOTONES, CERRÁ TU MANO", 500, 350);
    pop();
  }
  textAlign(CENTER);
  // Escribir texto en el estado 1
   writeText(
    "PARA COMENZAR, COLOCA@LA PALMA DE TU MANO@SOBRE EL RECUADRO",
    ancho / 2,
    alto / 4,
    50,
    0
  );
   // Ejecuta la animación de texto del estado 2
  // Llamamos a la función que detecta hover y clic sobre el botón
  detectHoverAndClick(150, 290, 350, 350, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      estado = 3; // Cambiar al siguiente estado
    }
  });
  // push()
  // fill(255)
  // rect (150, 290, 350, 350);
  // pop()
}

function drawEstado3(){
  push();
  image(imagenes[2], 0, 0, ancho, alto);
  pop();
  writeText(
    "¡MUY BIEN! YA APRENDISTE LAS MECÁNICAS PARA INTERACTUAR CONMIGO",
    ancho / 2,
    alto / 4,
    50,
    0
  );

}
