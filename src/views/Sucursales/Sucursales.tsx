import React, { useEffect, useState, useContext } from "react";
import { Alert, Container, Spinner, Card, Table } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import { AuthContext } from "../../contexts/AuthContext";

import {
  getSuperUserCompanies,
  getCompanyUsers,
} from "../../controllers/apiRequests";

type SucursalesProps = any;

const Sucursales: React.FC<SucursalesProps> = () => {
  const [companies, setCompanies] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any>({});
  const { userInfoContext } = useContext(AuthContext);

  const fetchUsers = async () => {
    setLoading(true);
    companies.forEach(async (item: any) => {
      const res: any = await getCompanyUsers(item.company.id);
      setUsers((prevState: any) => ({
        ...prevState,
        [item.company.id]: res.results,
      }));
      setLoading(false);
    });
  };

  useEffect(() => {
    if (companies.length) {
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [companies]);

  // ================================ FETCH COMPANIES ON LOAD=====================================================
  const fetchCompanies = async (url) => {
    setLoading(true);
    const response = await getSuperUserCompanies(url);
    setCompanies((oldArr) => [...oldArr, ...response.data.results]);
    if (response.data.next) {
      return await fetchCompanies(response.data.next);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies(`${process.env.REACT_APP_API_URL}/api/v1/user_companies/?user=${userInfoContext.id}`);
    // eslint-disable-next-line
  }, []);


  const columns = [
    {
      dataField: "id",
      text: "ID",
      headerClasses: "small-column",
      sort: true,
    },
    {
      dataField: "company.name",
      text: `NOMBRE (${companies.length})`,
      //   formatter: formatDate,
      sort: true,
    },
    {
      dataField: "company.nit",
      text: "NIT",
      //   formatter: formatDate,
      sort: true,
    },
    {
      dataField: "company.phone",
      text: "Teléfono",
      //   formatter: formatDate,
      sort: true,
    },

    {
      dataField: "company.address",
      text: "Dirección",
      //   formatter: formatDate,
      sort: true,
    },
  ];

  const expandRow = {
    onlyOneExpanding: true,
    renderer: (row) => {
      return (
        <div>
          <div className="w-100 text-center">
            <h6>USUARIOS REGISTRADOS EN {row.company.name.toUpperCase()}</h6>
          </div>
          <Table bordered size="sm">
            <thead className="bg-primary">
              <tr>
                <th className="text-white">Nombre</th>
                <th className="text-white">Email</th>
                <th className="text-white">Cargo</th>
                <th className="text-white">Credito</th>
              </tr>
            </thead>
            <tbody>
              {users[row.company.id].map((user: any) => {
                return (
                  <tr>
                    <td>
                      {user.first_name} {user.last_name}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.charge}</td>
                    <td>${user.credit}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      );
    },
  };

  return (
    <Container fluid="md" id="client-requests-history">
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <Card>
          {companies.length === 0 ? (
            <Alert variant="light">
              <Alert.Heading>¡Sin Sucursales!</Alert.Heading>
              <p>
                Ponte en contacto con Ridepro para que se te sean asignadas tus
                sucursales.
              </p>
            </Alert>
          ) : (
            <BootstrapTable
              bootstrap4
              keyField="id"
              data={companies}
              columns={columns}
              //   selectRow={selectRow}
              expandRow={expandRow}
              filter={filterFactory()}
              pagination={paginationFactory()}
            />
          )}
        </Card>
      )}
    </Container>
  );
};
export default Sucursales;
