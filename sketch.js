// CALIBRAR:
// Definir un valor de referencia de distancia máxima para una mano completamente abierta (ajustable según pruebas)
let maxOpenDistance = 80; // Tamaño en px en pantalla de una mano completamente abierta
let minClosedDistance = 30; // Tamaño en px en pantalla de una mano completamente cerrada
let numText = 5;
let frameCounter2 = 0;
let fotoSacada = false;


let estado = 11; // Control de las pantallas/estados
let mostrarventana = 0;


let gifestado1;
let doblecontrol = false;
let cursor = [];
let num = 0;
let agrandar = true;
let ventanaY = 10; // Inicia desde la parte superior

let logo;
let handPose;
let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
let video;
let hands = [];
let faces = [];
let estadoMano = ""; // Variable para almacenar el estado de la mano (abierta o cerrada)
let manoCerradaDuracion = 0; // Contador para la duración de la mano cerrada
let tiempoMaximo = 40; // 2 segundos en frames (asumiendo 60 FPS)
let activarGif = false;
let manosImagenes = [];
let manoActual = 0;
let manoActual2 = 0;
let cantidadManos = 19;
let manoData = [];
let manoData2 = [];
let manosfinalizada = false;
let intervaloManos = 6;
let frameCounter = 0;
let opennessPercentage;
let ejMotionCapture;
let gifMachineLearning;
let logos = [];
let gifPersona;
let estadoInterno = 0;
let mascaras = 0;
let mascara = [];
let ia;
let tradicional;
let pc = [];
let webcam = [];
let tradicionalFinal;
let botonEstado7 = false;
// variables codigo antiguo
let ancho = 1280;
let alto = 720;
let imagenes = [];
let gif;
let gifPlaying = false; // Control de estado del gif
let handInside = false;
let isHandClosed = false;
let handInsideTimer = 0;
let currentTextAnimation = null;
let alerta;
let esperaDeBotones = 0;
//TIPOGRFIA
let jersey;
let contador = 0;
let altoEstado10 = 150;
let anchorect = 885;
let estado12 = false;
let estado13 = false;
let modeBlend = false;
let circlegif;
let tam = 0;
let c = [];

function preload() {
  handPose = ml5.handPose({ backend: "webgl" });
  faceMesh = ml5.faceMesh(options);
  gif = loadImage("data/gifcarga.gif");
  alerta = loadImage("data/alerta.png");
  for (let i = 0; i < 18; i++) {
    imagenes[i] = loadImage("data/pantalla" + i + ".png");
  }

  for (let i = 0; i <= 14; i++) {
    manosImagenes[i] = loadImage("data/manos/" + i + ".png");
  }
  tradicionalFinal = loadImage("data/tradicionalfinal.gif");
  gifMachineLearning = loadImage("data/gifmachinelearning.gif");
  gifPersona = loadImage("data/visual.gif");
  gifestado1 = loadImage("data/gifestado1.gif");

  for (let i = 0; i <= 7; i++) {
    mascara[i] = loadImage("data/mascaras/" + i + ".png");
  }

  for (let i = 0; i <= 7; i++) {
    pc[i] = loadImage("data/pc/" + i + ".png");
  }
  for (let i = 0; i < 10; i++) {
    webcam[i] = loadImage("data/webcam/" + i + ".png");
  }
  //carpetitas
  ia = loadImage("data/ia.png");
  tradicional = loadImage("data/tradicional.png");

  //Cursor
  cursor[0] = loadImage("data/arrow.png");
  cursor[1] = loadImage("data/pointer.png");
  jersey = loadFont("data/jersey.ttf");

  //Gif
  entrenando = loadImage("data/entrenando.gif");
  logo = loadImage("data/logo.png");
  circlegif = loadImage("data/circle.gif");
}

function setup() {
  createCanvas(ancho, alto);
  // Crear el video de la webcam y ocultarlo
  textFont(jersey);
  video = createCapture(VIDEO);
  video.size(ancho, alto);
  video.hide();
  // Iniciar la detección de manos
  handPose.detectStart(video, gotHands);
  faceMesh.detectStart(video, gotFaces);
  textSize(32);
  fill(50);

  // pantalla 10
  for (let i = 0; i < manosImagenes.length; i++) {
    manoData.push({
      x: random(50, ancho - 150),
      y: random(50, alto - 150),
    });
    manoData2.push({
      x: random(-100, ancho - 200),
      y: random(-100, alto - 200),
    });
  }

  for (let i = 0; i < 4; i++) {
    c[i] = random(0, 255);
  }
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
      //drawEstado3();
      break;
    case 4:
      drawEstado4();
      break;
    case 5:
      drawEstado5();
      break;
    case 6:
      drawEstado6();
      break;
    case 7:
      drawEstado7();
      break;
    case 8:
      drawEstado8();
      break;
    case 9:
      drawEstado9();
      break;
    case 10:
      drawEstado10();
      break;
    case 11:
      drawEstado11();
      break;
    case 12:
      drawEstado12();
      break;
    case 13:
      drawEstado13();
      break;
    case 14:
      drawEstado14();
      break;
    case 15:
      drawEstado15();
      break;
    case 16:
      drawEstado16();
      break;
    case 17:
      drawEstado17();
      break;
    case 18:
      drawEstado18();
      break;

    // Llamar a la función con el mensaje deseado

    // Agregar más pantallas si es necesario
  }
  if (
    estado >= 4 &&
    estado != 17 &&
    estado != 12 &&
    estado != 13 &&
    estado != 18
  ) {
    reiniciar();
    volver();
  }

  if (estado > 3 && estado != 10) {
    cursorDraw(hands);
  }

  if (estado < 3) {
    drawHandBoxWithText(hands, " ");
  }

  text(estado, 100, 50);

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
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text(estadoMano, ancho / 2, alto - 30); // Mostrar el estado de la mano en la parte inferior de la pantalla
  // text(handInside, 100, 100);
  esperaDeBotones += 1;
}

// Callback que recibe las predicciones de las manos
function gotHands(results) {
  hands = results; // Guardar las predicciones de las manos
}

function gotFaces(results) {
  faces = results;
}

// Función que detecta el hover y clic sobre un botón cuadrado
function detectHoverAndClick(bx, by, bw, bh, mostrarBoton, callback) {
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
    isHandClosed = isHandClosedCheck(hand);

    // Si todos los keypoints están dentro del botón y la mano está cerrada, ejecutar el callback
    if (isHovering) {
      handInside = true;
      //fill(255, 255, 0, 100); // Mostrar un color de hover sobre el botón
      // rect(bx, by, bw, bh);

      if (isHandClosed) {
        manoCerradaDuracion++; // Incrementar el contador si la mano está cerrada
      } else {
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }

      // Ejecutar el callback si la mano permanece cerrada durante el tiempo máximo
      if (esperaDeBotones > 90) {
        if (manoCerradaDuracion >= tiempoMaximo) {
          callback(); // Cambiar de estado después de 2 segundos con la mano cerrada
        }
      }
    } else if (!isHovering) {
      handInside = false;
    }
  }

  if (mostrarBoton) {
    push();
    fill(0, 0);
    stroke(124, 196, 137);
    strokeWeight(2);
    rect(bx, by, bw, bh);
    pop();
  }
}
// Función para detectar si la mano está cerrada y calcular el porcentaje de apertura
function isHandClosedCheck(keypoints) {
  let thumbTip = keypoints[4]; // Punta del pulgar
  let indexTip = keypoints[8]; // Punta del dedo índice
  let middleTip = keypoints[12]; // Punta del dedo medio
  let ringTip = keypoints[16]; // Punta del dedo anular
  let pinkyTip = keypoints[20]; // Punta del dedo meñique

  // Medir la distancia entre los dedos
  let distThumbIndex = dist(thumbTip.x, thumbTip.y, indexTip.x, indexTip.y);
  let distIndexMiddle = dist(indexTip.x, indexTip.y, middleTip.x, middleTip.y);
  let distMiddleRing = dist(middleTip.x, middleTip.y, ringTip.x, ringTip.y);
  let distRingPinky = dist(ringTip.x, ringTip.y, pinkyTip.x, pinkyTip.y);

  // Calcular el promedio de las distancias actuales
  let avgDistance =
    (distThumbIndex + distIndexMiddle + distMiddleRing + distRingPinky) / 4;

  // Normalizar el valor entre 0 (cerrada) y 1 (abierta) y convertirlo a porcentaje
  let openness = constrain(
    (avgDistance - minClosedDistance) / (maxOpenDistance - minClosedDistance),
    0,
    1
  );
  opennessPercentage = Math.round(openness * 100); // Convertir a porcentaje

  // Determinar el estado de la mano
  let isClosed = openness < 0.2; // Umbral para considerar la mano como "cerrada"
  estadoMano = isClosed ? "Cerrada" : "Abierta";

  //text( opennessPercentage, 500, 100);

  return isClosed; // Devuelve el estado y el porcentaje de apertura
}

function showGifAndAnimation() {
  push();
  blendMode(BURN);
  image(imagenes[1], 0, 0, ancho, alto);
  pop();

  if (!gifPlaying) {
    gif.reset();
    gifPlaying = true;
  }
  handInsideTimer += deltaTime;

  push();
  blendMode(SCREEN);
  image(gifPersona, ancho / 2 + 100, alto / 2, 300, 450);
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

    // Asegúrate de usar la función text() de p5.js para mostrar el texto en pantalla
    window.text(displayedText, state.x, state.y); // Mostrar el texto acumulado

    // Incrementar el índice de caracteres basado en el tiempo
    if (millis() - state.lastTime > state.speed) {
      state.charIndex++;
      state.lastTime = millis();
    }
  }

  // Devolver si el texto está completamente escrito
  return state.charIndex >= state.text.length;
}

function boton(texto, posx, posy, tamx, tamy) {
  if (!handInside) {
    push();
    rectMode(CENTER, CENTER);
    textAlign(CENTER, CENTER);
    fill(220);
    stroke(60);
    strokeWeight(3);
    rect(posx, posy, tamx, tamy);
    noStroke();
    fill(0);
    text(texto, posx, posy);
    pop();
  } else if (handInside) {
    push();
    stroke(160);
    strokeWeight(3);
    fill(60);
    rectMode(CENTER, CENTER);
    rect(posx, posy, tamx, tamy);
    textAlign(CENTER, CENTER);
    fill(255);
    stroke(60);
    strokeWeight(3);
    rect(posx - 4, posy - 4, tamx, tamy);
    noStroke();
    fill(0);
    text(texto, posx - 4, posy - 4);
    pop();

    if (isHandClosed) {
      push();
      rectMode(CENTER, CENTER);
      textAlign(CENTER, CENTER);
      push();
      fill(0);
      stroke(0);
      strokeWeight(3);
      rect(posx - 4, posy - 4, tamx, tamy);
      pop();
      fill(140);
      stroke(60);
      strokeWeight(3);
      rect(posx, posy, tamx, tamy);
      noStroke();
      fill(0);
      text(texto, posx, posy);
      pop();
    }
  }
}

function volver() {
  detectHoverAndClick(0, 0, 300, 250, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      estado = estado - 1; // Cambiar al siguiente estado
      manoCerradaDuracion = 1; // Si la mano no está cerrada, reiniciar el contador
    }
  });
  boton("VOLVER", 85, 40, 150, 60);

  // push();
  // textAlign(CENTER, CENTER);
  // fill(220);
  // stroke(60);
  // strokeWeight(3);
  // rect(10, 10, 150, 60);
  // noStroke();
  // fill(0);
  // textSize(30);
  // text("VOLVER", 85, 35);
  // pop();
}

function reiniciar() {
  detectHoverAndClick(ancho - 300, 0, 300, 250, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      doblecontrol = true; // Cambiar al siguiente estado
      manoCerradaDuracion = 1; // Si la mano no está cerrada, reiniciar el contador
    }
  });
  boton("REINICIAR", ancho - 85, 40, 150, 60);

  if (doblecontrol) {
    ventana2(ancho / 8, alto / 6, 200, "REINICIAR");
    push();
    textAlign(LEFT, TOP);
    text("ESTÁS SEGURX DE QUE QUERÉS REINICIAR?", ancho / 7, alto / 4);
    rectMode(LEFT, TOP);
    detectHoverAndClick(ancho / 1.8, alto / 5.5, 300, 300, 0, () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 0;
        mostrarventana = 0;
        doblecontrol = false;
        contador = 0;
      }
    });
    boton("REINICIAR", ancho / 1.4, alto / 2.8, 150, 60);
    detectHoverAndClick(ancho / 2.4, alto / 5.5, 300, 300, 0, () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        doblecontrol = false;
    
      }
    });
    boton("VOLVER", ancho / 1.9, alto / 2.8, 150, 60);
    pop();
  }

  // push();
  // textAlign(CENTER, CENTER);
  // fill(220);
  // stroke(60);
  // strokeWeight(3);
  // rect(ancho - 160, 10, 150, 60);
  // noStroke();
  // fill(0);
  // textSize(30);
  // text("REINICIAR", ancho - 85, 35);
  // pop();
}

function cursorDraw(hands) {
  if (hands.length > 0) {
    let hand = hands[0].keypoints;

    // Encontrar el punto más extremo en cada dirección
    let minX = Math.min(...hand.map((kp) => kp.x));
    let maxX = Math.max(...hand.map((kp) => kp.x));
    let minY = Math.min(...hand.map((kp) => kp.y));
    let maxY = Math.max(...hand.map((kp) => kp.y));

    // Calcular el ancho y alto del rectángulo
    let rectWidth = maxX - minX;
    let rectHeight = maxY - minY;
    if (estadoMano == "Cerrada") {
      num = 1;
    } else {
      num = 0;
    }
    image(cursor[num], minX + rectWidth / 2, minY + rectHeight / 2, 40, 40);
  }
}

// Función para dibujar un rectángulo sin relleno alrededor de la mano detectada con texto a la derecha
function drawHandBoxWithText(hands, textMessage) {
  if (hands.length > 0) {
    let hand = hands[0].keypoints;

    // Encontrar el punto más extremo en cada dirección
    let minX = Math.min(...hand.map((kp) => kp.x));
    let maxX = Math.max(...hand.map((kp) => kp.x));
    let minY = Math.min(...hand.map((kp) => kp.y));
    let maxY = Math.max(...hand.map((kp) => kp.y));

    // Calcular el ancho y alto del rectángulo
    let rectWidth = maxX - minX;
    let rectHeight = maxY - minY;

    // Dibujar el rectángulo sin relleno
    push();
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(minX, minY, rectWidth, rectHeight);
    pop();
    // Dibujar el texto a la derecha del rectángulo
    push();
    noStroke();
    fill(255);
    stroke(0);
    textSize(40);
    textLeading(30);
    strokeWeight(4);
    textAlign(CENTER, CENTER);
    text(textMessage, (minX + maxX) / 2, minY - 50); // Texto centrado verticalmente al lado derecho del rectángulo
    pop();
  }
}

function ventana1(x, y, height, title) {
  const titleHeight = 40; // Altura del recuadro del título
  const padding = 20; // Espaciado interno
  const fontSizeTitle = 40;
  push();
  strokeWeight(5);
  stroke(153);
  // Fondo del cuerpo
  fill(0); // Negro
  rect(x, y + titleHeight, ancho - 300, height - titleHeight);

  // Fondo del título
  fill(210); // Gris
  rect(x, y, ancho - 300, titleHeight);
  pop();
  // Título
  push();
  fill(0); // Blanco
  textSize(fontSizeTitle);
  textAlign(LEFT, CENTER);
  text(title.toUpperCase(), x + padding, y + titleHeight / 2);
  pop();
}
function ventana2(x, y, height, title) {
  const titleHeight = 40; // Altura del recuadro del título
  const padding = 30; // Espaciado interno
  const fontSizeTitle = 40;
  push();
  strokeWeight(5);
  stroke(0);
  // Fondo del cuerpo
  fill(220); // Negro
  rect(x, y + titleHeight, ancho - 400, height - titleHeight);

  fill(0);
  rect(x + 10, y + 10 + titleHeight, ancho - 420, height - titleHeight - 20);

  // Fondo del título
  fill(220); // Gris
  rect(x, y, ancho - 400, titleHeight);
  pop();
  // Título
  push();
  fill(0); // Blanco
  textSize(fontSizeTitle);
  textAlign(LEFT, CENTER);
  text(title.toUpperCase(), x + padding, y + titleHeight / 2);
  pop();
}
function ventana2expansible(x, y, width, height, title) {
  const titleHeight = 40; // Altura del recuadro del título
  const padding = 30; // Espaciado interno
  const fontSizeTitle = 40;
  push();
  strokeWeight(5);
  stroke(0);
  // Fondo del cuerpo
  fill(220); // Negro
  rect(x, y + titleHeight, width, height - titleHeight);

  fill(0);
  rect(x + 10, y + 10 + titleHeight, width - 20, height - titleHeight - 20);

  // Fondo del título
  fill(220); // Gris
  rect(x, y, width, titleHeight);
  pop();
  // Título
  push();
  fill(0); // Blanco
  textSize(fontSizeTitle);
  textAlign(LEFT, CENTER);
  text(title.toUpperCase(), x + padding, y + titleHeight / 2);
  pop();
}

function drawEstado0() {
  push();
  image(imagenes[0], 0, 0, ancho, alto); // Imagen normal sin blendMode// Si hay caras detectadas, activar el blendMode
  if (faces.length > 0) {
    // Solo cambiar blendMode cuando se detecta una cara y aún no se ha activado
    modeBlend = true;
    blendMode(DIFFERENCE); // Cambiar el blendMode solo una vez
    fill(0, esperaDeBotones / 2, esperaDeBotones / 9);
    rect(0, 0, ancho, alto);
  }

  // Si no hay caras, restablecer el blendMode a normal

  if (faces.length === 0 && modeBlend) {
    modeBlend = false;
    blendMode(BLEND); // Restablecer a modo normal
  }

  // Dibujar la imagen normal o con el efecto de blendMode según el estado de modeBlend

  pop();

  // Mostrar animación y gif si la mano está dentro
  if (handInside) {
    showGifAndAnimation();
    if (handInsideTimer >= 2700) {
      estado = 1;
      handInsideTimer = 0;
      gifPlaying = false;
      handInside = false;
    }
  } else {
    handInsideTimer = 0;
    gifPlaying = false;
  }

  // Llamamos a la función que detecta hover y clic sobre el botón
  detectHoverAndClick(ancho / 9, alto / 1.9, 300, 300, 0, () => {
    if (manoCerradaDuracion >= tiempoMaximo) {
      esperaDeBotones = 0; // Cambiar al siguiente estado
    }
  });
  push();
  blendMode(DIFFERENCE);
  imageMode(CENTER, CENTER);
  image(circlegif, 280, alto - alto / 3.7, 350, 350);

  pop();
}

function drawEstado1() {
  push();
  blendMode(DIFFERENCE);
  image(gifestado1, 0, 0, ancho, alto);
  // image(gifestado1, 0, 0, ancho, alto);
  pop();
  push();
  textAlign(LEFT, TOP);
  handInside = false;
  // Escribir texto en el estado 1

  textLeading(48);
  ventana1(ancho / 8, alto / 4, 130, "HOLA MUNDO");
  let isTextComplete = writeText(
    "ESTA ES UNA INFOGRAFIA SOBRE MACHINE LEARNING EN EL MUNDO DEL CINE",
    ancho / 7,
    alto / 2.9,
    50,
    0
  );
  pop();
  if (isTextComplete) {
    setTimeout(() => {
      estado = 2;
    }, 2000); // Cambiar de estado después de que el texto se haya completado
  }
}

function drawEstado2() {
  push();
  if (!handInside) {
    blendMode(DIFFERENCE);
    image(imagenes[3], 0, 0, ancho, alto);
  }

  pop();
  textAlign(LEFT, TOP);
  if (handInside) {
    push();
    blendMode(DIFFERENCE);
    image(imagenes[3], 0, 0, ancho, alto);
    blendMode(BURN);
    image(imagenes[13], 0, 0, ancho, alto);
    // image(imagenes[13], 0, 0, ancho, alto);
    pop();
    push();
    ventana1(ancho / 8, alto / 7, 150, "INTERACCIÓN");
    writeText(
      "PARA HACER CLICK SOBRE LOS BOTONES, CERRÁ TU MANO",
      ancho / 7,
      alto / 4.5,
      50,
      0
    );
    pop();
    push();
    // Draw all the tracked hand points
    for (let i = 0; i < hands.length; i++) {
      let hand = hands[i];
      for (let j = 0; j < hand.keypoints.length; j++) {
        let keypoint = hand.keypoints[j];
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
    pop();
  }

  textAlign(LEFT, TOP);
  // Escribir texto en el estado 1
  if (!handInside) {
    ventana1(ancho / 8, alto / 7, 150, "INTERACCIÓN");
    writeText(
      "PARA COMENZAR, COLOCA LA PALMA DE TU MANO SOBRE EL RECUADRO",
      ancho / 7,
      alto / 4.5,
      50,
      0
    );
  }
  push();
  stroke(255, 0, 0);
  strokeWeight(5);
  fill(255, 0);
  rect(150, 297, 330, 330);
  pop();
  // Ejecuta la animación de texto del estado 2
  // Llamamos a la función que detecta hover y clic sobre el botón
  detectHoverAndClick(150, 290, 350, 350, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      estado = 4; // Cambiar al siguiente estado
      esperaDeBotones = 0;
    }
  });
  // push()
  // fill(255)
  // rect (150, 290, 350, 350);
  // pop()
}

// function drawEstado3() {
//   push();
//   blendMode(DIFFERENCE);
//   image(imagenes[2], 0, 0, ancho, alto);
//   pop();
//   let texto1 = writeText(
//     "¡MUY BIEN!\n YA APRENDISTE LAS MECÁNICAS\n PARA INTERACTUAR CONMIGO",
//     ancho / 2,
//     alto / 4,
//     50,
//     0
//   );

//   if (texto1) {
//     setTimeout(() => {
//       estado = 4;
//     }, 2000); // Cambiar de estado después de que el texto se haya completado
//   }
// }

function drawEstado4() {
  // Dibujar el fondo y la ventana de alerta
  push();
  blendMode(DIFFERENCE);
  image(imagenes[2], 0, 0, ancho, alto);
  pop();
  ventana2(200, alto / 8, 200, "MENSAJE");

  // Escribir el texto
  push();
  fill(255);
  textAlign(LEFT, TOP);
  if (mostrarventana == 0) {
    let texto1 = writeText(
      "¡MUY BIEN!\nYA APRENDISTE LAS MECÁNICAS PARA INTERACTUAR CONMIGO",
      ancho / 6 + 25,
      alto / 5 + 20,
      50,
      0
    );
    pop();
    if (texto1) {
      setTimeout(() => {
        writeText.state = null;
        mostrarventana = 1;
      }, 1000); // Cambiar de estado después de que el texto se haya completado
    }
  }
  if (mostrarventana == 1) {
    ventana2(ancho / 4, alto / 6, 370, "ALERTA");

    // Dibujar la imagen de alerta
    push();
    imageMode(LEFT, TOP);
    image(alerta, ancho / 3.5, alto / 3.5, 200, 200);
    pop();

    // Escribir el texto
    push();
    fill(255);
    textAlign(LEFT, TOP);
    texto1 = writeText(
      "A PARTIR DE AHORA, CADA VEZ QUE QUIERAS\nSELECCIONAR UN BOTON DEBERÁS PONER LA MANO\nSOBRE ÉL Y CERRAR EL PUÑO",
      ancho / 2.1,
      alto / 3.2,
      50,
      0
    );
    pop();

    // Dibujar el botón
    detectHoverAndClick(
      ancho / 1.25 - 200,
      alto / 1.67 - 150,
      400,
      300,
      0,
      () => {
        if (manoCerradaDuracion >= tiempoMaximo) {
          mostrarventana = 2;
          esperaDeBotones = 0;
        }
      }
    );
    boton("CONTINUAR", ancho / 1.25, alto / 1.67, 300, 70);
  }
  if (mostrarventana == 2) {
    ventana2(ancho / 4, alto / 6, 370, "ALERTA");
    push();
    imageMode(LEFT, TOP);
    image(alerta, ancho / 3.5, alto / 3.5, 200, 200);
    pop();
    text(
      "A PARTIR DE AHORA, CADA VEZ QUE QUIERAS\nSELECCIONAR UN BOTON DEBERÁS PONER LA MANO\nSOBRE ÉL Y CERRAR EL PUÑO",
      ancho / 2.1,
      alto / 3.2
    );
    boton("CONTINUAR", ancho / 1.25, alto / 1.67, 300, 70);
    ventana2(ancho / 9, alto / 2, 275, "MENSAJE");

    // Escribir el texto
    push();
    fill(255);
    textAlign(LEFT, TOP);
    texto1 = writeText(
      "VAMOS A EMPEZAR A ENTENDER QUÉ ES EL MACHINE LEARNING",
      ancho / 8 + 20,
      alto / 1.7 + 20,
      50,
      0
    );
    pop();

    // Dibujar el botón
    detectHoverAndClick(
      ancho / 1.51 - 200,
      alto / 1.3 - 150,
      400,
      300,
      0,
      () => {
        if (manoCerradaDuracion >= tiempoMaximo) {
          mostrarventana = 0;
          estado = 7;
          esperaDeBotones = 0;
        }
      }
    );
    boton("CONTINUAR", ancho / 1.51, alto / 1.25, 300, 70);
  }
  cursorDraw(hands);
  // volver();
  // reiniciar();
}
function drawEstado5() {
  push();
  blendMode(BURN);
  image(imagenes[4], 0, 0, ancho, alto);
  pop();
  writeText(
    "¿CUÁNTO SABES SOBRE EL MACHINE LEARNING?",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  detectHoverAndClick(
    ancho / 2 - 150,
    alto - alto / 3 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 6; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
        esperaDeBotones = 0;
      }
    }
  );
  boton("RESPONDER", ancho / 2, alto - alto / 3, 300, 100);

  if (handInside) {
    boton("RESPONDER", ancho / 2, alto - alto / 3, 300, 100, 51, 160, 72);
  }
}

function drawEstado6() {
  let boton1 = false;
  push();
  blendMode(DIFFERENCE);
  image(imagenes[5], 0, 0, ancho, alto);
  pop();
  writeText(
    "¿CUANTO SABES SOBREN EL MACHINE LEARNING?",
    ancho / 2,
    alto / 8,
    50,
    0
  );

  detectHoverAndClick(ancho / 8 - 150, alto / 2 - 150, 300, 300, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      estado = 7; // Cambiar al siguiente estado
    }
  });
  detectHoverAndClick(ancho / 2 - 150, alto / 2 - 150, 300, 300, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      estado = 7; // Cambiar al siguiente estado
      esperaDeBotones = 0;
    }
  });
  detectHoverAndClick(
    ancho - ancho / 8 - 150,
    alto / 2 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 7; // Cambiar al siguiente estado
        esperaDeBotones = 0;
      }
    }
  );

  boton("MUCHO", ancho / 8, alto / 2, 300, 100, 255, 130, 130);
  boton("POCO", ancho / 2, alto / 2, 300, 100, 255, 130, 130);
  boton("NADA", ancho - ancho / 8, alto / 2, 300, 100, 255, 130, 130);

  if (boton1 == true) {
    boton("MUCHO", ancho / 8, alto / 3, 300, 300, 51, 160, 72);
  }
}

function drawEstado7() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[4], 0, 0, ancho, alto);
  pop();
  textAlign(LEFT, TOP);
  push();
  ventana1(ancho / 8, alto / 6, 150, "INTRODUCCIÓN");
  pop();
  if (mostrarventana == 0) {
    let texto1 = writeText(
      "EL MACHINE LEARNING ES UN AREA DE LA INTELIGENCIA ARTIFICIAL",
      ancho / 7,
      alto / 4,
      50,
      0
    );
    if (texto1) {
      setTimeout(() => {
        mostrarventana = 1;
        writeText.state = null;
      }, 500); // Cambiar de estado después de que el texto se haya completado
    }
  }
  if (mostrarventana == 1) {
    push();
    ventana1(ancho / 6, alto / 4, 150, "INTRODUCCIÓN");
    pop();
    let texto1 = writeText(
      "PERMITE A LAS COMPUTADORAS ANALIZAR GRANDES CANTIDADES DE DATOS",
      ancho / 5.3,
      alto / 3,
      50,
      0
    );
    if (texto1) {
      setTimeout(() => {
        mostrarventana = 2;
        writeText.state = null;
      }, 500); // Cambiar de estado después de que el texto se haya completado
    }
  }
  if (mostrarventana == 2) {
    push();
    ventana1(ancho / 6, alto / 4, 150, "INTRODUCCIÓN");
    ventana1(ancho / 9, alto / 3, 150, "INTRODUCCIÓN");
    pop();
    let texto1 = writeText(
      "EN BASE A ESTOS DATOS IDENTIFICA PATRONES, HACE PREDICCIONES \n Y TOMA DECISIONES",
      ancho / 7.7,
      alto / 2.4,
      50,
      0
    );
    if (texto1) {
      setTimeout(() => {
        writeText.state = null;
        mostrarventana = 3;
      }, 500); // Cambiar de estado después de que el texto se haya completado
    }
  }
  if (mostrarventana == 3) {
    push();
    ventana1(ancho / 6, alto / 4, 150, "INTRODUCCIÓN");
    ventana1(ancho / 9, alto / 3, 150, "INTRODUCCIÓN");
    ventana1(ancho / 7.5, alto / 5, 300, "INTRODUCCIÓN");
    pop();
    let texto1 = writeText(
      "PERO ESTO ES MUY ABSTRACTO, VEÁMOSLO EN UN EJEMPLO CONCRETO",
      ancho / 5.9,
      alto / 3.5,
      50,
      0
    );
    if (texto1) {
      setTimeout(() => {
        botonEstado7 = true;
      }, 500); // Cambiar de estado después de que el texto se haya completado
    }
    if (botonEstado7) {
      detectHoverAndClick(ancho / 2 - 200, alto / 2 - 100, 400, 300, 0, () => {
        if (manoCerradaDuracion >= tiempoMaximo) {
          estado = 8; // Cambiar al siguiente estado
          mostrarventana = 0;
          esperaDeBotones = 0;
        }
      });
      boton("CONTINUAR", ancho / 2, alto / 2, 300, 70);
    }
  }
}

function drawEstado8() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[11], 0, 0, ancho, alto);
  pop();
  push();
  ventana2(ancho / 6, alto / 5, 300, "INTRODUCCIÓN");
  pop();
  textAlign(LEFT, TOP);
  if (mostrarventana == 0) {
    writeText(
      "VAMOS A ENTRENAR A LA INTELIGENCIA ARTIFICIAL\nPARA QUE DETECTE UNA MANO ABIERTA",
      ancho / 5,
      alto / 3.5,
      50,
      0
    );

    detectHoverAndClick(
      ancho / 1.5,
      alto / 2.8,
      300,
      300,
      0,
      () => {
        // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
        if (manoCerradaDuracion >= tiempoMaximo) {
          mostrarventana = 1; // Cambiar al siguiente estado
          manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
          writeText.state = null;
          esperaDeBotones = 0;
        }
      }
    );
    boton("OK", ancho / 1.25, alto / 1.8, 100, 50);

    // boton("CONTINUAR", ancho / 2, alto - alto / 3, 300, 100);
  }
  if (mostrarventana == 1) {
    push();
    ventana2(ancho / 5, alto / 4, 300, "PASO 1");
    pop();
    push();
    writeText(
      "PRIMERO, DEBEMOS MOSTRAR EJEMPLOS DE MANOS ABIERTAS PARA QUE\nPUEDA RECONOCER LOS PATRONES QUE SE REPITEN EN TODAS LAS MANOS",
      ancho / 4.5,
      alto / 2.9,
      50,
      0
    );
    pop();

    detectHoverAndClick(
      ancho / 1.2 - 200,
   alto / 2.5,
      300,
      300,
      0,
      () => {
        // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
        if (manoCerradaDuracion >= tiempoMaximo) {
          // Cambiar al siguiente estado
          manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
          activarGif = true;
          esperaDeBotones = 0;
        }
      }
    );
    boton("ENTRENAR", ancho / 1.25, alto / 1.75, 175, 70);
  }
  if (activarGif && estado == 8) {
    contador += 1;

    for (let i = 0; i <= manoActual; i++) {
      if (manoData[i] && manosImagenes[i]) {
        let data = manoData[i];
        image(manosImagenes[i], data.x, data.y);
      }

      frameCounter++;
      if (frameCounter % intervaloManos === 0) {
        if (manoActual - manosImagenes.length - 1) {
          manoActual++;
        }
      }
      for (let i = 0; i <= manoActual2; i++) {
        if (manoData2[i] && manosImagenes[i]) {
          let data = manoData2[i];
          image(manosImagenes[i], data.x, data.y);
        }
      }

      frameCounter++;
      if (frameCounter % (intervaloManos + 3) === 0) {
        if (manoActual2 - manosImagenes.length - 1) {
          manoActual2++;
        }
      }

      push();
      imageMode(CENTER);
      image(entrenando, ancho / 2, alto / 2, 650, 367);
      pop();

      if (contador > 120) {
        contador = 0;
        estado = 9;
        manoActual = 0;
        manoActual2 = 0;
      }
    }

    // Incrementa el índice para dibujar una nueva imagen en el siguiente frame
  }
}

function drawEstado9() {
  // Dibujar el fondo y la ventana de alerta
  push();
  blendMode(DIFFERENCE);
  image(imagenes[2], 0, 0, ancho, alto);
  pop();
  ventana2(ancho / 4, alto / 6, 370, "ALERTA");

  // Dibujar la imagen de alerta
  push();
  imageMode(LEFT, TOP);
  image(alerta, ancho / 3.7, alto / 3.7, 190, 190);
  pop();

  // Escribir el texto
  push();
  fill(255);
  textAlign(LEFT, TOP);
  writeText(
    "AHORA LA INTELIGENCIA ARTIFICIAL TIENE LA CAPACIDAD\nDE DETECTAR CUÁNDO UNA MANO ESTÁ ABIERTA\n¡PONGÁMOSLO A  PRUEBA!",
    ancho / 2.3,
    alto / 3.6,
    50,
    0
  );
  pop();

  // Dibujar el botóN
  detectHoverAndClick(
    ancho / 1.25 - 200,
    alto / 1.67 - 150,
    400,
    300,
    0,
    () => {
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 10;
        mostrarventana = 0;
        esperaDeBotones = 0;
      }
    }
  );
  boton("PROBAR", ancho / 1.25, alto / 1.67, 300, 70);
}

function drawEstado10() {
  contador++;

  if (opennessPercentage === undefined) {
    opennessPercentage = 0;
  }

  // Calcular las posiciones ajustadas
  let ventanaX = (ancho - anchorect) / 2; // Mantener la ventana centrada horizontalmente

  // Dibujar la ventana expansible
  ventana2expansible(
    ventanaX,
    ventanaY,
    anchorect,
    altoEstado10,
    "DETECCION AUTOMATICA"
  );

  // Mostrar el porcentaje de mano abierta
  push();
  textAlign(CENTER, TOP);
  fill(255);
  text("MANO ABIERTA DETECTADA AL " + opennessPercentage + "%", ancho / 2, 90);
  pop();

  // Expansión de la ventana
  if (contador > 500) {
    if (altoEstado10 > 500) {
      ventanaY -= 3; // Subir proporcionalmente al cambio de altura
    }
    if (altoEstado10 < 500) {
      // Crece solo en altura hasta llegar a 500
      altoEstado10 += 3;
    } else {
      // Crece tanto en altura como en ancho
      altoEstado10 += 15; // Seguir creciendo en altura
      anchorect += 15; // Crecer en ancho proporcionalmente
    }

    // Limitar el crecimiento
    if (anchorect > ancho * 1.2) {
      agrandar = false; // Detener el crecimiento
      contador = 0;
    }
  }

  // Mostrar estado de expansión para depuración
  push();
  text("Agrandar: " + agrandar, 200, 100);
  pop();

  // Finalización del estado cuando agrandar es falso
  if (agrandar === false) {
    // Fondo negro con logo
    background(0);
    push();
    imageMode(CENTER, CENTER);
    image(logo, ancho / 2, alto / 2);
    pop();

    contador++;
    if (contador > 180) {
      mostrarventana = 0;
      estado12=false;
      estado13=false;
      estado = 11;
      contador = 0;
      agrandar = true;
      altoEstado10 = 150;
      anchorect = 885;
      ventanaY = 10; // Inicia desde la parte superior
    }
  }

  // Llamar a la función para dibujar la caja de texto de la mano abierta
  if (agrandar === true) {
    push();
    drawHandBoxWithText(hands, opennessPercentage + "%\nABIERTA");
    pop();
  }
}

function drawEstado11() {
  //PARA AGILIZAR CORRECCION
  push();
  image(imagenes[6], 0, 0, ancho, alto);
  imageMode(CENTER);
  image(ia, ancho / 3, alto / 2, 350, 350);
  image(tradicional, ancho - ancho / 3, alto / 2 - 12, 350, 350);
  pop();
  push();
  textAlign(LEFT, TOP);

  if (!estado12 || !estado13) {
    if (mostrarventana == 0) {
      ventana1(ancho / 7.8, alto / 5, 150, "COMPARACIÓN");
      fill(255);
      let texto1 = writeText(
        "¡MUY BIEN! YA VIMOS CÓMO FUNCIONA LA DETECCIÓN DEL CUERPO\nMEDIANTE EL USO DEL MACHINE LEARNING",
        ancho / 7,
        alto / 3.7,
        50,
        0
      );
      if (texto1) {
        setTimeout(() => {
          mostrarventana = 1;
          writeText.state = null;
        }, 500); // Cambiar de estado después de que el texto se haya completado
      }
    }
    if (mostrarventana == 1) {
      push();
      ventana1(ancho / 7.8, alto / 5, 150, "COMPARACIÓN");
      ventana1(ancho / 6, alto / 4, 150, "COMPARACIÓN");
      pop();
      let texto1 = writeText(
        "ESTE MÉTODO EXISTE SÓLO HACE ALGUNOS AÑOS, Y SE PROFESIONALIZÓ A LA PAR DE\nLA INTELIGENCIA ARTIFICIAL",
        ancho / 5.3,
        alto / 3,
        50,
        0
      );
      if (texto1) {
        setTimeout(() => {
          mostrarventana = 2;
          writeText.state = null;
        }, 500); // Cambiar de estado después de que el texto se haya completado
      }
    }
    if (mostrarventana == 2) {
      push();
      ventana1(ancho / 7.8, alto / 5, 150, "COMPARACIÓN");
      ventana1(ancho / 6, alto / 4, 150, "COMPARACIÓN");
      ventana1(ancho / 9, alto / 3, 150, "COMPARACIÓN");
      pop();
      let texto1 = writeText(
        "ANTES DEL CRECIMIENTO DE LA IA Y DEL MACHINE LEARNING,\nDETECTAR EL CUERPO HUMANO ERA MUCHO MÁS COMPLEJO",
        ancho / 7.7,
        alto / 2.4,
        50,
        0
      );
      if (texto1) {
        setTimeout(() => {
          writeText.state = null;
          mostrarventana = 3;
        }, 500); // Cambiar de estado después de que el texto se haya completado
      }
    }
    if (mostrarventana == 3) {
      push();
      ventana1(ancho / 7.8, alto / 5, 150, "COMPARACIÓN");
      ventana1(ancho / 6, alto / 4, 150, "COMPARACIÓN");
      ventana1(ancho / 9, alto / 3, 150, "COMPARACIÓN");
      pop();
      let texto1 = writeText(
        "ACCEDÉ A LAS CARPETAS PARA COMPARAR LOS DOS MÉTODOS",
        ancho / 7.7,
        alto / 2.4,
        50,
        0
      );
      if (texto1) {
        setTimeout(() => {
          writeText.state = null;
          mostrarventana = 4;
        }, 3000); // Cambiar de estado después de que el texto se haya completado
      }
    }
  }
  //BOTON IA (IZQ)
  if (mostrarventana == 4) {
    if (!doblecontrol) {
      detectHoverAndClick(ancho / 5.5, alto / 4.5, 400, 350, 0, () => {
        // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
        if (manoCerradaDuracion >= tiempoMaximo) {
          mostrarventana = 2;
          estado = 12; // Cambiar al siguiente estado
          esperaDeBotones = 0;
        }
      });
      if (handInside)
{
  push()
  rectMode(CENTER)
  fill(255, 40)
  stroke(255)
  strokeWeight(3)
  rect(ancho/3, alto/2.2, 300, 270)
  pop()
  if(isHandClosed){
    push()
    rectMode(CENTER)
    fill(100, 100, 255, 40)
    stroke(75, 75, 200, 90)
    strokeWeight(3)
    rect(ancho/3, alto/2.2, 300, 270)
    pop()
  }
}      //BOTON TRADICIONAL (DER)
      detectHoverAndClick(ancho - ancho / 2.1, alto / 4.5, 400, 350, 0, () => {
        // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
        if (manoCerradaDuracion >= tiempoMaximo) {
          mostrarventana = 0;
          estado = 13; // Cambiar al siguiente estado
          esperaDeBotones = 0;
        }
      });
      pop();
    }
    if (handInside)
      {
        push()
        rectMode(CENTER)
        fill(255, 40)
        stroke(255)
        strokeWeight(3)
        rect(ancho/1.5, alto/2.2, 300, 270)
        pop()
        if(isHandClosed){
          push()
          rectMode(CENTER)
          fill(100, 100, 255, 40)
          stroke(75, 75, 200, 90)
          strokeWeight(3)
          rect(ancho/1.5, alto/2.2, 300, 270)
          pop()
        }
      }
    if (estado12 && estado13) {
      detectHoverAndClick(ancho / 2 - 200, alto - alto / 2.5, 400, 300, 0, () => {
        // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
        if (manoCerradaDuracion >= tiempoMaximo) {
          // Cambiar al siguiente estado
          contador = 0;
          manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador

          esperaDeBotones = 0;
          mostrarventana = 5;
        }
      });
      boton("CONCLUSIÓN", ancho / 2, alto / 1.25, 175, 70);
    }
  } else if (mostrarventana == 5) {
    push();
    ventana1(ancho / 8, alto / 4, 400, "CONCLUSIÓN");
    pop();
    push();
    let texto1 = writeText(
      "EL MOTION CAPTURE TRADICIONAL ES IDEAL PARA PROYECTOS QUE NECESITEN GRAN\nDETALLE Y CALIDAD TÉCNICA, MIENTRAS QUE LA CAPTURA CON INTELIGENCIA ARTIFICIAL\nES PERFECTA PARA PROYECTOS RÁPIDOS, ECONÓMICOS O EXPERIMENTALES,\nDONDE SE PRIORICE LA ACCESIBILIDAD ANTES QUE LA PRECISIÓN",
      ancho / 7.3,
      alto / 3,
      10,
      0
    );
    blendMode(MULTIPLY);
    fill(0, 255, 0);
    rect(ancho / 7.3, alto / 2.6, 307, 30);
    rect(ancho / 2.45, alto / 2.25, 500, 30);
    pop();

    // Dibujar el botón
    detectHoverAndClick(
      ancho / 1.35 - 200,
      alto - alto / 3.5 - 150,
      400,
      300,
      0,
      () => {
        if (manoCerradaDuracion >= tiempoMaximo) {
          estado = 14;
          estado12=false;
          estado13=false;
          esperaDeBotones = 0;
          mostrarventana = 0;
          handInside = false;
        }
      }
    );
    boton("CONTINUAR", ancho / 1.35, alto - alto / 3.5, 300, 70);
  }
}

function drawEstado12() {
  push();
  image(imagenes[6], 0, 0, ancho, alto);
  imageMode(CENTER);
  image(pc[mostrarventana], ancho / 2, alto / 2);
  pop();
  //Cambio de estado
  //IZQUIERDA - VIDEO
  detectHoverAndClick(ancho / 5, 10, 400, 330, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      mostrarventana = 2; // Cambiar al siguiente estado
      manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      esperaDeBotones = 0;
    }
  });
  if (handInside && mostrarventana == 3){
    push();
    imageMode(CENTER,CENTER);
    image(pc[7], ancho / 2, alto / 2);
    pop();
  }
  //DATA
  detectHoverAndClick(ancho / 2.8, 10, 400, 330, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      mostrarventana = 3;
      manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      esperaDeBotones = 0;
    }
  });


  push();
  imageMode(CENTER,CENTER);
  if(handInside && mostrarventana == 2){
    image(pc[6], ancho / 2, alto / 2)
  } 
  imageMode(CENTER);
  if (mostrarventana == 2) {
    image(gifMachineLearning, ancho / 2, alto / 2, 575, 293);
  }
  pop()


  

  //Volver
  detectHoverAndClick(ancho / 2 + 75, alto / 3 + 200, 300, 300, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      estado = 11; // Cambiar al siguiente estado
      estado12 = true;
      manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      esperaDeBotones = 0;
      mostrarventana = 4;
    }
  });
  boton("CERRAR", ancho / 1.52, alto / 1.18, 195, 55);
}

function drawEstado13() {
  push();
  image(imagenes[6], 0, 0, ancho, alto);
  imageMode(CENTER);
  image(pc[mostrarventana], ancho / 2, alto / 2);
 
  pop();
  //Cambio de estado
  //VIDEO
  detectHoverAndClick(ancho / 5, 10, 400, 330, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      mostrarventana = 0; // Cambiar al siguiente estado
      manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      esperaDeBotones = 0;
    }
  });
  
  if (handInside && mostrarventana == 1){
    push();
    imageMode(CENTER,CENTER);
    image(pc[5], ancho / 2, alto / 2);
    pop();
  }

 
  //DATA
  detectHoverAndClick(ancho / 2.8, 10, 400, 330, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      mostrarventana = 1;
      manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      esperaDeBotones = 0;
    }
  });
  if (handInside && mostrarventana == 0){
    push();
    imageMode(CENTER,CENTER);
    image(pc[4], ancho / 2, alto / 2);
    pop();
  }

  if (mostrarventana == 0) {
    push();
    imageMode(CENTER,CENTER);
    image(tradicionalFinal, ancho / 2, alto / 2, 575, 321);
    pop();
  }
  detectHoverAndClick(ancho / 2 + 75, alto / 3 + 200, 300, 300, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      estado = 11; // Cambiar al siguiente estado
      estado13 = true;
      manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      esperaDeBotones = 0;
      mostrarventana = 4;
    }
  });
  boton("CERRAR", ancho / 1.52, alto / 1.18, 195, 55);

  drawHandBoxWithText(hands, " ");
}

function drawEstado14() {
  push();
  image(imagenes[7], 0, 0, ancho, alto);
  pop();
  push();
  if (mostrarventana == 0) {
    push();
    ventana2(ancho / 9, alto / 7, 400, "ATENCIÓN");
    pop();
    push();
    imageMode(CENTER);
    image(webcam[0], ancho / 2.2, alto / 2.8, 150, 150);
    pop();
    push();
    textAlign(TOP, LEFT);
    let texto1 = writeText(
      "AHORA QUE YA CONOCES CÓMO LA INTELIGENCIA ARTIFICIAL TRANSFORMÓ LA\nINDUSTRIA DEL CINE Y DE LA PRODUCCIÓN VISUAL CON EFECTOS ESPECIALES,\nVEAMOS CÓMO PODRÍAMOS UTILIZARLA EN ALGO DIVERTIDO",
      ancho / 8,
      alto / 1.9,
      20,
      0
    );

    if (texto1) {
      setTimeout(() => {
        writeText.state = null;
        mostrarventana = 1;
        handInside=false;
        isHandClosed= false;
      }, 1500); // Cambiar de estado después de que el texto se haya completado
    }
  } else if (mostrarventana == 1) {
    push();
    ventana2(ancho / 9, alto / 7, 400, "ATENCIÓN");
    image(webcam[0], ancho / 4, alto / 2.8, 150, 150);
    ventana2(ancho / 4.5, alto / 3, 400, "WEBCAM");
    pop();
    push();
    imageMode(CENTER);
    image(webcam[7], ancho / 3, alto / 1.8, 100, 100);
    pop();
    push();
    textAlign(TOP, LEFT);
    let texto1 = writeText(
      "EN LA SIGUIENTE PANTALLA BUSCÁ LA WEBCAM,\nVAS A PODER PERSONALIZAR TU IMÁGEN Y SACAR UNA FOTO\nCLICKEANDO EN ESTE BOTÓN! SUBILA A TUS REDES Y ETIQUETANOS ;)",
      ancho / 4,
      alto / 1.4,
      20,
      0
    );

    if (texto1) {
      setTimeout(() => {
        writeText.state = null;
        mostrarventana = 2;
      }, 3000); // Cambiar de estado después de que el texto se haya completado
    }
  } else if (mostrarventana == 2) {
    detectHoverAndClick(0, alto / 2.8, 350, 300, 0, () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
        esperaDeBotones = 0;
        estado = 15;
      }
    });
    if (handInside) {
      image(imagenes[8], 0, 0, ancho, alto);
    
    if (isHandClosed) {
      image(imagenes[14], 0, 0, ancho, alto);
    }
  }
  }
  pop();
}

function drawEstado15() {
  push();
  image(imagenes[9], 0, 0, ancho, alto);
  pop();
  push();
  detectHoverAndClick(ancho / 6, alto / 2.3, 350, 300, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      // Cambiar al siguiente estado
      manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      estado = 17;
      esperaDeBotones = 0;
      mostrarventana = -1;
    }
  });
  if (handInside) {
    image(imagenes[15], 0, 0, ancho, alto);
  
  if (isHandClosed) {
    image(imagenes[16], 0, 0, ancho, alto);
  }
}
  pop();
}

//ESTE ESTADO ESTÁ DE MAS, HAY QUE SACARLO. VA DERECHO A LA WEBCAM
function drawEstado16() {
  push();
  image(imagenes[6], 0, 0, ancho, alto);
  image(imagenes[9], 0, 0, ancho, alto);
  pop();
  push();
  detectHoverAndClick(ancho / 2 - 150, alto / 2, 250, 250, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      // Cambiar al siguiente estado
      manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      estado = 17;
      esperaDeBotones = 0;
      mostrarventana = -1;
      contador = 0;
    }
  });
  pop();
}

function drawEstado17() {
  contador++;
  push();
  image(imagenes[10], 0, 0, ancho, alto);
  pop();
  push();
  // for (let i = 0; i < faces.length; i++) {
  //   let face = faces[i];
  //   for (let j = 0; j < face.keypoints.length; j++) {
  //     let keypoint = face.keypoints[j];
  //     fill(0, 255, 0);
  //     noStroke();
  //     circle(keypoint.x, keypoint.y, 5);
  //   }
  // }
  //Boton cerrar
  detectHoverAndClick(ancho - 350, 0, 350, 250, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      estado = 16; // Cambiar al siguiente estado
      manoCerradaDuracion = 1; // Si la mano no está cerrada, reiniciar el contador
      esperaDeBotones = 0;
    }
  });

  if (mostrarventana == -1) {
    if (tam < 10) {
      tam += 0.3;
    } else if (tam > 8) {
      tam = 0;
    }
    for (let i = 0; i < 4; i++) {
      if (c[i] < 255) {
        c[i] += 1;
      } else if (c[i] > 255) {
        c[i] = 0;
      }
    }
    push();
    fill(0);
    textAlign(LEFT, CENTER);
    textSize(40);
    let texto1 = writeText("CALIBRANDO...", ancho / 2 - 50, alto / 5.5, 20, 0);
    pop();
    if (texto1) {
      setTimeout(() => {
        writeText.state = null;
        texto1 = false;
      }, 500); // Cambiar de estado después de que el texto se haya completado
    }
    // Draw all the tracked face points
    for (let i = 0; i < faces.length; i++) {
      let face = faces[i];
      for (let j = 0; j < face.keypoints.length; j++) {
        let keypoint = face.keypoints[j];
        push();
        fill(c[0], c[1], 0);
        noStroke();
        rectMode(CENTER);
        stroke(255);
        rect(keypoint.x, keypoint.y, tam + j / 100, tam + j / 100);
        pop();
      }
    }

    if (contador > 600) {
      mostrarventana = 0;
    }
  }

  //Boton sacar foto
  detectHoverAndClick(ancho / 2.7, alto / 1.4, 300, 250, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      fotoSacada = true;
    }
  });
  push();
  imageMode(CENTER);
  if (handInside) {
    image(webcam[8], ancho / 2, alto / 1.1);
    if (isHandClosed) {
      image(webcam[9], ancho / 2, alto / 1.1);
    }
  }
  pop();

  if (fotoSacada) {
    pausarVideo();
  }
  //Boton der
  detectHoverAndClick(ancho / 1.4, alto / 3, 300, 300, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      if (mostrarventana < 3) {
        mostrarventana += 1; // Cambiar al siguiente estado
      } else if (mostrarventana == 3) {
        mostrarventana = 0;
      }
      manoCerradaDuracion = 1; // Si la mano no está cerrada, reiniciar el contador
      esperaDeBotones = 0;
    }
  });
  push();
  imageMode(CENTER);
  image(webcam[1], ancho / 1.2, alto / 2);
  if (handInside) {
    image(webcam[2], ancho / 1.2, alto / 2);
    if (isHandClosed) {
      image(webcam[3], ancho / 1.2, alto / 2);
    }
  }
  pop();
  //Boton izq
  detectHoverAndClick(ancho / 16, alto / 3, 300, 300, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      if (mostrarventana > 0) {
        mostrarventana -= 1; // Cambiar al siguiente estado
      } else if (mostrarventana == 0) {
        mostrarventana = 3;
      }
      manoCerradaDuracion = 1; // Si la mano no está cerrada, reiniciar el contador
      esperaDeBotones = 0;
    }
  });
  push();
  imageMode(CENTER);
  image(webcam[4], ancho / 6.5, alto / 2);
  if (handInside) {
    image(webcam[5], ancho / 6.5, alto / 2);
    if (isHandClosed) {
      image(webcam[6], ancho / 6.5, alto / 2);
    }
  }
  pop();

  if (mostrarventana == 0) {
    for (let i = 0; i < faces.length; i++) {
      let face = faces[i];
      let keypoint = face.keypoints[6];
      push();
      imageMode(CENTER);
      image(mascara[1], ancho / 2, alto / 2, 1012, 480);
      image(mascara[3], keypoint.x, keypoint.y, 150, 150);
      pop();
    }
  } else if (mostrarventana == 1) {
    for (let i = 0; i < faces.length; i++) {
      let face = faces[i];
      let keypoint = face.keypoints[6];
      push();
      imageMode(CENTER);
      image(mascara[0], ancho / 2, alto / 2, 992, 480);
      image(mascara[4], keypoint.x, keypoint.y, 150, 150);
      pop();
    }
  } else if (mostrarventana == 2) {
    for (let i = 0; i < faces.length; i++) {
      let face = faces[i];
      let keypoint = face.keypoints[6];
      push();
      imageMode(CENTER);
      image(mascara[2], ancho / 2, alto / 2, 840, 480);
      blendMode(MULTIPLY);
      image(mascara[5], keypoint.x, keypoint.y, 150, 150);
      pop();
    }
  } else if (mostrarventana == 3) {
    for (let i = 0; i < faces.length; i++) {
      let face = faces[i];
      let keypoint = face.keypoints[6];
      push();
      imageMode(CENTER);
      image(mascara[6], ancho / 2, alto / 2, 992, 480);
      image(mascara[7], keypoint.x, keypoint.y, 200, 200);
      pop();
    }
  }
}

function drawEstado18() {
  push();
  image(imagenes[10], 0, 0, ancho, alto);
  pop();
  push();
  push();
  ventana2(ancho / 6.5, alto / 7, 350, "FINAL");
  pop();
  push();
  textAlign(TOP, LEFT);
  writeText(
    "GRACIAS POR MIRAR NUESTRA INFOGRAFIA\nELEGÍ SI QUERES VOLVER A LA WEBCAM O FINALIZAR",
    ancho / 5.6,
    alto / 3.6,
    20,
    0
  );

  //WEBCAM

  detectHoverAndClick(ancho / 2 - ancho / 3, alto / 3, 400, 400, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      // Cambiar al siguiente estado
      manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      esperaDeBotones = 0;
      estado = 17;
      mostrarventana = 0;
      contador = 0;
      numText = 5;
      fotoSacada = false;
    }
  });
  boton("WEBCAM", ancho / 2 - ancho / 6, alto / 2, 224, 80);

  //FINALIZAR
  detectHoverAndClick(ancho / 2, alto / 3, 400, 400, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      // Cambiar al siguiente estado
      manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      esperaDeBotones = 0;
      estado = 0;
      mostrarventana = 0;
      contador = 0;
      handInside=false;
    }
  });

  boton("FINALIZAR", ancho / 2 + ancho / 6, alto / 2, 224, 80);
}
function pausarVideo() {
  frameCounter++;

  // Ejecutar cada 30 frames (equivalente a 1 segundo)
  if (frameCounter % 45 === 0) {
    if (numText >= -20) {
      numText--; // Reducir el contador
      tam = 70;
    }
  }

  if (numText > 0) {
    push();
    textAlign(CENTER, CENTER);
    fill(0);
    stroke(255);
    strokeWeight(4);
    textSize((tam += 2));
    text(numText, ancho / 2, alto / 2);
    pop();
  }

  if (numText === 0) {
    video.pause();
  }

  if (numText <= 0) {
    image(imagenes[17], 0, 0);
    push();
    textAlign(LEFT, TOP);
    writeText(
      "COMPARTÍ ESTA FOTO EN INSTAGRAM Y ETIQUETANOS! ;)",
      ancho / 3.5,
      alto / 16,
      30,
      0
    );
  }

  if (numText == -12) {
    estado = 18;
    video.play();
  }
}
