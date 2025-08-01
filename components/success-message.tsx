"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface SuccessMessageProps {
  onContinue: () => void
}

export function SuccessMessage({ onContinue }: SuccessMessageProps) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      <div>
        <h2 className="text-2xl font-medium text-green-600 mb-2">Verification Complete!</h2>
        <p className="text-gray-600">You have been successfully verified as human.</p>
      </div>
      <Button onClick={onContinue} className="bg-green-500 hover:bg-green-600 text-white px-8">
        Continue to Titipsini.com
      </Button>
    </div>
  )
}
