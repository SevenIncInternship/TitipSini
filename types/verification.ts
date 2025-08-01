export interface VerificationState {
  step: "initial" | "loading" | "challenge" | "success" | "error"
  language: string
  challengeType: "checkbox" | "puzzle" | "image"
  attempts: number
  maxAttempts: number
}

export interface ChallengeData {
  question: string
  options?: string[]
  correctAnswer?: string | number
  images?: string[]
}
