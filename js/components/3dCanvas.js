// NOVA CART - 3D WebGL Canvas Component (Fail-Safe Dynamic Import)

export class Canvas3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    // Load Three.js dynamically so network issues never block page execution
    this.initAsync();
  }

  async initAsync() {
    try {
      const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
      this.THREE = THREE;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

      this.init();
    } catch (e) {
      console.warn("3D WebGL Background Canvas not available, fallback to CSS grid background:", e);
    }
  }

  init() {
    const THREE = this.THREE;
    if (!THREE || !this.renderer) return;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 2, 12);
    this.scene.fog = new THREE.FogExp2(0x050711, 0.035);

    // 1. Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0x0b0f19, 2);
    this.scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f3ff, 3, 30);
    cyanLight.position.set(5, 5, 5);
    this.scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 2, 30);
    violetLight.position.set(-5, -3, -2);
    this.scene.add(violetLight);

    // 2. Glowing Floating Particles
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 500 : 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00f3ff);
    const blueColor = new THREE.Color(0x3b82f6);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const mixedColor = Math.random() > 0.5 ? cyanColor : blueColor;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(geometry, particleMaterial);
    this.scene.add(this.particleSystem);

    // 3. Central Abstract NOVA CART 3D Object
    const polyGeometry = new THREE.IcosahedronGeometry(2.2, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.novaObject = new THREE.Mesh(polyGeometry, wireframeMat);
    this.novaObject.position.set(0, 0.5, 0);
    this.scene.add(this.novaObject);

    // Core Glowing Sphere
    const coreGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8
    });
    this.coreSphere = new THREE.Mesh(coreGeo, coreMat);
    this.novaObject.add(this.coreSphere);

    // 4. Cyber Grid Floor
    const gridHelper = new THREE.GridHelper(60, 40, 0x00f3ff, 0x1e293b);
    gridHelper.position.y = -5;
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);

    // Mouse Listeners
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => this.onWindowResize());

    this.animate();
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.camera || !this.renderer) return;

    // Mouse interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    this.camera.position.x = this.mouseX * 1.5;
    this.camera.position.y = 2 - this.mouseY * 1.2;
    this.camera.lookAt(0, 0, 0);

    // Rotate NOVA CART Object
    if (this.novaObject) {
      this.novaObject.rotation.x += 0.003;
      this.novaObject.rotation.y += 0.005;
    }

    // Rotate particle system slowly
    if (this.particleSystem) {
      this.particleSystem.rotation.y += 0.0005;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
