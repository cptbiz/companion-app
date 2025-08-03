export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-white">Loading AI Companion...</h2>
        <p className="mt-2 text-gray-400">Please wait while we initialize the application</p>
      </div>
    </div>
  );
} 