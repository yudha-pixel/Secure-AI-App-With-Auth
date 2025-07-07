import { ClerkProviderWithRouters} from "./auth/ClerkProviderWithRouters.tsx";
import { Routes, Route } from "react-router";
import Layout from "./layout/Layout.tsx";
import ChallengeGenerator from "./challenge/ChallengeGenerator.tsx";
import HistoryPanel from "./history/HistoryPanel.tsx";
import AuthenticationPage from "./auth/AuthenticationPage.tsx";
import './App.css'


function App() {
  return (
    <ClerkProviderWithRouters>
        <Routes>
            <Route path="/sign-in/*" element={<AuthenticationPage />} />
            <Route path="/sign-up" element={<AuthenticationPage />} />
            <Route element={<Layout />}>
                <Route path="/" element={<ChallengeGenerator />} />
                <Route path="/history" element={<HistoryPanel />} />
            </Route>
        </Routes>
    </ClerkProviderWithRouters>
  )
}

export default App
