import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { MainLayout } from '../../components/templates';
import { ModalAddProvider } from '../../components/molecules';

export interface IProveedoresProps {}

export function Proveedores(props: IProveedoresProps) {
  const [showModalAddProvider, setShowModalAddProvider] = useState(false);
  return (
    <MainLayout>
      Proveedores:
      <Button onClick={() => setShowModalAddProvider(true)}>Agregar proveedor</Button>
      {showModalAddProvider && (
        <ModalAddProvider handleClose={() => setShowModalAddProvider(false)} />
      )}
    </MainLayout>
  );
}
