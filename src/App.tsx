import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthContext } from './contexts';
import { Login, PasswordRecover, Historial } from './pages';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            (isAuthenticated && <Navigate to="/historial" />) || (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<PasswordRecover />} />
        {isAuthenticated && <Route path="/historial" element={<Historial />} />}
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There's nothing here!</p>
              <Link to="/">take me home</Link>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
