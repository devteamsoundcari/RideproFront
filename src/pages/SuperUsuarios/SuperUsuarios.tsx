import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaDownload, FaUndoAlt } from 'react-icons/fa';
import { CustomCard } from '../../components/molecules';
import { CustomTable, SuperUsersCompanies } from '../../components/organisms';
import { MainLayout } from '../../components/templates';
import { UsersContext } from '../../contexts';
import { PERFIL_SUPERCLIENTE } from '../../utils/constants';

interface ISuperUsuariosProps {}

export const SuperUsuarios: React.FunctionComponent<ISuperUsuariosProps> = (props) => {
  const { loadingUsers, getUsers, users, allUsersLoaded, setAllUsersLoaded } =
    useContext(UsersContext);
  const [superUsers, setSuperUsers] = useState<any>([]);
  const [superUsersCount, setSuperUsersCount] = useState(0);

  useEffect(() => {
    setSuperUsers(users.filter((user) => user.profile === PERFIL_SUPERCLIENTE.profile));
    setSuperUsersCount(superUsers.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const fetchUsers = async () => {
    try {
      await getUsers();
    } catch (error) {
      throw new Error('Error getting the users');
    }
  };

  useEffect(() => {
    if (!loadingUsers && !allUsersLoaded) fetchUsers();
    //eslint-disable-next-line
  }, [allUsersLoaded]);

  const columns = [
    {
      dataField: 'id',
      text: 'Id',
      sort: true,
      classes: 'xs-column text-center',
      headerClasses: 'xs-column'
    },

    {
      dataField: 'first_name',
      text: 'Nombre'
    },
    {
      dataField: 'last_name',
      text: 'Apellido'
    },
    {
      dataField: 'company.name',
      text: 'Empresa',
      sort: true
    },
    {
      dataField: 'email',
      text: 'Email',
      classes: 'lg-column',
      headerClasses: 'lg-column'
    },
    {
      dataField: 'credit',
      text: 'Cred',
      classes: 'small-column text-center',
      headerClasses: 'small-column',
      formatter: (cell) => <p>${cell}</p>
    }
  ];

  const actionButtons = [
    {
      onClick: () => setAllUsersLoaded(false),
      icon: loadingUsers ? (
        <Spinner animation="border" size="sm" className="mt-2" />
      ) : (
        <FaUndoAlt />
      ),
      disabled: loadingUsers
    },
    {
      onClick: () => console.log('yex'),
      icon: <FaDownload />,
      disabled: true
    }
  ];

  return (
    <MainLayout>
      <CustomCard
        title="Super usuarios"
        subtitle={`Detalle de los super-usuarios registrados (${superUsersCount})`}
        loading={loadingUsers}
        actionButtons={actionButtons}>
        <CustomTable
          keyField="id"
          columns={columns}
          data={superUsers}
          renderSearch
          loading={loadingUsers}
          showExpandRow
          expandComponent={(row) => <SuperUsersCompanies row={row} />}
        />
      </CustomCard>
    </MainLayout>
  );
};
