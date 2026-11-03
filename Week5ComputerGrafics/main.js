
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)

const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(3, 2, 4)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5)
directionalLight.position.set(5, 8, 4)
scene.add(ambientLight, directionalLight)

// Controls
const control = new OrbitControls(camera, renderer.domElement)

// Crystal vertices
const positions = new Float32Array([
    0, 1.5, 0,
    0, -1.5, 0,
    1, 0, 0,
    0, 0, 1,
    -1, 0, 0,
    0, 0, -1
])

// Crystal faces
const index = [
    0, 3, 2,
    0, 4, 3,
    0, 5, 4,
    0, 2, 5,

    1, 2, 3,
    1, 3, 4,
    1, 4, 5,
    1, 5, 2
]

// BufferGeometry
const geometry = new THREE.BufferGeometry()
geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)
geometry.setIndex(index)
geometry.computeVertexNormals()

// Crystal mesh
const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
        color: 0x66aaff,
        roughness: 0.4,
        metalness: 0.2,
        side: THREE.DoubleSide
    })
)

scene.add(mesh)

// Non-indexed geometry
const nonIndexed = geometry.toNonIndexed()
nonIndexed.computeVertexNormals()

// Statistics
function showStatistics() {
    let totalMeshes = 0
    let totalVertices = 0
    let totalFaces = 0

    scene.traverse((object) => {
        if (object.isMesh) {
            totalMeshes++

            const geo = object.geometry
            const vertices = geo.getAttribute('position').count

            totalVertices += vertices
            totalFaces += geo.index
                ? geo.index.count / 3
                : vertices / 3
        }
    })

    console.log('Total meshes:', totalMeshes)
    console.log('Total vertices:', totalVertices)
    console.log('Total faces:', totalFaces)
}

showStatistics()

// Press F to switch geometry
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
        mesh.geometry =
            mesh.geometry === geometry ? nonIndexed : geometry

        showStatistics()
    }
})

// Animation
function animate() {
    requestAnimationFrame(animate)

    mesh.rotation.y += 0.007
    mesh.rotation.x += 0.003

    control.update()
    renderer.render(scene, camera)
}

animate()
