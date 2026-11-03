
import * as THREE from 'three'
import { GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js'

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

// GLTF Loader
const loader = new GLTFLoader()
let model = null

loader.load('/model.glb',

    (gltf) => {
        model = gltf.scene
        model.rotation.y = Math.PI
        scene.add(model)

        let totalMeshes = 0
        let totalVertices = 0
        let totalFaces = 0

        model.traverse((object) => {
            if (object.isMesh) {
                totalMeshes++

                const geometry = object.geometry
                const positions = geometry.getAttribute('position')

                if (!positions) return

                const vertices = positions.count
                const faces = geometry.index
                    ? geometry.index.count / 3
                    : vertices / 3

                totalVertices += vertices
                totalFaces += faces

                console.log('Mesh:', object.name || totalMeshes)
                console.log('Vertices:', vertices)
                console.log('Faces:', faces)
                console.log('------------------')
            }
        })

        console.log('Total meshes:', totalMeshes)
        console.log('Total vertices:', totalVertices)
        console.log('Total faces:', totalFaces)
    },

    undefined,

    (error) => {
        console.error('Error loading model:', error)
    }
)

// Animation
function animate() {
    requestAnimationFrame(animate)

    if (model) {
        model.rotation.y += 0.007
    }

    control.update()
    renderer.render(scene, camera)
}

animate()
