import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Bot, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  Eye, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Activity, 
  Compass, 
  ChevronDown, 
  ChevronUp,
  X
} from 'lucide-react';

interface ThreeCommandDeckProps {
  onClose: () => void;
  onSelectAgentTab?: (tab: string) => void;
}

export const ThreeCommandDeck: React.FC<ThreeCommandDeckProps> = ({ onClose, onSelectAgentTab }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedAgent, setSelectedAgent] = useState<'JOB' | 'PRIORITY' | 'QA' | 'SYNC'>('JOB');
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // Active metrics for the selected satellite
  const agentDetails = {
    JOB: {
      name: 'Job Automation Agent',
      color: '#06B6D4',
      status: 'Active · 12 Portals Online',
      quota: '14 / 25 Daily Dispatched',
      action: 'ATS LaTeX Compiler nominal (Score 96%)',
      tab: 'job-agent'
    },
    PRIORITY: {
      name: 'Dynamic Prioritizer',
      color: '#F59E0B',
      status: 'Recalculating Score Matrix',
      quota: '7 Tasks in Execution Queue',
      action: 'Impact-Urgency Vector Balanced',
      tab: 'prioritization'
    },
    QA: {
      name: 'Autonomous QA Architect',
      color: '#F43F5E',
      status: 'Continuous Staging Verification',
      quota: '48 Playwright Specs Executed',
      action: 'Zero unhandled regressions',
      tab: 'qa-agent'
    },
    SYNC: {
      name: 'Cross-Platform Sync Bus',
      color: '#10B981',
      status: 'Vector Clocks Reconciled',
      quota: '12 Duplicate Posts Intercepted',
      action: '3-Way Semantic Hash Synced',
      tab: 'sync'
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070a13);
    scene.fog = new THREE.FogExp2(0x070a13, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Studio PBR Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0x38bdf8, 0x020617, 1.2);
    scene.add(hemisphereLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(8, 14, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    scene.add(keyLight);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 3, 15);
    cyanPoint.position.set(0, 0, 0);
    scene.add(cyanPoint);

    // 3. Procedural Starfield & Particle Field (Zero External Assets)
    const particleCount = 600;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 40;
      particlePositions[i + 1] = (Math.random() - 0.5) * 30;
      particlePositions[i + 2] = (Math.random() - 0.5) * 40;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 4. Ground Telemetry Grid
    const gridHelper = new THREE.GridHelper(30, 30, 0x0ea5e9, 0x1e293b);
    gridHelper.position.y = -3;
    scene.add(gridHelper);

    // 5. Central Autonomous Orchestration Reactor (Composite 8-Part Procedural Model)
    const reactorGroup = new THREE.Group();

    // Part 1: Core Polyhedron Energy Crystal
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.castShadow = true;
    reactorGroup.add(coreMesh);

    // Part 2: Inner Core Wireframe Lattice
    const coreWireGeo = new THREE.IcosahedronGeometry(1.28, 1);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const coreWireMesh = new THREE.Mesh(coreWireGeo, coreWireMat);
    reactorGroup.add(coreWireMesh);

    // Part 3: Outer Gimbal Ring (Torus)
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.08, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.95,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    reactorGroup.add(ring1);

    // Part 4: Middle Gimbal Ring
    const ring2Geo = new THREE.TorusGeometry(2.0, 0.06, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.85,
      roughness: 0.3,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 4;
    reactorGroup.add(ring2);

    // Part 5: Inner Gimbal Ring
    const ring3Geo = new THREE.TorusGeometry(1.6, 0.05, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 3;
    reactorGroup.add(ring3);

    // Part 6 & 7: Top and Bottom Magnetic Waveguide Emitters
    const emitterGeo = new THREE.CylinderGeometry(0.2, 0.4, 1.2, 16);
    const emitterMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.3 });
    const topEmitter = new THREE.Mesh(emitterGeo, emitterMat);
    topEmitter.position.y = 2.1;
    reactorGroup.add(topEmitter);

    const bottomEmitter = new THREE.Mesh(emitterGeo, emitterMat);
    bottomEmitter.position.y = -2.1;
    bottomEmitter.rotation.z = Math.PI;
    reactorGroup.add(bottomEmitter);

    scene.add(reactorGroup);

    // 6. Four Orbiting Agent Satellites (Composite 4-Part Procedural Models)
    interface SatelliteData {
      group: THREE.Group;
      angle: number;
      speed: number;
      radius: number;
      type: 'JOB' | 'PRIORITY' | 'QA' | 'SYNC';
    }

    const satellites: SatelliteData[] = [];

    const createSatellite = (colorHex: number, emissiveHex: number, type: 'JOB' | 'PRIORITY' | 'QA' | 'SYNC', radius: number, speed: number, startAngle: number) => {
      const satGroup = new THREE.Group();

      // Main Pod Body
      const bodyGeo = new THREE.BoxGeometry(0.6, 0.3, 0.4);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.3
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      satGroup.add(body);

      // Core Energy Lens
      const lensGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const lensMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: emissiveHex,
        emissiveIntensity: 1.0,
        roughness: 0.1,
        metalness: 0.9
      });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.position.z = 0.22;
      satGroup.add(lens);

      // Solar Communication Wings
      const wingGeo = new THREE.BoxGeometry(0.04, 0.7, 0.3);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.4 });
      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      leftWing.position.x = -0.45;
      satGroup.add(leftWing);

      const rightWing = new THREE.Mesh(wingGeo, wingMat);
      rightWing.position.x = 0.45;
      satGroup.add(rightWing);

      // Antenna Probe
      const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
      const antMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 1.0, roughness: 0.2 });
      const ant = new THREE.Mesh(antGeo, antMat);
      ant.position.y = 0.35;
      satGroup.add(ant);

      satGroup.userData = { agentType: type };
      scene.add(satGroup);

      satellites.push({
        group: satGroup,
        angle: startAngle,
        speed,
        radius,
        type
      });
    };

    // Instantiate 4 specialized agent drones
    createSatellite(0x06b6d4, 0x0891b2, 'JOB', 4.8, 0.45, 0);
    createSatellite(0xf59e0b, 0xd97706, 'PRIORITY', 5.6, 0.35, Math.PI * 0.5);
    createSatellite(0xf43f5e, 0xe11d48, 'QA', 6.4, 0.28, Math.PI);
    createSatellite(0x10b981, 0x059669, 'SYNC', 7.2, 0.22, Math.PI * 1.5);

    // 7. Raycasting for Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let parent = hit.object.parent;
        while (parent && parent !== scene) {
          if (parent.userData?.agentType) {
            setSelectedAgent(parent.userData.agentType);
            return;
          }
          parent = parent.parent;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // 8. Damped Camera Motion & Mouse Drag
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let cameraAngleX = 0;
    let cameraAngleY = 0.4;
    let targetDistance = 14;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      cameraAngleX -= deltaX * 0.005;
      cameraAngleY = Math.max(0.1, Math.min(Math.PI / 2.2, cameraAngleY + deltaY * 0.005));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e: WheelEvent) => {
      targetDistance = Math.max(7, Math.min(25, targetDistance + e.deltaY * 0.01));
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: true });

    // 9. Resize Handling
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Lossless 60fps Animation Loop with Scratch Variables
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const time = clock.getElapsedTime();

      // Rotate Central Core Gimbal Rings
      coreMesh.rotation.y += 0.8 * dt;
      coreMesh.rotation.x += 0.4 * dt;
      coreWireMesh.rotation.y -= 0.6 * dt;
      ring1.rotation.z += 0.5 * dt;
      ring2.rotation.y += 0.7 * dt;
      ring3.rotation.x += 0.9 * dt;

      // Pulse Central Core Scale subtly
      const pulse = 1.0 + Math.sin(time * 3) * 0.05;
      coreMesh.scale.set(pulse, pulse, pulse);

      // Orbit Satellites
      satellites.forEach(sat => {
        sat.angle += sat.speed * dt;
        sat.group.position.x = Math.cos(sat.angle) * sat.radius;
        sat.group.position.z = Math.sin(sat.angle) * sat.radius;
        sat.group.position.y = Math.sin(time * 2 + sat.radius) * 0.4;
        sat.group.lookAt(0, sat.group.position.y * 0.5, 0);
      });

      // Camera Exponential Damping
      if (autoRotate && !isDragging) {
        cameraAngleX += 0.15 * dt;
      }
      const camX = Math.sin(cameraAngleX) * Math.cos(cameraAngleY) * targetDistance;
      const camY = Math.sin(cameraAngleY) * targetDistance;
      const camZ = Math.cos(cameraAngleX) * Math.cos(cameraAngleY) * targetDistance;

      camera.position.x += (camX - camera.position.x) * (1 - Math.exp(-6 * dt));
      camera.position.y += (camY - camera.position.y) * (1 - Math.exp(-6 * dt));
      camera.position.z += (camZ - camera.position.z) * (1 - Math.exp(-6 * dt));
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('pointerdown', onPointerDown);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);

      // Dispose Geometries and Materials
      particleGeometry.dispose();
      particleMaterial.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      renderer.dispose();
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, [autoRotate]);

  const activeInfo = agentDetails[selectedAgent];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden">
      {/* Full-Bleed Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Command Header */}
      <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-3 pointer-events-auto bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Compass className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white">3D Autonomous Command Deck</h2>
            <p className="text-[10px] text-slate-400 font-mono">Three.js PBR Engine · Studio Lighting · 60fps</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              autoRotate ? 'bg-cyan-950 border-cyan-600 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 inline mr-1 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>Orbit {autoRotate ? 'On' : 'Paused'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            title="Exit 3D Command Deck"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Collapsible Telemetry Dock (<= 15% Viewport Footprint) */}
      <div className="mt-auto relative z-10 p-4 sm:p-6 pointer-events-none flex justify-center">
        <div className="w-full max-w-4xl bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden">
          {/* Dock Header Bar */}
          <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeInfo.color }} />
              <span className="font-extrabold text-white text-xs sm:text-sm">{activeInfo.name}</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">· {activeInfo.status}</span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Satellite Selector Buttons */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
                {(['JOB', 'PRIORITY', 'QA', 'SYNC'] as const).map(key => (
                  <button
                    key={key}
                    onClick={() => setSelectedAgent(key)}
                    className={`px-2 py-0.5 rounded font-bold transition ${
                      selectedAgent === key ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsDockCollapsed(!isDockCollapsed)}
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                {isDockCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Dock Body Content */}
          {!isDockCollapsed && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Execution Quota</span>
                <span className="text-white font-mono font-bold mt-1 block">{activeInfo.quota}</span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Real-Time Autonomous Action</span>
                <span className="text-cyan-300 font-mono font-bold mt-1 block truncate">{activeInfo.action}</span>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => {
                    onClose();
                    if (onSelectAgentTab) onSelectAgentTab(activeInfo.tab);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect in Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
