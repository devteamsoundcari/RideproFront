import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaDownload, FaPlus, FaUndoAlt } from 'react-icons/fa';
import { CustomCard, ModalNewUser } from '../../components/molecules';
import { CustomTable } from '../../components/organisms';
import { MainLayout } from '../../components/templates';
import { UsersContext } from '../../contexts';
import { ALL_PROFILES } from '../../utils';

interface IUsuariosProps {}

export const Usuarios: React.FunctionComponent<IUsuariosProps> = (props) => {
  const { loadingUsers, getUsers, users, allUsersLoaded, setAllUsersLoaded, count } =
    useContext(UsersContext);
  const [showAddUser, setShowAddUser] = useState(false);

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
      classes: 'xs-column',
      headerClasses: 'xs-column'
    },
    {
      dataField: 'profile',
      text: 'Perfil',
      sort: true,
      classes: 'small-column',
      headerClasses: 'small-column',
      formatter: (cell: any, row: any) => {
        const found = ALL_PROFILES.find((profile) => profile.profile === row.profile);
        return <span className="text-capitalize">{found?.name}</span>;
      }
    },
    {
      dataField: 'company.name',
      text: 'Empresa',
      sort: true
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
      dataField: 'email',
      text: 'Email',
      classes: 'lg-column',
      headerClasses: 'lg-column'
    },
    {
      dataField: 'credit',
      text: 'Cred',
      classes: 'small-column',
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
      onClick: () => setShowAddUser(true),
      icon: <FaPlus />
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
        title="Usuarios"
        subtitle={`Detalle de los usuarios registrados ${
          loadingUsers ? `(${users.length} de ${count})` : `(${count})`
        }`}
        loading={loadingUsers}
        actionButtons={actionButtons}>
        <CustomTable
          keyField="id"
          columns={columns}
          data={users}
          renderSearch
          loading={loadingUsers}
        />
      </CustomCard>
      {showAddUser && <ModalNewUser handleClose={() => setShowAddUser(false)} />}
    </MainLayout>
  );
};
