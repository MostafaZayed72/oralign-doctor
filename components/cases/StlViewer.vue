<template>
  <div ref="container" class="w-full h-full relative group">
    <canvas ref="canvas" class="w-full h-full cursor-grab active:cursor-grabbing"></canvas>
    
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 transition-opacity duration-300">
      <div class="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-2"></div>
      <span class="text-[10px] font-black uppercase tracking-widest text-brand-primary animate-pulse">Loading 3D Model...</span>
    </div>

    <!-- Controls Hint -->
    <div class="absolute bottom-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div class="px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[8px] text-white font-bold uppercase tracking-wider flex items-center gap-1">
        <i class="fas fa-mouse-pointer text-[10px]"></i> Orbit
      </div>
      <div class="px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[8px] text-white font-bold uppercase tracking-wider flex items-center gap-1">
        <i class="fas fa-search-plus text-[10px]"></i> Zoom
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const props = defineProps({
  file: { type: [File, String, null], default: null }
})

const container = ref(null)
const canvas = ref(null)
const isLoading = ref(false)

let scene, camera, renderer, controls, mesh, frameId

const init = () => {
  if (!canvas.value) return

  // Scene setup
  scene = new THREE.Scene()
  
  // Dynamic background based on dark mode
  const isDark = document.documentElement.classList.contains('dark')
  scene.background = null // Transparent

  // Camera setup
  const aspect = container.value.clientWidth / container.value.clientHeight
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
  camera.position.set(0, 0, 100)

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvas.value, 
    antialias: true, 
    alpha: true 
  })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)
  
  const pointLight = new THREE.PointLight(0x0D9488, 0.5)
  pointLight.position.set(-5, -5, 5)
  scene.add(pointLight)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = true

  animate()
  loadModel()
}

const loadModel = async () => {
  if (!props.file) return
  
  isLoading.value = true
  const loader = new STLLoader()
  
  try {
    let url
    if (props.file instanceof File) {
      url = URL.createObjectURL(props.file)
    } else {
      url = props.file
    }

    loader.load(url, (geometry) => {
      // Remove old mesh if exists
      if (mesh) {
        scene.remove(mesh)
        mesh.geometry.dispose()
        mesh.material.dispose()
      }

      geometry.center()
      
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x0D9488, 
        specular: 0x111111, 
        shininess: 200,
        flatShading: false
      })
      
      mesh = new THREE.Mesh(geometry, material)
      
      // Auto-scale and position
      geometry.computeBoundingBox()
      const box = geometry.boundingBox
      const size = new THREE.Vector3()
      box.getSize(size)
      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = camera.fov * (Math.PI / 180)
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
      cameraZ *= 1.5 // Zoom out a bit
      camera.position.z = cameraZ
      
      scene.add(mesh)
      isLoading.value = false
      
      // Revoke blob URL
      if (props.file instanceof File) URL.revokeObjectURL(url)
    }, 
    undefined, 
    (error) => {
      console.error('Error loading STL:', error)
      isLoading.value = false
    })
  } catch (e) {
    console.error('Loader failed:', e)
    isLoading.value = false
  }
}

const animate = () => {
  frameId = requestAnimationFrame(animate)
  if (controls) controls.update()
  if (renderer && scene && camera) renderer.render(scene, camera)
}

const handleResize = () => {
  if (!container.value || !camera || !renderer) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

watch(() => props.file, () => {
  loadModel()
})

onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('resize', handleResize)
  if (renderer) renderer.dispose()
  if (mesh) {
    mesh.geometry.dispose()
    mesh.material.dispose()
  }
})
</script>
