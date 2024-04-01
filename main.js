import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();


// Luzes do ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(200, 500, 300);
scene.add(dirLight);

// Camara
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 150;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
  cameraWidth / -2, // esquerda
  cameraWidth / 2, // direita
  cameraHeight / 2, // cima
  cameraHeight / -2, // baixo
  0, // plano perto
  1000 // plano longe
);
camera.position.set(200, 200, 200);
camera.lookAt(0, 10, 0);

// Cores
const green = 0x08A045;
const blue = 0x006FB9;
const yellow = 0xEFCC00;
const black = 0x000000;
const white = 0xFFFFFF;
const red = 0xa52523;


// Pista
const road = createRoad();
scene.add(road);

// Carros
const car = createCar();
scene.add(car);

const ecar1 = createEnemyCar(blue);
const ecar2 = createEnemyCar(green);
const ecar3 = createEnemyCar(yellow);

ecar1.position.x = -100;
ecar2.position.x = -150;
ecar3.position.x = -130;

ecar1.position.z = -20;
ecar2.position.z = 20;
ecar3.position.z = 0;


scene.add(ecar1);
scene.add(ecar2);
scene.add(ecar3);


// renderizar
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

 var controls = new OrbitControls( camera, renderer.domElement );
   
// Animação
renderer.setAnimationLoop(() => {
  carColision(car, ecar1, 0.2, -120);
  carColision(car, ecar2, 0.4, -140);
  carColision(car, ecar3, 0.2, -150);
  renderer.render(scene, camera);
});

document.body.appendChild(renderer.domElement);

// Carro principal
function createCar() {
  const car = new THREE.Group();

  const backWheel = createWheels();
  backWheel.position.y = 1;
  backWheel.position.x = -3;
  car.add(backWheel);

  const frontWheel = createWheels();
  frontWheel.position.y = 1;
  frontWheel.position.x = 3;
  car.add(frontWheel);

  const main = new THREE.Mesh(
    new THREE.BoxGeometry(10, 2, 5),
    new THREE.MeshLambertMaterial({ color: red })
  );
  main.position.y = 2;
  car.add(main);
  
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(5, 1.5, 4.5),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  
  
  cabin.position.x = 2;
  cabin.position.y = 3;
  car.add(cabin);

  return car;
}

// Criar carro na contramão
function createEnemyCar(color) {
  const car = new THREE.Group();

  // Pneus 
  const backWheel = createWheels();
  backWheel.position.y = 1;
  backWheel.position.x = -3;
  car.add(backWheel);

  const frontWheel = createWheels();
  frontWheel.position.y = 1;
  frontWheel.position.x = 3;
  car.add(frontWheel);

  // Corpo do carro
  const main = new THREE.Mesh(
    new THREE.BoxGeometry(10, 2, 5),
    new THREE.MeshLambertMaterial({ color: color })
  );
  main.position.y = 2;
  car.add(main);
  
  // Bulé do carro
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(5, 1.5, 4.5),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  
  
  cabin.position.x = -2;
  cabin.position.y = 3;
  car.add(cabin);

  return car;
}


function createWheels() {
  // Raio  = 1.5
  const geometry = new THREE.CylinderGeometry( 1.5, 1.5, 6, 20); 
  // Rotacioando o eixo X em 90º
  geometry.rotateX( Math.PI / 2 ); // orient along z-axis - required
  const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const wheel = new THREE.Mesh(geometry, material);
  
  return wheel;
}

function createRoad() {
  const geometry = new THREE.BoxGeometry(300, 60, 1);
  // Rotacionando o eixo X em 90º 
  geometry.rotateX( Math.PI / 2 );
  const roadTexture = getRoadTexture();

  const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const line = new THREE.MeshLambertMaterial({ map: roadTexture });
  
    var materials = [ material, material, material, material,material, line ];

  const road = new THREE.Mesh(geometry, materials);
  
  road.position.x = 0;
  road.position.y = -1;
  
  return road;
}

function getRoadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 60;
  const context = canvas.getContext("2d");

  // Desenhando as linhas da estrada
  context.fillStyle = '#ff00ff';
  for (var i = 0; i < 300; i=i+15) {
     context.fillRect(i, 20, 10, 1);
   }
  for (var i = 0; i < 300; i=i+15) {
     context.fillRect(i, 40, 10, 1);
   }
  
  // Meio fio da pista
  context.strokeStyle = '#ff00ff';
  context.strokeRect(0, 0, canvas.width, canvas.height);

  

  return new THREE.CanvasTexture(canvas);
}

// Usar as setas para mudar de posição
window.addEventListener('keydown', function(e){
  if ((e.code === 'ArrowLeft') && (car.position.z === 0))
    car.position.z = 20; // Ta no centro, vai para a direita
  if ((e.code === 'ArrowLeft') && (car.position.z === -20))
    car.position.z = 0;  // Ta na esquerda, vai para o centro
  if ((e.code === 'ArrowRight') && (car.position.z === 0))
    car.position.z = -20; // Ta no centro, vai para a esquerda
  if ((e.code === 'ArrowRight') && (car.position.z === 20))
    car.position.z = 0;  // Ta na direita, vai para o centro
  if ((e.code === 'ArrowUp'))
     car.position.x -= 0.9; // Acelera Rubinho
});

 function carColision(mycar, enemycar,velocity, reset) {
   const posX1 = mycar.position.x;
   const posX2 = enemycar.position.x;
   const posZ1 = mycar.position.z;
   const posZ2 = enemycar.position.z;
   
   const posX1_right = mycar.position.x + 5;
   const posX1_left = mycar.position.x - 5;
   const posX2_right = enemycar.position.x + 5;
   const posX2_left = enemycar.position.x - 5;
   
   
   if(posX1_right > posX2_left && posX1_left < posX2_right && posZ1 === posZ2 ) {
       mycar.rotation.y = -0.5;
       enemycar.rotation.y = 0.5;
       document.getElementById('output').innerHTML = "Game Over";
   } else {  
     enemycar.position.x +=velocity;  
     // Carro volta pra pista
     if (posX2_left > 150){ enemycar.position.x = reset; }
     }
  }