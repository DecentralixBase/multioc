import React from 'react'
import './App.css'
import WalletInput from './components/WalletInput'
import ChainSwitcher from './components/ChainSwitcher'
import WalletOverview from './components/WalletOverview'
import TokenTable from './components/TokenTable'
import NFTGrid from './components/NFTGrid'
import GasChart from './components/GasChart'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">
          MULTIOC Dashboard
        </h1>
        <WalletInput />
        <ChainSwitcher />
        <WalletOverview />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TokenTable />
          <NFTGrid />
        </div>
        <GasChart />
      </div>
    </div>
  )
}

export default App 