"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight } from "lucide-react"
import { useVerification } from "@/hooks/useVerification" // Updated import
import { VerificationChallenge } from "@/components/verification-challenge" // Updated import
import { LoadingSpinner } from "@/components/loading-spinner" // Updated import
import { SuccessMessage } from "@/components/success-message" // Updated import
import { ErrorMessage } from "@/components/error-message" // Updated import

const translations = {
  english: {
    title: "Let'ss confirm you are human",
    description:
      "Complete the security check before continuing. This step verifies that you are not a bot, which helps to protect your account and prevent spam.",
    begin: "Begin",
  },
  indonesian: {
    title: "Mari konfirmasi Anda manusia",
    description:
      "Selesaikan pemeriksaan keamanan sebelum melanjutkan. Langkah ini memverifikasi bahwa Anda bukan bot, yang membantu melindungi akun Anda dan mencegah spam.",
    begin: "Mulai",
  },
  spanish: {
    title: "Confirmemos que eres humano",
    description:
      "Completa la verificación de seguridad antes de continuar. Este paso verifica que no eres un bot, lo que ayuda a proteger tu cuenta y prevenir spam.",
    begin: "Comenzar",
  },
  french: {
    title: "Confirmons que vous êtes humain",
    description:
      "Complétez la vérifikasi de sécurité avant de continuer. Cette étape vérifie que vous n'êtes pas un bot, ce qui aide à protéger votre compte et à prévenir le spam.",
    begin: "Commencer",
  },
}

export default function VerificationPage() {
  const { state, challengeData, startVerification, submitChallenge, changeLanguage, resetVerification } =
    useVerification()

  const t = translations[state.language as keyof typeof translations] || translations.english

  const handleContinue = () => {
    // Redirect to main application
    window.location.href = "https://titipsini.com"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        {state.step === "initial" && (
          <>
            <div className="space-y-6">
              <h1 className="text-2xl font-medium text-orange-600 leading-tight">{t.title}</h1>

              <div className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed max-w-xs mx-auto">{t.description}</p>
              </div>

              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md font-medium text-sm"
                onClick={startVerification}
              >
                {t.begin}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        )}

        {state.step === "loading" && <LoadingSpinner />}

        {state.step === "challenge" && challengeData && (
          <VerificationChallenge
            challengeData={challengeData}
            challengeType={state.challengeType}
            onSubmit={submitChallenge}
            attempts={state.attempts}
          />
        )}

        {state.step === "success" && <SuccessMessage onContinue={handleContinue} />}

        {state.step === "error" && <ErrorMessage onRetry={resetVerification} />}

        {/* Language Selector - Always visible */}
        <div className="pt-8">
          <Select value={state.language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-32 mx-auto bg-white border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="indonesian">Indonesian</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
