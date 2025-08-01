"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import type { ChallengeData } from "@/types/verification" // Updated import

interface VerificationChallengeProps {
  challengeData: ChallengeData
  challengeType: "checkbox" | "puzzle" | "image"
  onSubmit: (answer: any) => void
  attempts: number
}

export function VerificationChallenge({
  challengeData,
  challengeType,
  onSubmit,
  attempts,
}: VerificationChallengeProps) {
  const [answer, setAnswer] = useState<any>(null)
  const [selectedImages, setSelectedImages] = useState<number[]>([])

  const handleSubmit = () => {
    if (challengeType === "checkbox") {
      onSubmit(answer)
    } else if (challengeType === "puzzle") {
      onSubmit(answer)
    } else if (challengeType === "image") {
      onSubmit(selectedImages)
    }
  }

  const toggleImageSelection = (index: number) => {
    setSelectedImages((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-800 mb-2">Security Verification</h2>
        {attempts > 0 && (
          <p className="text-red-600 text-sm mb-4">Incorrect answer. Attempts remaining: {3 - attempts}</p>
        )}
      </div>

      <Card className="p-6 bg-white border border-gray-200">
        <div className="space-y-4">
          <p className="text-gray-700 font-medium">{challengeData.question}</p>

          {challengeType === "checkbox" && (
            <div className="flex items-center space-x-2">
              <Checkbox id="human-check" checked={answer === true} onCheckedChange={(checked) => setAnswer(checked)} />
              <label htmlFor="human-check" className="text-sm text-gray-600">
                {"I'm not a robot"}
              </label>
            </div>
          )}

          {challengeType === "puzzle" && challengeData.options && (
            <div className="grid grid-cols-2 gap-2">
              {challengeData.options.map((option, index) => (
                <Button
                  key={index}
                  variant={answer === index ? "default" : "outline"}
                  onClick={() => setAnswer(index)}
                  className="h-12"
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {challengeType === "image" && challengeData.images && (
            <div className="grid grid-cols-2 gap-3">
              {challengeData.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImages.includes(index)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleImageSelection(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Challenge option ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  {selectedImages.includes(index) && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={
          (challengeType === "checkbox" && answer !== true) ||
          (challengeType === "puzzle" && answer === null) ||
          (challengeType === "image" && selectedImages.length === 0)
        }
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        Verify
      </Button>
    </div>
  )
}
