import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'

function App() {
  /**
   * domainFilter — string | null
   * Dikirim dari Header (ketika dropdown Domain diklik)
   * dan dikonsumsi oleh Home untuk mengaktifkan filter di section Domain.
   */
  const [domainFilter, setDomainFilter] = useState(null)

  return (
    <div className="min-h-screen flex flex-col">
      <Header setDomainFilter={setDomainFilter} />

      <main className="flex-1">
        <Home domainFilter={domainFilter} setDomainFilter={setDomainFilter} />
      </main>

      <Footer />
    </div>
  )
}

export default App
