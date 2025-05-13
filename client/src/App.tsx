import React from 'react'
import './App.css'
import Routing from './pages/routes/Routing'

const App: React.FC = () => {

  return (
    <div>
      {/* public screens */}
      {/* <Layout /> */}
      <Routing />
      {/* protected screens */}
      {/* <Header />
      <Dashboard />
      <Footer /> */}
    </div>
  )
}

export default App
