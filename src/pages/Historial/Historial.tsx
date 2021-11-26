import React, { useEffect, useContext } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AdminRequestsHistory } from '../../components/organisms';
import { MainLayout } from '../../components/templates';
import { RequestsContext } from '../../contexts';

export interface IHistorialProps {}

export function Historial(props: IHistorialProps) {
  const { pathname } = useLocation();
  const { getRequestsList } = useContext(RequestsContext);

  useEffect(() => {
    getRequestsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderOutlet = () => {
    if (pathname === '/historial') {
      return <AdminRequestsHistory />;
    } else {
      return (
        <Outlet>
          <AdminRequestsHistory />
        </Outlet>
      );
    }
  };

  return <MainLayout>{renderOutlet()}</MainLayout>;
}
