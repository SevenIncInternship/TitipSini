export function LoadingSpinner() {
  return (
    <div className="text-center space-y-4">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      <p className="text-gray-600">Processing verification...</p>
    </div>
  )
}
