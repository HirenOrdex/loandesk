import React from 'react'
import './App.css'
import Routing from './pages/routes/Routing'
import NavigateToTop from './components/NavigateToTop'

const App: React.FC = () => {

  return (
    <div>
      {/* public screens */}
      {/* <Layout /> */}
      <NavigateToTop />
      <Routing />
      {/* protected screens */}
      {/* <Header />
      <Dashboard />
      <Footer /> */}
    </div>
  )
}

export default App
