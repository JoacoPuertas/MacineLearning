// CALIBRAR: 
// Definir un valor de referencia de distancia máxima para una mano completamente abierta (ajustable según pruebas)
let maxOpenDistance = 80; // Tamaño en px en pantalla de una mano completamente abierta
let minClosedDistance = 20; // Tamaño en px en pantalla de una mano completamente cerrada


let handPose;
let video;
let hands = [];
let estado = 0; // Control de las pantallas/estados
let boton1 = { x: 185, y: 405, w: 200, h: 210 }; // Definimos las coordenadas del botón cuadrado
let estadoMano = ""; // Variable para almacenar el estado de la mano (abierta o cerrada)
let manoCerradaDuracion = 0; // Contador para la duración de la mano cerrada
let tiempoMaximo = 60; // 2 segundos en frames (asumiendo 60 FPS)
let activarGif = false;
let manosImagenes = [];
let manoActual = 0;
let cantidadManos = 19;
let manoData = [];
let manosfinalizada = false;
let intervaloManos = 5;
let frameCounter = 0;
let opennessPercentage;
let ejMotionCapture;
let gifMachineLearning;
let logos = [];
let gifPersona ;
let estadoInterno = 0;
let mascaras = 0;
let mascara = [];
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
  for (let i = 0; i < 14; i++) {
    imagenes[i] = loadImage("data/pantalla" + i + ".png");
  }

  for (let i = 0; i <= 19; i++) {
    manosImagenes[i] = loadImage("data/manos/" + i + ".png");
  }
  ejMotionCapture = loadImage("data/captureMotion.gif");
  gifMachineLearning = loadImage("data/gifmachinelearning.gif");
  gifPersona = loadImage("data/visual.gif");
  for (let i = 0; i <= 5; i++) {
    logos[i] = loadImage("data/logos/logo" + i + ".png");
  }
  
  for (let i = 0; i <= 2; i++) {
    mascara[i] = loadImage("data/mascaras/mascara" + i + ".png");
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

  // pantalla 10
  for (let i = 0; i < manosImagenes.length; i++) {
    manoData.push({
      x: random(-100, ancho),
      y: random(-100,alto)
    });
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
      drawEstado3();
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
        case 19:
        drawEstado19();
        break;
        case 20:
        drawEstado20();
        break;
        case 21:
        drawEstado21();
        break;
        case 22:
        drawEstado22();
        break;
        case 23:
        drawEstado23();
        break;
        case 24:
        drawEstado24();
        break;
        case 25:
        drawEstado25();
        break;
        
        // Llamar a la función con el mensaje deseado
  
    // Agregar más pantallas si es necesario
  }
  drawHandBoxWithText(hands, " ");
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
}

// Callback que recibe las predicciones de las manos
function gotHands(results) {
  hands = results; // Guardar las predicciones de las manos
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
    let isHandClosed = isHandClosedCheck(hand);

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
      if (manoCerradaDuracion >= tiempoMaximo) {
        callback(); // Cambiar de estado después de 2 segundos con la mano cerrada
      }
    } else if (!isHovering) {
      handInside = false;
    }
  }

  if (mostrarBoton) {
    fill(255, 50);
    rect(bx, by, bw, bh);
  }
}
// Función para detectar si la mano está cerrada y calcular el porcentaje de apertura
function isHandClosedCheck(keypoints) {
  let thumbTip = keypoints[4];    // Punta del pulgar
  let indexTip = keypoints[8];    // Punta del dedo índice
  let middleTip = keypoints[12];  // Punta del dedo medio
  let ringTip = keypoints[16];    // Punta del dedo anular
  let pinkyTip = keypoints[20];   // Punta del dedo meñique

  // Medir la distancia entre los dedos
  let distThumbIndex = dist(thumbTip.x, thumbTip.y, indexTip.x, indexTip.y);
  let distIndexMiddle = dist(indexTip.x, indexTip.y, middleTip.x, middleTip.y);
  let distMiddleRing = dist(middleTip.x, middleTip.y, ringTip.x, ringTip.y);
  let distRingPinky = dist(ringTip.x, ringTip.y, pinkyTip.x, pinkyTip.y);

  // Calcular el promedio de las distancias actuales
  let avgDistance = (distThumbIndex + distIndexMiddle + distMiddleRing + distRingPinky) / 4;

  

  // Normalizar el valor entre 0 (cerrada) y 1 (abierta) y convertirlo a porcentaje
  let openness = constrain((avgDistance - minClosedDistance) / (maxOpenDistance - minClosedDistance), 0, 1);
   opennessPercentage = openness * 100; // Convertir a porcentaje

  // Determinar el estado de la mano
  let isClosed = openness < 0.2; // Umbral para considerar la mano como "cerrada"
  estadoMano = isClosed ? "Cerrada" : "Abierta";

  //text( opennessPercentage, 500, 100);

  return  isClosed ; // Devuelve el estado y el porcentaje de apertura
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
  image(gifPersona, ancho/2 + 100, alto/2, 300, 450)
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

function boton(texto, posx, posy, tamx, tamy, r, g, b) {
  push();
  rectMode(CENTER, CENTER);
  textAlign(CENTER, CENTER);
  fill(r, g, b);
  noStroke();
  rect(posx, posy, tamx, tamy);
  fill(255);
  text(texto, posx, posy);
  pop();
}

// Función para dibujar un rectángulo sin relleno alrededor de la mano detectada con texto a la derecha
function drawHandBoxWithText(hands, textMessage) {
  if (hands.length > 0) {
    let hand = hands[0].keypoints;

    // Encontrar el punto más extremo en cada dirección
    let minX = Math.min(...hand.map(kp => kp.x));
    let maxX = Math.max(...hand.map(kp => kp.x));
    let minY = Math.min(...hand.map(kp => kp.y));
    let maxY = Math.max(...hand.map(kp => kp.y));

    // Calcular el ancho y alto del rectángulo
    let rectWidth = maxX - minX;
    let rectHeight = maxY - minY;

    // Dibujar el rectángulo sin relleno
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(minX, minY, rectWidth, rectHeight);

    // Dibujar el texto a la derecha del rectángulo
    noStroke();
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(24);
    text(textMessage, maxX + 10, (minY + maxY) / 2); // Texto centrado verticalmente al lado derecho del rectángulo
  }
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
  detectHoverAndClick(boton1.x, boton1.y, boton1.w, boton1.h, 0, () => {});
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
  detectHoverAndClick(150, 290, 350, 350, 0, () => {
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

function drawEstado3() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[2], 0, 0, ancho, alto);
  pop();
  let texto1 = writeText(
    "¡MUY BIEN!\n YA APRENDISTE LAS MECÁNICAS\n PARA INTERACTUAR CONMIGO",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  if (texto1) {
    setTimeout(() => {
      estado = 4;
    }, 2000); // Cambiar de estado después de que el texto se haya completado
  }
}

function drawEstado4() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[2], 0, 0, ancho, alto);
  pop();
  writeText(
    "¡CADA VEZ QUE QUIERAS\n SELECCIONAR UN BOTÓN,\n DEBERÁS PONER LA MANO SOBRE\n ÉL Y CERRAR EL PUÑO",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  boton("CONTINUAR", ancho / 2, alto - alto / 3, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho / 2 - 150,
    alto - alto / 3 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 5; // Cambiar al siguiente estado
      }
    }
  );

  if (handInside) {
    boton("CONTINUAR", ancho / 2, alto - alto / 3, 300, 100, 51, 160, 72);
  }
}

function drawEstado5() {
  push();
  blendMode(BURN);
  image(imagenes[4], 0, 0, ancho, alto);
  pop();
  writeText(
    "CUANTO SABES SOBREN EL MACHINE LEARNING?",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  boton("RESPONDER", ancho / 2, alto - alto / 3, 300, 100, 160, 51, 142);

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
      }
    }
  );

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

  boton("MUCHO", ancho / 8, alto / 3, 300, 100, 255, 130, 130);
  boton("POCO", ancho / 2, alto / 3, 300, 100, 255, 130, 130);
  boton("NADA", ancho - ancho / 8, alto / 3, 300, 100, 255, 130, 130);

  detectHoverAndClick(ancho / 8 - 150, alto / 3 - 150, 300, 300, 0, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      estado = 7; // Cambiar al siguiente estado
    }
  });
  detectHoverAndClick(ancho / 2 - 150, alto / 3 - 150, 300, 300, 1, () => {
    // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
    if (manoCerradaDuracion >= tiempoMaximo) {
      estado = 7; // Cambiar al siguiente estado
    }
  });
  detectHoverAndClick(
    ancho - ancho / 8 - 150,
    alto / 3 - 150,
    300,
    300,
    1,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 7; // Cambiar al siguiente estado
      }
    }
  );

  if (boton1 == true) {
    boton("MUCHO", ancho / 8, alto / 3, 300, 300, 51, 160, 72);
  }
}

function drawEstado7() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[6], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  let texto1 = writeText(
    "EL MACHINE LEARNING ES\n UN AREA DE LA \n INTELIGENCIA ARTIFICIAL\nQUE PERMITE A LAS\nCOMPUTADORAS ANALIZAR\nGRANDES CANTIDADES DE\nDATOS PARA IDENTIFICAR\nPATRONES Y HACER\nPREDICCIONES O TOMAR\nDECISIONES EN BASE A\nESOS DATOS",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  if (texto1) {
    setTimeout(() => {
      estado = 8;
    }, 2000); // Cambiar de estado después de que el texto se haya completado
  }
}

function drawEstado8() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[6], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "PERO ESTO MUY\nABSTRACTO, VEAMOSLO EN\nUN EJEMPLO CONCRETO",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  boton("CONTINUAR", ancho / 2, alto - alto / 3, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho / 2 - 150,
    alto - alto / 3 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 9; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  if (handInside) {
    boton("CONTINUAR", ancho / 2, alto - alto / 3, 300, 100, 51, 160, 72);
  }
}

function drawEstado9() {
  push();
  blendMode(BURN);
  image(imagenes[7], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "VAMOS A ENTRENAR A LA\nINTELIGENCIA ARTIFICIAL\nPARA QUE DETECTE UNA\nMANO ABIERTA",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  boton("CONTINUAR", ancho / 2, alto - alto / 3, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho / 2 - 150,
    alto - alto / 3 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 10; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  if (handInside) {
    boton("CONTINUAR", ancho / 2, alto - alto / 3, 300, 100, 51, 160, 72);
  }
}
function drawEstado10() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[8], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "EL PRIMER PASO, ES\nMOSTRARLE EJEMPLOS\nDE QUÉ ES\nUNA MANO ABIERTA",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  boton("ENTRENARLA", ancho / 2, alto - alto / 3, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho / 2 - 150,
    alto - alto / 3 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        activarGif = true;
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  if (handInside) {
    boton("ENTRENARLA", ancho / 2, alto - alto / 3, 300, 100, 51, 160, 72);
  }

  if (activarGif && estado == 10) {
    if (!manosfinalizada) {
      for(let i = 0; i <=manoActual; i++){
        if (manoData[i] && manosImagenes[i]) {
          let data = manoData[i];
          image(manosImagenes[i], data.x, data.y);
        }
      }

      frameCounter++;
      if(frameCounter % intervaloManos === 0){
        if(manoActual - manosImagenes.length - 1 ){
          manoActual++;
        } else {
          manosfinalizada = true;
        }
      }
    } else {
      estado = 11;
    }

    // Incrementa el índice para dibujar una nueva imagen en el siguiente frame
  }
}

function drawEstado11() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[9], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "AHORA LA INTELIGENCIA\nARTIFICIAL TIENE LA\nCAPACIDAD DE DETECTAR\nCUANDO UNA MANO ESTÁ\nABIERTA... PROBEMOSLO\nEN TIEMPO REAL",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  boton("DETECTAR", ancho / 2, alto - alto / 3, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho / 2 - 150,
    alto - alto / 3 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 12; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  if (handInside) {
    boton("DETECTAR", ancho / 2, alto - alto / 3, 300, 100, 51, 160, 72);
  }
}

function drawEstado12() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[10], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "¡ABRÍ TU MANO!",
    ancho / 2,
    alto / 8 -10,
    50,
    0
  );

  boton("CONTINUAR", ancho - ancho / 7, alto - alto / 8, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho - ancho / 7 - 150,
    alto - alto / 8 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 13; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  if (handInside) {
    boton("CONTINUAR", ancho - ancho / 7, alto - alto / 8, 300, 100, 51, 160, 72);
  }

  
  // Llamar a la función con el mensaje deseado
  drawHandBoxWithText(hands, "Mano abierta:" + opennessPercentage);
}

function drawEstado13() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[11], 0, 0, ancho, alto);
  pop();
 let texto1 = writeText(
    "!MUY BIEN!\n YA APRENDISTE CÓMO FUNCIONA \nLA INTELIGENCIA ARTIFICIAL \nQUE DETECTA AL CUERPO HUMANO",
    ancho / 2,
    alto / 4,
    50,
    0
  );
  if (texto1) {
    setTimeout(() => {
      estado = 14;
    }, 2000); // Cambiar de estado después de que el texto se haya completado
  }
}

function drawEstado14() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[11], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "AHORA VEAMOS\nCÓMO SE APLICA EN EL CINE",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  boton("CONTINUAR", ancho / 2, alto - alto / 3, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho / 2 - 150,
    alto - alto / 3 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 15; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  if (handInside) {
    boton("CONTINUAR", ancho / 2, alto - alto / 3, 300, 100, 51, 160, 72);
  }
}

function drawEstado15() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[13], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  let texto1= writeText(
    "ANTES EN EL CINE SE USABAN\nTRAJES Y PRODUCTOS MUY COSTOSOS",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  
  if (texto1) {
    setTimeout(() => {
      estado = 16;
    }, 2000); // Cambiar de estado después de que el texto se haya completado
  }
}

function drawEstado16() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[13], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "ADEMÁS, LLEVABAN MUCHO TIEMPO DE\nEJECUCIÓN PARA DETECTAR EL\nMOVIMIENTO DE PERSONAS",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  boton("VER EJEMPLOS", ancho - ancho / 7, alto - alto / 8, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho - ancho / 7 - 150,
    alto - alto / 8 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 17; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  if (handInside) {
    boton("VER EJEMPLOS", ancho - ancho / 7, alto - alto / 8, 300, 100, 51, 160, 72);
  }

  
}

function drawEstado17() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[13], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  
  boton("CONTINUAR", ancho - ancho / 7, alto - alto / 8, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho - ancho / 7 - 150,
    alto - alto / 8 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 18; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  push();
  imageMode(CENTER);
  image (ejMotionCapture, ancho/2, alto/2.5, ancho-ancho/6, alto- alto/3);
  pop();

  if (handInside) {
    boton("CONTINUAR", ancho - ancho / 7, alto - alto / 8, 300, 100, 51, 160, 72);
  }

}


function drawEstado18() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[13], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "ACTUALMENTE, LA IA ESTÁ\nREEMPLAZANDO ESTOS\n PROCESOS LARGOS Y COSTOSOS",
    ancho / 2,
    alto / 4,
    50,
    0
  );

  boton("CONTINUAR", ancho / 2, alto - alto / 7, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho / 2 - 150,
    alto - alto / 7 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 19; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  if (handInside) {
    boton("CONTINUAR", ancho / 2, alto - alto / 7, 300, 100, 51, 160, 72);
  }
}


function drawEstado19() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[13], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "EL MACHINE LEARNING ESTÁ GENERANDO MUCHOS AVANCES\n EN EL MUNDO DEL CINE Y DE LOS EFECTOS ESPECIALES",
    ancho / 2,
    alto / 9,
    50,
    0
  );

  boton("CONTINUAR", ancho / 2, alto - alto / 7, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho / 2 - 150,
    alto - alto / 7 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 20; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );
push();
imageMode(CENTER);
  image(gifMachineLearning, ancho/2, alto/2 );
  pop();

  if (handInside) {
    boton("CONTINUAR", ancho / 2, alto - alto / 7, 300, 100, 51, 160, 72);
  }
}

function drawEstado20() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[13], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "COMPAREMOS ESTOS DOS",
    ancho / 2,
    alto / 9,
    50,
    0
  );

  boton("COMPARAR", ancho / 2, alto/3 - 25, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho / 2 - 150,
    alto/3 - 25 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 21; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );
push();
imageMode(CENTER);
image(gifMachineLearning, ancho/4 + 50, alto- alto/3 - 50, 500, 250 );
image(ejMotionCapture, ancho - ancho/4 - 50, alto- alto/3 - 50, 500, 250 );
  pop();

  if (handInside) {
    boton("COMPARAR", ancho / 2, alto/3 - 25, 300, 100, 51, 160, 72);
  }
}

function drawEstado21() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[4], 0, 0, ancho, alto);
  pop();
  push();
  imageMode(CENTER,CENTER);
  image(logos[0], ancho/2, 0 + 100, 150,150);
  image(logos[1], ancho/2, alto/2 - 100 ,100,100);
  image(logos[2], ancho/2, alto/2 + 80, 100,100);
  image(logos[3], ancho/2, alto - 100, 125,125);
  pop();
  detectHoverAndClick(
    ancho / 2 - 150,
    0 + 100 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estadoInterno = 1;
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );
  detectHoverAndClick(
    ancho / 2 - 150,
    alto/2 - 100 - 100,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estadoInterno = 2;
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );
  detectHoverAndClick(
    ancho / 2 - 150,
    alto/2 + 80 - 100,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estadoInterno = 3;
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );
  detectHoverAndClick(
    ancho / 2 - 150,
    alto - 100 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estadoInterno = 4;
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );
  push();
  rectMode(LEFT,LEFT);
  if (estadoInterno == 1) {
    fill(0,50,255,50);
    stroke(2);
    rect(50,50,ancho/2 - 125, alto - 100);
    rect(ancho/2 + 75,50,ancho/2 - 125, alto - 100);
    fill(255);
    textAlign(CENTER,CENTER);
    text("aca irian graficos", ancho/4,alto/2);
    text("aca irian graficos", ancho - ancho/4,alto/2);
  } else if (estadoInterno == 2) {
    fill(250,55,50,50);
    stroke(2);
    rect(50,50,ancho/2 - 125, alto - 100);
    rect(ancho/2 + 75,50,ancho/2 - 125, alto - 100);
    fill(255);
    textAlign(CENTER,CENTER);
    text("aca irian graficos", ancho/4,alto/2);
    text("aca irian graficos", ancho - ancho/4,alto/2);

  } else if (estadoInterno == 3) {
    fill(50,250,55,50);
    stroke(2);
    rect(50,50,ancho/2 - 125, alto - 100);
    rect(ancho/2 + 75,50,ancho/2 - 125, alto - 100);
    fill(255);
    textAlign(CENTER,CENTER);
    text("aca irian graficos", ancho/4,alto/2);
    text("aca irian graficos", ancho - ancho/4,alto/2);

  } else if (estadoInterno == 4) {
    fill(255,255,25,50);
    stroke(2);
    rect(50,50,ancho/2 - 125, alto - 100);
    rect(ancho/2 + 75,50,ancho/2 - 125, alto - 100);
    fill(255);
    textAlign(CENTER,CENTER);
    text("aca irian graficos", ancho/4,alto/2);
    text("aca irian graficos", ancho - ancho/4,alto/2);

  }
  pop();

  boton("CONTINUAR", ancho - ancho / 7, alto - alto / 8, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho - ancho / 7 - 150,
    alto - alto / 8 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 22; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  if (handInside) {
    boton("CONTINUAR", ancho - ancho / 7, alto - alto / 8, 300, 100, 51, 160, 72);
  }
}

function drawEstado22() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[13], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "¡AHORA QUE YA CONOCES COMO LA\nINTELIGENCIA ARTIFICIAL\nTRANSFORMA EL CINE, VEAMOS\nCOMO PODRIAMOS UTILIZAR ESTA\nTECNOLOGIA EN ALGO DIVERTIDO",
    ancho / 2,
    alto / 9,
    50,
    0
  );

  boton("CONTINUAR", ancho - ancho / 7, alto - alto / 8, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho - ancho / 7 - 150,
    alto - alto / 8 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 23; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  if (handInside) {
    boton("CONTINUAR", ancho - ancho / 7, alto - alto / 8, 300, 100, 51, 160, 72);
  }
}
function drawEstado23() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[13], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "PARA ESTA ULTIMA PARTE, VAS A\nPODER ELEGIR UN PERSONAJE\nPARA JUGAR",
    ancho / 2,
    alto / 9,
    50,
    0
  );

  boton("ELEGIR", ancho - ancho / 7, alto - alto / 8, 300, 100, 160, 51, 142);

  detectHoverAndClick(
    ancho - ancho / 7 - 150,
    alto - alto / 8 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 24; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  if (handInside) {
    boton("ELEGIR", ancho - ancho / 7, alto - alto / 8, 300, 100, 51, 160, 72);
  }

  
}
function drawEstado24() {
  push();
  imageMode(CENTER,CENTER);
  image(logos[4], ancho/2 - 300, alto/2);
  image(logos[5], ancho/2 + 300, alto/2);
  pop();
  //FLECHAS ZONE
  detectHoverAndClick(
    ancho/2 - 300 - 150,
    alto/2 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        mascaras--;
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );
  detectHoverAndClick(
    ancho/2 + 300 - 150,
    alto/2 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        mascaras++;
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );

  //CONTINUAR ZONE
  push();
  imageMode(CENTER,CENTER);
  if(mascaras == 0){
    image(mascara[0], ancho/2,alto/3, 250,300);
  } else if (mascaras == 1 ){
    image(mascara[1], ancho/2,alto/3, 250,300);
  } else if (mascaras == 2 ){
    image(mascara[2], ancho/2,alto/6, 250,300);
  }
pop();
  boton("ELEGIR", ancho - ancho / 7, alto - alto / 8, 300, 100, 160, 51, 142);
  detectHoverAndClick(
    ancho - ancho / 7 - 150,
    alto - alto / 8 - 150,
    300,
    300,
    0,
    () => {
      // Si la mano permanece cerrada durante el tiempo máximo, cambiamos de estado
      if (manoCerradaDuracion >= tiempoMaximo) {
        estado = 25; // Cambiar al siguiente estado
        manoCerradaDuracion = 0; // Si la mano no está cerrada, reiniciar el contador
      }
    }
  );
  if (handInside) {
    boton("ELEGIR", ancho - ancho / 7, alto - alto / 8, 300, 100, 51, 160, 72);
  }
}

function drawEstado25() {
  push();
  blendMode(DIFFERENCE);
  image(imagenes[4], 0, 0, ancho, alto);
  pop();
  textAlign(CENTER, TOP);
  writeText(
    "ACA IRIA EL JUEGO (?",
    ancho / 2,
    alto / 2,
    50,
    0
  );
  
}