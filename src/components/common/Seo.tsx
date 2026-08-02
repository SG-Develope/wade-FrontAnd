
const SITE_URL = "https://wade-flood.netlify.app";
const DEFAULT_OG = `${SITE_URL}/og-image.png`

interface SeoProps {
  /** 페이지 고유 제목. "· WADE" 는 자동으로 붙는다 */
  title: string
  /** 페이지 설명 */
  description: string
  /** 페이지 경로 (예: "/dashboard") */
  path?: string
  /** 개별 OG 이미지가 있으면 지정, 없으면 공통 이미지 */
  image?: string
}

export default function Seo({ title, description, path = '', image = DEFAULT_OG }: SeoProps) {
  const fullTitle = `${title} · WADE`
  const url = `${SITE_URL}${path}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
