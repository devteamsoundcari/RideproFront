import React, { useEffect, useState } from "react";
import { Table, ButtonGroup, Button, Spinner } from "react-bootstrap";
import {
  getSuperUserCompanies,
  deleteSuperUserCompany,
} from "../../../../controllers/apiRequests";
import { FaMinus } from "react-icons/fa";
import AttachCompanyToUser from "../AttachCompanyToUser";
import swal from "sweetalert";

const ExpandSection = ({ row }) => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);

  //   ================================ FETCH COMPANIES ON LOAD=====================================================
  const fetchCompanies = async () => {
    setLoading(true);
    const response = await getSuperUserCompanies(row.id);
    if (response.status === 200) {
      setCompanies(response.data.results);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line
  }, [row]);

  const renderCompanies = companies.map((cmpny: any, idx: number) => {
    return (
      <tr key={idx}>
        <td>{cmpny.company.name}</td>
        <td>
          <Button
            variant="link"
            onClick={() => {
              swal({
                title: "¿Estas seguro?",
                text: `Desasginar ${cmpny.company.name} de ${row.first_name} ${row.last_name}`,
                icon: "warning",
                buttons: ["No, volver", "Si, continuar"],
                dangerMode: true,
              }).then(async (willUpdate) => {
                if (willUpdate) {
                  console.log("delete", cmpny.id);
                  let res = await deleteSuperUserCompany(cmpny.id);
                  console.log("res", res);
                }
              });
            }}
          >
            <FaMinus />
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <ButtonGroup size="sm">
        <Button variant="success" onClick={() => setShowModal(true)}>
          Asignar empresa
        </Button>
      </ButtonGroup>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <Table striped bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Empresa</th>
              <th style={{ width: "10%" }}>Descartar</th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0
              ? renderCompanies
              : "Este supercliente no tiene empresas asignadas."}
          </tbody>
        </Table>
      )}
      {showModal && (
        <AttachCompanyToUser
          handleClose={() => setShowModal(false)}
          onUpdate={() => fetchCompanies()}
          superuser={row}
          settedCompanies={companies}
        />
      )}
    </div>
  );
};

export default ExpandSection;
