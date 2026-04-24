<template>
  <div class="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <canvas ref="canvas" class="absolute inset-0 w-full h-full opacity-60 dark:opacity-40 blur-[80px] sm:blur-[120px] transition-opacity duration-1000"></canvas>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'

const canvas = ref(null)
let renderer, scene, camera, animationFrameId

onMounted(() => {
  if (!canvas.value) return

  // 1. Scene Setup
  scene = new THREE.Scene()

  // 2. Camera Setup
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 20

  // 3. Renderer Setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    alpha: true,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 4. Create Animated Spheres
  const spheres = []
  
  // Premium muted colors that blend well when blurred
  const colors = [
    0x063C31, // Brand Primary (Deep Green)
    0xD1B06B, // Brand Gold
    0x105E4E, // Mid Green
    0xE5C88B, // Light Gold
    0x022C24  // Very Dark Green
  ]

  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.SphereGeometry(Math.random() * 4 + 4, 32, 32)
    const material = new THREE.MeshBasicMaterial({ 
      color: colors[i % colors.length],
      transparent: true,
      opacity: 0.8
    })
    
    const sphere = new THREE.Mesh(geometry, material)
    
    // Random initial positions spread across the screen
    sphere.position.x = (Math.random() - 0.5) * 30
    sphere.position.y = (Math.random() - 0.5) * 20
    sphere.position.z = (Math.random() - 0.5) * 10
    
    // Store custom animation properties
    sphere.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.02
      ),
      originalScale: sphere.scale.clone()
    }
    
    scene.add(sphere)
    spheres.push(sphere)
  }

  // 5. Animation Loop
  const clock = new THREE.Clock()

  const animate = () => {
    const elapsedTime = clock.getElapsedTime()

    spheres.forEach((sphere, index) => {
      // Gentle floating motion
      sphere.position.add(sphere.userData.velocity)

      // Bounce off invisible boundaries to keep them on screen
      if (Math.abs(sphere.position.x) > 20) sphere.userData.velocity.x *= -1
      if (Math.abs(sphere.position.y) > 15) sphere.userData.velocity.y *= -1
      if (Math.abs(sphere.position.z) > 10) sphere.userData.velocity.z *= -1

      // Subtle breathing scale effect
      const scaleVariation = Math.sin(elapsedTime * 0.5 + index) * 0.2 + 1
      sphere.scale.copy(sphere.userData.originalScale).multiplyScalar(scaleVariation)
    })

    renderer.render(scene, camera)
    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  // 6. Handle Resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', handleResize)

  // Cleanup
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    cancelAnimationFrame(animationFrameId)
    
    // Dispose resources
    spheres.forEach(sphere => {
      sphere.geometry.dispose()
      sphere.material.dispose()
    })
    renderer.dispose()
  })
})
</script>
