// Calcule le tempo d'un morceau en arrière-plan, sans bloquer l'affichage de la page
import { estimerTempoFichier } from './audio'

type Message = { sampleRate: number; canaux: Float32Array[] }

self.onmessage = (e: MessageEvent<Message>) => {
  const { sampleRate, canaux } = e.data
  const tempo = estimerTempoFichier({
    sampleRate,
    numberOfChannels: canaux.length,
    getChannelData: (canal) => canaux[canal],
  })
  ;(self as unknown as Worker).postMessage(tempo)
}