import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { AdminRequestsHistory } from '../../components/organisms';
import { MainLayout } from '../../components/templates';

export interface IHistorialProps {}

export function Historial(props: IHistorialProps) {
  const { pathname } = useLocation();

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
