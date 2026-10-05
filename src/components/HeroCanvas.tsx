import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Surface d'eau en 3D faite de points de données.
// Le relief est calculé par la carte graphique (shader), ce qui permet d'animer
// des dizaines de milliers de points sans ralentir la page.

const vertexShader = /* glsl */ `
  uniform float uTemps;
  uniform vec2 uSouris;
  uniform float uTaille;
  varying float vHauteur;
  varying float vProfondeur;

  void main() {
    vec3 p = position;
    float vague = sin(p.x * 0.32 + uTemps * 0.9) * 0.55
                + cos(p.y * 0.26 - uTemps * 0.7) * 0.45
                + sin((p.x + p.y) * 0.17 + uTemps * 0.5) * 0.35;

    // Onde circulaire autour de la souris
    float d = distance(p.xy, uSouris);
    vague += sin(d * 1.1 - uTemps * 3.0) * 0.45 * exp(-d * 0.22);

    p.z = vague;
    vHauteur = vague;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vProfondeur = -mv.z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uTaille * (14.0 / -mv.z);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uCouleur;
  uniform vec3 uCrete;
  varying float vHauteur;
  varying float vProfondeur;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;

    float bord = smoothstep(0.5, 0.1, r);
    float crete = smoothstep(0.3, 1.3, vHauteur);
    vec3 couleur = mix(uCouleur, uCrete, crete);
    float brouillard = smoothstep(60.0, 14.0, vProfondeur);

    gl_FragColor = vec4(couleur, bord * brouillard * (0.35 + 0.65 * crete));
  }
`

function couleurCss(nom: string, secours: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(nom).trim() || secours
}

export default function HeroCanvas() {
  const conteneur = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const boite = conteneur.current
    if (!boite) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' })
    } catch {
      return // WebGL indisponible : le hero s'affiche simplement sans fond animé
    }

    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    boite.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    camera.position.set(0, 5.5, 16)
    const cible = new THREE.Vector3(0, 0, -6)
    camera.lookAt(cible)

    // Grille de 241 × 141 points couchée comme une surface d'eau
    const geometrie = new THREE.PlaneGeometry(90, 60, 240, 140)
    const uniforms = {
      uTemps: { value: 0 },
      uSouris: { value: new THREE.Vector2(999, 999) },
      uTaille: { value: 2.4 * dpr },
      uCouleur: { value: new THREE.Color(couleurCss('--chlore', '#7fd1c7')) },
      uCrete: { value: new THREE.Color(couleurCss('--crete', '#ece6d8')) },
    }
    const materiau = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    })
    const points = new THREE.Points(geometrie, materiau)
    points.rotation.x = -Math.PI / 2
    points.position.z = -12
    scene.add(points)

    // Suivi de la souris : on projette le pointeur sur la surface
    const rayon = new THREE.Raycaster()
    const sol = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const pointeur = new THREE.Vector2()
    const impact = new THREE.Vector3()
    const sourisCible = new THREE.Vector2(999, 999)
    let parallaxe = 0
    let parallaxeLisse = 0

    const bouger = (e: PointerEvent) => {
      const zone = boite.getBoundingClientRect()
      pointeur.x = ((e.clientX - zone.left) / zone.width) * 2 - 1
      pointeur.y = -((e.clientY - zone.top) / zone.height) * 2 + 1
      parallaxe = pointeur.x
      rayon.setFromCamera(pointeur, camera)
      if (rayon.ray.intersectPlane(sol, impact)) {
        // Conversion en coordonnées de la grille (qui est tournée et décalée)
        sourisCible.set(impact.x, -(impact.z - points.position.z))
      }
    }

    const rendre = () => renderer.render(scene, camera)

    const redimensionner = () => {
      const largeur = boite.clientWidth
      const hauteur = boite.clientHeight
      if (!largeur || !hauteur) return
      renderer.setSize(largeur, hauteur, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = largeur / hauteur
      // Sur mobile (écran étroit), on recule un peu pour garder la vague visible
      camera.fov = largeur < 700 ? 70 : 55
      camera.updateProjectionMatrix()
      if (reduit) rendre()
    }

    // Les couleurs suivent le thème bleu marin / bleu ciel
    const mettreAJourCouleurs = () => {
      uniforms.uCouleur.value.set(couleurCss('--chlore', '#7fd1c7'))
      uniforms.uCrete.value.set(couleurCss('--crete', '#ece6d8'))
      if (reduit) rendre()
    }
    const themeObservateur = new MutationObserver(mettreAJourCouleurs)
    themeObservateur.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    // On met l'animation en pause quand le hero n'est plus visible
    let visible = true
    const visibiliteObservateur = new IntersectionObserver(([entree]) => {
      visible = entree.isIntersecting
    })
    visibiliteObservateur.observe(boite)

    const tailleObservateur = new ResizeObserver(redimensionner)
    tailleObservateur.observe(boite)
    redimensionner()

    let raf = 0
    let dernier = performance.now()
    const boucle = (maintenant = performance.now()) => {
      raf = requestAnimationFrame(boucle)
      const delta = Math.min((maintenant - dernier) / 1000, 0.05)
      dernier = maintenant
      if (!visible || document.hidden) return
      uniforms.uTemps.value += delta
      uniforms.uSouris.value.lerp(sourisCible, 0.08)
      parallaxeLisse += (parallaxe - parallaxeLisse) * 0.04
      camera.position.x = parallaxeLisse * 2.2
      camera.lookAt(cible)
      rendre()
    }

    if (reduit) {
      uniforms.uTemps.value = 1.5
      rendre()
    } else {
      window.addEventListener('pointermove', bouger)
      boucle()
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', bouger)
      themeObservateur.disconnect()
      visibiliteObservateur.disconnect()
      tailleObservateur.disconnect()
      geometrie.dispose()
      materiau.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={conteneur} aria-hidden="true" className="absolute inset-0" />
}