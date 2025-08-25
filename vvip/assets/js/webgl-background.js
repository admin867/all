// 3D WebGL Particle Background using Three.js
const THREE = window.THREE // Declare the THREE variable

class WebGLBackground {
  constructor() {
    this.canvas = document.getElementById("webgl-canvas")
    this.scene = null
    this.camera = null
    this.renderer = null
    this.particles = null
    this.particleCount = 1000
    this.mouse = { x: 0, y: 0 }
    this.targetMouse = { x: 0, y: 0 }
    this.time = 0
    this.isPaused = false
    this.animationId = null

    this.init()
    this.addEventListeners()
    this.animate()

    console.log("[v0] WebGL background initialized")
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene()

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 5

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Create particles
    this.createParticles()

    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0x00ffff, 0.3)
    this.scene.add(ambientLight)

    // Add point light
    const pointLight = new THREE.PointLight(0xff0080, 1, 100)
    pointLight.position.set(0, 0, 10)
    this.scene.add(pointLight)
  }

  createParticles() {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(this.particleCount * 3)
    const colors = new Float32Array(this.particleCount * 3)
    const sizes = new Float32Array(this.particleCount)

    // Color palette for particles
    const colorPalette = [
      new THREE.Color(0x00ffff), // Cyan
      new THREE.Color(0xff0080), // Magenta
      new THREE.Color(0x8000ff), // Purple
      new THREE.Color(0xffffff), // White
    ]

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3

      // Position
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 20
      positions[i3 + 2] = (Math.random() - 0.5) * 20

      // Color
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      // Size
      sizes[i] = Math.random() * 3 + 1
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    // Particle material with custom shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2() },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform vec2 mouse;
        
        void main() {
          vColor = color;
          
          vec3 pos = position;
          
          // Wave motion
          pos.x += sin(time * 0.5 + position.y * 0.1) * 0.5;
          pos.y += cos(time * 0.3 + position.x * 0.1) * 0.3;
          pos.z += sin(time * 0.7 + position.x * 0.05 + position.y * 0.05) * 0.2;
          
          // Mouse interaction
          vec2 mouseInfluence = mouse * 0.1;
          pos.x += mouseInfluence.x * (1.0 - distance(position.xy, mouse) * 0.1);
          pos.y += mouseInfluence.y * (1.0 - distance(position.xy, mouse) * 0.1);
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    this.particles = new THREE.Points(geometry, material)
    this.scene.add(this.particles)
  }

  addEventListeners() {
    // Mouse movement
    window.addEventListener("mousemove", (event) => {
      this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    })

    // Window resize
    window.addEventListener("resize", () => {
      this.handleResize()
    })

    // Scroll parallax
    window.addEventListener("scroll", () => {
      const scrollY = window.pageYOffset
      if (this.particles) {
        this.particles.rotation.x = scrollY * 0.0005
        this.particles.rotation.y = scrollY * 0.0003
      }
    })
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate() {
    if (!this.isPaused) {
      this.animationId = requestAnimationFrame(() => this.animate())

      this.time += 0.01

      // Smooth mouse following
      this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05
      this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05

      if (this.particles) {
        // Update shader uniforms
        this.particles.material.uniforms.time.value = this.time
        this.particles.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y)

        // Rotate particles
        this.particles.rotation.x += 0.0005
        this.particles.rotation.y += 0.0003

        // Camera movement
        this.camera.position.x = Math.sin(this.time * 0.1) * 0.5
        this.camera.position.y = Math.cos(this.time * 0.15) * 0.3
        this.camera.lookAt(this.scene.position)
      }

      this.renderer.render(this.scene, this.camera)
    }
  }

  pause() {
    this.isPaused = true
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  resume() {
    this.isPaused = false
    this.animate()
  }

  dispose() {
    if (this.particles) {
      this.particles.geometry.dispose()
      this.particles.material.dispose()
      this.scene.remove(this.particles)
    }
    if (this.renderer) {
      this.renderer.dispose()
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  // Method to adjust particle density based on performance
  adjustQuality() {
    const fps = this.getFPS()
    if (fps < 30 && this.particleCount > 500) {
      this.particleCount = Math.max(500, this.particleCount * 0.8)
      this.createParticles()
      console.log("[v0] Reduced particle count for performance:", this.particleCount)
    }
  }

  getFPS() {
    // Simple FPS counter
    const now = performance.now()
    const delta = now - (this.lastTime || now)
    this.lastTime = now
    return 1000 / delta
  }
}

// Initialize WebGL background when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check for WebGL support
  if (window.WebGLRenderingContext) {
    try {
      window.webglBackground = new WebGLBackground()

      // Performance monitoring
      setTimeout(() => {
        if (window.webglBackground) {
          window.webglBackground.adjustQuality()
        }
      }, 5000)
    } catch (error) {
      console.warn("[v0] WebGL not supported, falling back to CSS background")
      document.getElementById("webgl-canvas").style.display = "none"
    }
  } else {
    console.warn("[v0] WebGL not supported")
    document.getElementById("webgl-canvas").style.display = "none"
  }
})
