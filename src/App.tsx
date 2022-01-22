import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, HashRouter } from 'react-router-dom';
import { AuthContext } from './contexts';
import {
  Login,
  PasswordRecover,
  Historial,
  Calendar,
  Pistas,
  Proveedores,
  Instructores,
  AdminRequestId,
  Empresas,
  Usuarios,
  SuperUsuarios,
  Documentos,
  Creditos,
  Solicitar
} from './pages';
import { routes } from './routes';

function App() {
  const { isAuthenticated, userInfo } = useContext(AuthContext);

  const profilesContainsCurrentProfile = (arr: any[]) => {
    return arr.find(({ profile }: any) => profile === userInfo.profile);
  };

  const getComponent = (component: string) => {
    switch (component) {
      case 'Login':
        return <Login />;
      case 'PasswordRecover':
        return <PasswordRecover />;
      case 'Historial':
        return <Historial />;
      case 'Calendar':
        return <Calendar />;
      case 'Pistas':
        return <Pistas />;
      case 'Proveedores':
        return <Proveedores />;
      case 'Instructores':
        return <Instructores />;
      case 'AdminRequestId':
        return <AdminRequestId />;
      case 'Empresas':
        return <Empresas />;
      case 'Usuarios':
        return <Usuarios />;
      case 'SuperUsuarios':
        return <SuperUsuarios />;
      case 'Documentos':
        return <Documentos />;
      case 'Creditos':
        return <Creditos />;
      case 'Solicitar':
        return <Solicitar />;
      default:
        return <Historial />;
    }
  };

  const renderNestedRoute = (url, children) => {
    return <Route path={`${url}/${children.url}`} element={getComponent(children.component)} />;
  };

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={(isAuthenticated && <Navigate to="/historial" />) || <Navigate to="/login" />}
        />
        {routes.map(({ name, url, component, isProtected, profiles, children = null }) => {
          if (isProtected) {
            if (isAuthenticated && profilesContainsCurrentProfile(profiles)) {
              return (
                <Route path={url} element={getComponent(component)} key={name}>
                  {children && renderNestedRoute(url, children)}
                </Route>
              );
            }
            return '';
          } else {
            return <Route path={url} element={getComponent(component)} key={name} />;
          }
        })}
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
    </HashRouter>
  );
}

export default App;
