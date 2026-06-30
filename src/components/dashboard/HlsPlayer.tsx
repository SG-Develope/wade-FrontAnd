import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface Props {
  src: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  controls?: boolean
  playsInline?: boolean
  onError?: () => void
}

export default function HlsPlayer({ src, className, autoPlay = true, muted = true, controls = false, playsInline = true, onError }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) video.play().catch(() => {})
      })
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) {
          onError?.()
          hls.destroy()
        }
      })
      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      if (autoPlay) video.play().catch(() => {})
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      className={className}
      muted={muted}
      controls={controls}
      playsInline={playsInline}
    />
  )
}
