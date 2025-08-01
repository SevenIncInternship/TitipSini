"use client"

import { useState, useCallback } from "react"
import type { VerificationState, ChallengeData } from "@/types/verification" // Updated import

export function useVerification() {
  const [state, setState] = useState<VerificationState>({
    step: "initial",
    language: "english",
    challengeType: "checkbox",
    attempts: 0,
    maxAttempts: 3,
  })

  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null)

  const startVerification = useCallback(async () => {
    setState((prev) => ({ ...prev, step: "loading" }))

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate random challenge
    const challenges = [
      {
        question: "Please check the box to verify you're human",
        type: "checkbox" as const,
      },
      {
        question: "What is 5 + 3?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2,
        type: "puzzle" as const,
      },
      {
        question: "Select all images with traffic lights",
        images: [
          "/placeholder.svg?height=100&width=100&text=Traffic+Light",
          "/placeholder.svg?height=100&width=100&text=Car",
          "/placeholder.svg?height=100&width=100&text=Building",
          "/placeholder.svg?height=100&width=100&text=Traffic+Light",
        ],
        correctAnswer: [0, 3],
        type: "image" as const,
      },
    ]

    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)]

    setChallengeData(randomChallenge)
    setState((prev) => ({
      ...prev,
      step: "challenge",
      challengeType: randomChallenge.type,
    }))
  }, [])

  const submitChallenge = useCallback(
    async (answer: any) => {
      setState((prev) => ({ ...prev, step: "loading" }))

      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simple validation logic
      let isCorrect = false

      if (state.challengeType === "checkbox") {
        isCorrect = answer === true
      } else if (state.challengeType === "puzzle") {
        isCorrect = answer === challengeData?.correctAnswer
      } else if (state.challengeType === "image") {
        isCorrect = JSON.stringify(answer?.sort()) === JSON.stringify(challengeData?.correctAnswer?.sort())
      }

      if (isCorrect) {
        setState((prev) => ({ ...prev, step: "success" }))
      } else {
        const newAttempts = state.attempts + 1
        if (newAttempts >= state.maxAttempts) {
          setState((prev) => ({ ...prev, step: "error", attempts: newAttempts }))
        } else {
          setState((prev) => ({ ...prev, attempts: newAttempts }))
          // Restart with new challenge
          startVerification()
        }
      }
    },
    [state, challengeData, startVerification],
  )

  const changeLanguage = useCallback((language: string) => {
    setState((prev) => ({ ...prev, language }))
  }, [])

  const resetVerification = useCallback(() => {
    setState({
      step: "initial",
      language: state.language,
      challengeType: "checkbox",
      attempts: 0,
      maxAttempts: 3,
    })
    setChallengeData(null)
  }, [state.language])

  return {
    state,
    challengeData,
    startVerification,
    submitChallenge,
    changeLanguage,
    resetVerification,
  }
}
