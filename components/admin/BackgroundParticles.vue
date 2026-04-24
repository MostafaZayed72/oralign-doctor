<template>
  <canvas ref="canvas" class="fixed inset-0 -z-10 pointer-events-none"></canvas>
</template>

<script setup>
const canvas = ref(null)
const colorMode = useColorMode()
let renderer, scene, camera, points, material, THREE

const init = async () => {
  if (!canvas.value) return

  // Dynamically import Three.js only on client
  THREE = await import('three')

  // Scene setup
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Particles
  const count = 60
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  material = new THREE.PointsMaterial({
    size: 0.12,
    color: colorMode.value === 'dark' ? 0xffffff : 0x0D9488,
    transparent: true,
    opacity: colorMode.value === 'dark' ? 0.15 : 0.25,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  })

  points = new THREE.Points(geometry, material)
  scene.add(points)

  animate()
}

// React to theme changes
watch(() => colorMode.value, (newTheme) => {
  if (material) {
    material.color.setHex(newTheme === 'dark' ? 0xffffff : 0x0D9488)
    material.opacity = newTheme === 'dark' ? 0.15 : 0.25
  }
})

const animate = () => {
  requestAnimationFrame(animate)
  
  if (points) {
    points.rotation.y += 0.0005
    points.rotation.x += 0.0002
    
    // Subtle float movement
    const time = Date.now() * 0.0001
    points.position.y = Math.sin(time) * 0.1
  }

  renderer.render(scene, camera)
}

const handleResize = () => {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (renderer) renderer.dispose()
})
</script>
