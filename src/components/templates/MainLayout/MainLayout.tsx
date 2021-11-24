import React from 'react';
import { Container } from 'react-bootstrap';
import { Sidebar, MyNavbar } from '../../organisms';

export interface IMainLayoutProps {
  children: any;
}

export function MainLayout({ children }: IMainLayoutProps) {
  return (
    <div className="container-fluid" style={{ height: '100%' }}>
      <div className="row">
        <Sidebar url={'/'} />
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-0">
          <MyNavbar />
          <Container fluid className="mt-2">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}
