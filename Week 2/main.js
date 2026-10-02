import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(4, 3, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

scene.add(new THREE.AxesHelper(3));

const control = new OrbitControls(camera, renderer.domElement);


const origin = new THREE.Vector3(0, 0, 0);
const a = new THREE.Vector3(2, 1, 0);
const  b = new THREE.Vector3(0, 2, 0);
const arrA = new THREE.ArrowHelper(a.clone().normalize(), origin, a.length(), 0xfE8431C, 0.35, 0.2);
const arrB = new THREE.ArrowHelper(b.clone().normalize(), origin, b.length(), 0x140FF, 0.35, 0.2);

scene.add(arrA);
scene.add(arrB);


const sum = new THREE.Vector3().addVectors(a, b);
const dot = a.dot(b);
const arrSum = new THREE.ArrowHelper(sum.clone().normalize(), origin, sum.length(), 0x3ECF8E, 0.35, 0.2);

scene.add(arrSum);

console.log('a+b =', sum, 'a.b =', dot);

const gui = new GUI();
const params = {
    aX: a.x, aY: a.y,aZ: a.z,    
    bX: b.x, bY: b.y,bZ: b.z,
    sum:'',
    dot:'',
    cross:'',
    crossLength:'',
    angel:'',


}
//folder for vector a
const afolder = gui.addFolder('Vector a');
afolder.add(params,'aX',-5,5, 0.1).name ('X').onChange((value)=>{a.x = value; updateVectors();});
afolder.add(params,'aY',-5,5, 0.1).name ('Y').onChange((value)=>{a.y = value; updateVectors();});       
afolder.add(params,'aZ',-5,5, 0.1).name ('Z').onChange((value)=>{a.z = value; updateVectors();});
//folder for vector b
const bfolder = gui.addFolder('Vector b');
bfolder.add(params,'bX',-5,5, 0.1).name ('X').onChange((value)=>{b.x = value; updateVectors();});
bfolder.add(params,'bY',-5,5, 0.1).name ('Y').onChange((value)=>{b.y = value; updateVectors();});       
bfolder.add(params,'bZ',-5,5, 0.1).name ('Z').onChange((value)=>{b.z = value; updateVectors();});

const results = gui.addFolder('Results');
results.add(params,'sum').name('a + b').disable();
results.add(params,'dot').name('a . b').disable();
results.add(params,'cross').name('a x b').disable();
results.add(params,'crossLength').name('|a x b|').disable();
results.add(params,'angel').name('degree').disable();
results.open();

function updateVectors() {
    arrA.setDirection(a.clone().normalize());
    arrA.setLength(a.length, 0.35, 0.3);
    arrB.setDirection(b.clone().normalize());
    arrB.setLength(b.length, 0.35, 0.3);

    //a+b
    sum.addVectors(a, b);
    arrSum.setDirection(sum.clone().normalize());
    arrSum.setLength(sum.length, 0.35, 0.3);

    //dot

    const dot = a.dot(b);
    const cross = new THREE.Vector3().crossVectors(a, b);
    const crossLength = cross.length()
    const cos = THREE.MathUtils.clamp(dot / (a.length() * b.length()), -1, 1);
    const angle = THREE.MaterialUtils.radToDeg(Math.acos(cos));
    params.sum = '(${sum.x}, ${sum.y}, ${sum.z})';
    params.dot = dot;
    params.cross = '(${cross.x}, ${cross.y}, ${cross.z})';
    params.crossLength = crossLength;
    params.angel = angle;

    results.controllersRecursive.forEach(controller => controller.updateDisplay());
    controller.updateDisplay();
  


}


function animate() {
    requestAnimationFrame(animate);

    control.update();

    renderer.render(scene, camera);
}

animate();