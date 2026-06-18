import { Route, Routes } from 'react-router'
import { VoiceAgent } from './pages/VoiceAgent'

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<VoiceAgent />} />
        </Routes>
    )
}

export default App
