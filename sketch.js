let handPose;
let video;
let hands = [];
let frameSkip = 3;  // Realizar predicciones cada 3 cuadros
let frameCounter = 0;
let image1;
let image2;
let gif;
let ancho = 1280;
let alto = 720;
let estado = 0;
let keypoints = [];  // Arreglo para almacenar todos los puntos clave
let rectX = 185;
let rectY = 405;
let rectWidth = 200;
let rectHeight = 210;
let lastDetectionTime = 0;  // Para controlar el tiempo de la última detección
let handInsideTimer = 0;  // Temporizador para contar el tiempo que la mano está dentro del rectángulo
let handInside = false;  // Estado que indica si la mano está dentro del rectángulo

function preload() {
  handPose = ml5.handPose();
  image1 = loadImage("data/pantalla1.png");
  image2 = loadImage("data/pantalla1B.png");
  gif = loadImage("data/gifcarga.gif");
}

function setup() {
  createCanvas(ancho, alto);
  // Crear el video y reducir su tamaño para mejorar el rendimiento
  video = createCapture(VIDEO);
  video.size(ancho, alto);  // Tamaño más pequeño para procesar más rápido
  video.hide();

  // Iniciar la detección de manos en el video
  handPose.detectStart(video, gotHands);
}

function draw() {
  // Dibujar el video a escala en el canvas completo
  image(video, 0, 0, ancho, alto);

  // Control de predicciones: Ejecutar cada `frameSkip` cuadros
  if (frameCounter % frameSkip === 0) {
    // Procesar la predicción de manos solo si ha pasado cierto tiempo (para no sobrecargar la CPU)
    let currentTime = millis();
    if (currentTime - lastDetectionTime > 100) {  // Solo hacer una predicción cada 100ms (10 FPS)
      handPose.detect(video, gotHands);
      lastDetectionTime = currentTime;
    }
  }
  frameCounter++;

  // Lógica de estados
  if (estado == 0) {
    // Solo hacer la comprobación si hay manos detectadas
    if (hands.length > 0) {
      let handDetected = false;  // Variable para saber si alguna mano está dentro del rectángulo

      // Iterar sobre las manos detectadas
      for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        let allPointsInside = true; // Variable para verificar si todos los puntos de esta mano están dentro del rectángulo

        // Verificar si todos los puntos clave de esta mano están dentro del rectángulo
        for (let j = 0; j < hand.keypoints.length; j++) {
          let kp = hand.keypoints[j];

          // Verificar si el punto está dentro del rectángulo
          if (!(kp.x >= rectX && kp.x <= rectX + rectWidth && kp.y >= rectY && kp.y <= rectY + rectHeight)) {
            allPointsInside = false;  // Si algún punto no está dentro, cambiar a false
            break;  // Salir del ciclo, no necesitamos seguir verificando
          }
        }

        // Si todos los puntos de esta mano están dentro, cambiar el estado
        if (allPointsInside) {
          handDetected = true;  // Al menos una mano está dentro del rectángulo
          break;  // No es necesario seguir verificando otras manos, ya encontramos una dentro
        }
      }

      // Si al menos una mano está dentro, pintamos el rectángulo y comenzamos el temporizador
      if (handDetected) {
        fill("#00FFFF75");  // Color del rectángulo cuando al menos una mano está dentro
        handInside = true;  // La mano está dentro del rectángulo
      } else {
        noFill();  // Si ninguna mano está dentro, el rectángulo está sin color
        handInside = false;  // La mano no está dentro del rectángulo
      }

      // Dibujar el rectángulo
      rect(rectX, rectY, rectWidth, rectHeight);

      // Mostrar imagen y zona de interacción
      image(image1, 0, 0, ancho, alto);

      // Si la mano está dentro del rectángulo, contar el tiempo
      if (handInside) {
        handInsideTimer += deltaTime;  // `deltaTime` es el tiempo en milisegundos entre el frame actual y el anterior
        push();
        blendMode(SCREEN);
        image(gif, ancho / 2, alto / 2, 150,150); // Centrar el GIF
        pop();

        // Si han pasado 3 segundos (3000 ms), cambiar al estado 1
        if (handInsideTimer >= 2700) {
          estado = 1;  // Cambiar a estado 1
          handInsideTimer = 0;  // Reiniciar el temporizador
        }
      } else {
        // Si la mano salió del rectángulo, reiniciar el temporizador
        handInsideTimer = 0;
      }
    } else {
      // Si no hay manos, asegurarnos de que el rectángulo no se pinte y el temporizador se resetee
      noFill();  // No pintar el rectángulo si no hay manos
      handInsideTimer = 0;  // Reiniciar el temporizador si no hay manos
    }
  }

  // Otras lógicas para los estados adicionales (estado 1, 2, etc.)...
  if (estado == 1) {
    // Cambiar al estado 1, por ejemplo, mostrar otro tipo de información o imagen
    push();
    blendMode(DIFFERENCE);
    image(image2, 0, 0, ancho, alto);
    pop();
  }

  // Dibujar los puntos de las manos detectadas
  push();
  for (let i = 0; i < keypoints.length; i++) {
    let keypoint = keypoints[i];
    fill(0, 255, 0);
    noStroke();
    circle(keypoint.x, keypoint.y, 10);  // Dibujar los puntos clave en verde
  }
  pop();
}

// Callback de detección de manos
function gotHands(results) {
  hands = results;
  keypoints = [];  // Limpiar puntos clave antes de agregar nuevos
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let kp = hand.keypoints[j];
      keypoints.push(kp);  // Guardar todos los puntos clave
    }
  }
}
