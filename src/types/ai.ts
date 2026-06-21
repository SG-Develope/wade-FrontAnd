export interface AiActivities {
  walking: boolean
  fishing: boolean
  cycling: boolean
  camping: boolean
}

export interface AiGuide {
  message: string
  generatedAt: string
  expiresAt?: string
  activities?: AiActivities
}
