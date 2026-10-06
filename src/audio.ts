// Partage l'analyse du son entre le lecteur, le fond 3D du hero et le panneau de données

let analyseur: AnalyserNode | null = null
let donnees: Uint8Array<ArrayBuffer> | null = null

export function enregistrerAnalyseur(a: AnalyserNode | null) {
  analyseur = a
  donnees = a ? new Uint8Array(new ArrayBuffer(a.frequencyBinCount)) : null
}

function lire() {
  if (!analyseur || !donnees) return false
  analyseur.getByteFrequencyData(donnees)
  return true
}

// Moyenne d'une bande de fréquences, entre 0 et 1
function bande(fMin: number, fMax: number) {
  const hzParCase = analyseur!.context.sampleRate / analyseur!.fftSize
  const debut = Math.max(0, Math.floor(fMin / hzParCase))
  const fin = Math.min(donnees!.length, Math.max(debut + 1, Math.ceil(fMax / hzParCase)))
  let somme = 0
  for (let i = debut; i < fin; i++) somme += donnees![i]
  return somme / (fin - debut) / 255
}

// Niveaux entre 0 et 1 : basses (20–250 Hz), médiums (250–2 000 Hz) et aigus (2–8 kHz)
export function lireNiveaux() {
  if (!lire()) return { basses: 0, mediums: 0, aigus: 0 }
  return { basses: bande(20, 250), mediums: bande(250, 2000), aigus: bande(2000, 8000) }
}

// Spectre réparti sur une échelle logarithmique, comme l'oreille l'entend (40 Hz à 12 kHz)
export function lireSpectre(nombre: number): number[] {
  if (!lire()) return Array.from({ length: nombre }, () => 0)
  const hzParCase = analyseur!.context.sampleRate / analyseur!.fftSize
  const resultat: number[] = []
  for (let i = 0; i < nombre; i++) {
    const fMin = 40 * Math.pow(12000 / 40, i / nombre)
    const fMax = 40 * Math.pow(12000 / 40, (i + 1) / nombre)
    const debut = Math.floor(fMin / hzParCase)
    const fin = Math.max(debut + 1, Math.ceil(fMax / hzParCase))
    let max = 0
    for (let j = debut; j < fin && j < donnees!.length; j++) max = Math.max(max, donnees![j])
    resultat.push(max / 255)
  }
  return resultat
}

// Transformée de Fourier rapide (FFT), en place, sur des tableaux de taille puissance de 2
function fft(re: Float64Array, im: Float64Array) {
  const n = re.length
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1
    for (; j & bit; bit >>= 1) j ^= bit
    j ^= bit
    if (i < j) {
      ;[re[i], re[j]] = [re[j], re[i]]
      ;[im[i], im[j]] = [im[j], im[i]]
    }
  }
  for (let taille = 2; taille <= n; taille <<= 1) {
    const angle = (-2 * Math.PI) / taille
    const wr = Math.cos(angle)
    const wi = Math.sin(angle)
    for (let debut = 0; debut < n; debut += taille) {
      let cr = 1
      let ci = 0
      for (let k = 0; k < taille / 2; k++) {
        const a = debut + k
        const b = a + taille / 2
        const tr = re[b] * cr - im[b] * ci
        const ti = re[b] * ci + im[b] * cr
        re[b] = re[a] - tr
        im[b] = im[a] - ti
        re[a] += tr
        im[a] += ti
        const ncr = cr * wr - ci * wi
        ci = cr * wi + ci * wr
        cr = ncr
      }
    }
  }
}

// Estimation du tempo d'un morceau à partir de son fichier décodé.
// 1. Flux spectral : on découpe le son en tranches de 46 ms, on calcule leur spectre (FFT)
//    et on mesure à chaque tranche la hausse d'énergie sur toutes les fréquences : ce sont les attaques.
// 2. Autocorrélation : on cherche l'intervalle auquel ces attaques se répètent le mieux, entre 80 et 175 BPM,
//    en tenant compte des répétitions à 2, 3 et 4 temps.
export type SonDecode = {
  sampleRate: number
  numberOfChannels: number
  getChannelData: (canal: number) => Float32Array
}

export function estimerTempoFichier(audio: SonDecode): number | null {
  const sr = audio.sampleRate
  const canaux = Array.from({ length: audio.numberOfChannels }, (_, c) => audio.getChannelData(c))
  const taille = 2048
  const saut = 512
  const n = Math.floor((canaux[0].length - taille) / saut)
  if (n < 400) return null
  const dt = saut / sr

  const fenetre = new Float64Array(taille)
  for (let i = 0; i < taille; i++) fenetre[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (taille - 1))

  const cases = taille / 2
  let precedent = new Float64Array(cases)
  const attaques = new Float64Array(n)
  const re = new Float64Array(taille)
  const im = new Float64Array(taille)

  for (let f = 0; f < n; f++) {
    const debut = f * saut
    for (let i = 0; i < taille; i++) {
      let x = 0
      for (const c of canaux) x += c[debut + i]
      re[i] = (x / canaux.length) * fenetre[i]
      im[i] = 0
    }
    fft(re, im)
    const actuel = new Float64Array(cases)
    let flux = 0
    for (let k = 1; k < cases; k++) {
      actuel[k] = Math.log(1 + 100 * Math.hypot(re[k], im[k]))
      flux += Math.max(0, actuel[k] - precedent[k])
    }
    attaques[f] = f === 0 ? 0 : flux
    precedent = actuel
  }

  // On retire la tendance lente (moyenne glissante sur 0,5 s) pour ne garder que le rythme
  const demiFenetre = Math.round(0.25 / dt)
  const cumul = new Float64Array(n + 1)
  for (let i = 0; i < n; i++) cumul[i + 1] = cumul[i] + attaques[i]
  const rythme = new Float64Array(n)
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - demiFenetre)
    const b = Math.min(n, i + demiFenetre)
    rythme[i] = attaques[i] - (cumul[b] - cumul[a]) / (b - a)
  }

  const lagMin = Math.floor(60 / 175 / dt)
  const lagMax = Math.ceil(60 / 80 / dt)
  const correlations = new Float64Array(4 * lagMax + 6)
  for (let lag = lagMin - 1; lag < correlations.length; lag++) {
    let somme = 0
    for (let i = 0; i + lag < n; i++) somme += rythme[i] * rythme[i + lag]
    correlations[lag] = somme / (n - lag)
  }
  // Un vrai tempo se répète aussi à 2, 3 et 4 temps : on additionne ces échos
  const score = (lag: number) =>
    correlations[lag] + correlations[2 * lag] / 2 + correlations[3 * lag] / 3 + correlations[4 * lag] / 4
  // Légère préférence pour les tempos autour de 120 BPM, les plus courants
  const preference = (lag: number) => Math.exp(-0.5 * Math.log2(60 / (lag * dt) / 120) ** 2)

  let meilleur = lagMin
  for (let lag = lagMin; lag <= lagMax; lag++) if (score(lag) * preference(lag) > score(meilleur) * preference(meilleur)) meilleur = lag

  // Interpolation parabolique pour gagner en précision entre deux intervalles
  const [a, b, c] = [correlations[meilleur - 1], correlations[meilleur], correlations[meilleur + 1]]
  const denominateur = a - 2 * b + c
  const decalage = denominateur < 0 ? Math.max(-0.5, Math.min(0.5, (0.5 * (a - c)) / denominateur)) : 0
  return 60 / ((meilleur + decalage) * dt)
}