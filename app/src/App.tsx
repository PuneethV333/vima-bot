import { Route, Routes, Navigate } from "react-router";
import { VoiceAgent } from "./pages/VoiceAgent";
import { useGetMe } from "./hooks/useAuth";
import { Auth } from "./pages/Auth";

const App = () => {
  const { data, isLoading } = useGetMe();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/auth"
        element={data?.profileComplete ? <Navigate to="/" replace /> : <Auth />}
      />

      <Route
        path="/"
        element={
          data?.profileComplete ? (
            <VoiceAgent />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;
