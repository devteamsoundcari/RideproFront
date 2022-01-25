import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaDownload, FaPlus, FaUndoAlt } from 'react-icons/fa';
import { CustomCard, ModalAddCredit } from '../../components/molecules';
import { CustomTable } from '../../components/organisms';
import { MainLayout } from '../../components/templates';
import { CreditsContext } from '../../contexts';
import { dateDDMMYYYnTime } from '../../utils';

interface ICreditosProps {}

export const Creditos: React.FunctionComponent<ICreditosProps> = (props) => {
  const [showAddCredit, setShowAddCredit] = useState(false);
  const { loadingCredits, getCredits, allCreditsLoaded, credits, count, setAllCreditsLoaded } =
    useContext(CreditsContext);

  const fetchCredits = async () => {
    try {
      await getCredits();
    } catch (error) {
      throw new Error('Error getting credits');
    }
  };

  useEffect(() => {
    if (!loadingCredits && !allCreditsLoaded) fetchCredits();
    //eslint-disable-next-line
  }, [allCreditsLoaded]);

  const actionButtons = [
    {
      onClick: () => setAllCreditsLoaded(false),
      icon: loadingCredits ? (
        <Spinner animation="border" size="sm" className="mt-2" />
      ) : (
        <FaUndoAlt />
      ),
      disabled: loadingCredits
    },
    {
      onClick: () => setShowAddCredit(true),
      icon: <FaPlus />
    },
    {
      onClick: () => console.log('yex'),
      icon: <FaDownload />,
      disabled: true
    }
  ];

  const paymentFormatter = (cell, row) => {
    switch (row.payment_method) {
      case 'cash':
        return 'Efectivo';
      case 'cupos':
        return 'Cupos Arl';
      case 'hours':
        return 'Horas Arl';
      default:
        return 'undefined';
    }
  };

  const buyerFormatter = (cell, row) => {
    return `${row.buyer.first_name} ${row.buyer.last_name}`;
  };

  const sellerFormatter = (cell, row) => {
    return `${row.seller.first_name} ${row.seller.last_name}`;
  };

  const columns = [
    {
      dataField: 'bill_id',
      text: 'Id',
      sort: true,
      classes: 'small-column text-center',
      headerClasses: 'small-column',
      formatter: (cell) => <small>{cell}</small>
    },
    {
      dataField: 'buyer.first_name',
      text: 'Vendido a',
      formatter: buyerFormatter
    },
    {
      dataField: 'buyer.email',
      text: 'Email',
      formatter: (cell) => <small>{cell}</small>
    },
    {
      dataField: 'seller.email',
      text: 'Vendido por',
      sort: true,
      formatter: sellerFormatter
    },
    {
      dataField: 'payment_method',
      text: 'Forma de pago',
      classes: 'small-column text-center',
      headerClasses: 'small-column',
      sort: true,
      formatter: paymentFormatter
    },
    {
      dataField: 'created_at',
      text: 'Fecha',
      classes: 'small-column text-center',
      headerClasses: 'small-column',
      formatter: (cell) => dateDDMMYYYnTime(cell),
      sort: true
    },
    {
      dataField: 'credits',
      text: 'Cred',
      classes: 'small-column text-center',
      headerClasses: 'small-column',
      formatter: (cell) => <p>{cell}</p>
    }
  ];

  return (
    <MainLayout>
      <CustomCard
        title="Creditos"
        subtitle={`Detalle de los creditos registrados ${
          loadingCredits ? `(${credits.length} de ${count})` : `(${count})`
        }`}
        loading={loadingCredits}
        actionButtons={actionButtons}>
        <CustomTable
          keyField="id"
          columns={columns}
          data={credits}
          renderSearch
          loading={loadingCredits}
        />
      </CustomCard>
      {showAddCredit && <ModalAddCredit handleClose={() => setShowAddCredit(false)} />}
    </MainLayout>
  );
};
