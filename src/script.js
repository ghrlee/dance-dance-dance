import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')
const myObject = {
  danceForMe: false,
}
let thing = 0
gui.add(myObject, 'danceForMe')


// Scene
const scene = new THREE.Scene()

const gltfLoader = new GLTFLoader()

let mixer = null

gltfLoader.load(

  '/models/Figure/figure_with_animation.glb',

  (gltf) => {
    mixer = new THREE.AnimationMixer(gltf.scene)

    const action = mixer.clipAction(gltf.animations[thing])
    action.play()
    gltf.scene.scale.set(10, 10, 10)
    gltf.scene.rotation.y = Math.PI * - 0.05
    gltf.scene.position.x = 1
    scene.add(gltf.scene)
  }
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5
  })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
// directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)

directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const leftDirectionalLight = new THREE.DirectionalLight(0x0000FF, 1)
scene.add(leftDirectionalLight)


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1.25)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime
  // console.log(camera.position)
  // console.log(controls.target)

  // update mixer
  if (mixer !== null) {
    mixer.update(deltaTime)

  }

  gui.onChange(value => {
    thing = (myObject.danceForMe === false) ? 0 : 2
    console.log(scene)
    scene.remove(scene.children.pop())

    gltfLoader.load(

      '/models/Figure/figure_with_animation.glb',

      (gltf) => {
        mixer = new THREE.AnimationMixer(gltf.scene)

        const action = mixer.clipAction(gltf.animations[thing])
        action.play()

        gltf.scene.scale.set(10, 10, 10)
        gltf.scene.rotation.y = Math.PI * - 0.05
        gltf.scene.position.x = 1
        scene.add(gltf.scene)
      }
    )
  })

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()