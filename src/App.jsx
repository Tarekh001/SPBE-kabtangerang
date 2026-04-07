import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col text-white">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Logo Section */}
        <div className="flex gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img
              src={viteLogo}
              className="h-24 w-24 transition-all duration-300 hover:drop-shadow-[0_0_2rem_#646cffaa] hover:scale-110"
              alt="Vite logo"
            />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img
              src={reactLogo}
              className="h-24 w-24 animate-spin-slow transition-all duration-300 hover:drop-shadow-[0_0_2rem_#61dafbaa] hover:scale-110"
              alt="React logo"
            />
          </a>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Vite + React
        </h1>
        <p className="text-lg text-slate-400 mb-8">
          Powered by <span className="text-purple-400 font-semibold">Tailwind CSS v4</span>
        </p>

        {/* Counter Card */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl mb-8 transition-all duration-300 hover:bg-white/10 hover:shadow-purple-500/20">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-lg 
                       shadow-lg shadow-purple-500/25 transition-all duration-300 
                       hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/40 hover:scale-105 
                       active:scale-95 cursor-pointer"
          >
            Count is {count}
          </button>
          <p className="mt-4 text-slate-400">
            Edit <code className="bg-white/10 px-2 py-1 rounded text-purple-300 text-sm">src/App.jsx</code> and save to test HMR
          </p>
        </div>

        {/* Footer Info */}
        <p className="text-slate-500 text-sm">
          Click on the Vite and React logos to learn more
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
