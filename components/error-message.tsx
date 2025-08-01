"use client"

import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

interface ErrorMessageProps {
  onRetry: () => void
}

export function ErrorMessage({ onRetry }: ErrorMessageProps) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <XCircle className="w-16 h-16 text-red-500" />
      </div>
      <div>
        <h2 className="text-2xl font-medium text-red-600 mb-2">Verification Failed</h2>
        <p className="text-gray-600">Too many incorrect attempts. Please try again later or contact support.</p>
      </div>
      <Button
        onClick={onRetry}
        variant="outline"
        className="border-red-500 text-red-500 hover:bg-red-50 bg-transparent"
      >
        Try Again
      </Button>
    </div>
  )
}
