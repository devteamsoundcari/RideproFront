import React from 'react';
import OperacionesStatus from '../../../utils/OperacionesStatus';
import TecnicoStatus from '../../../utils/TecnicoStatus';
import AdminStatus from '../../../utils/AdminStatus';
import { textFilter, dateFilter } from 'react-bootstrap-table2-filter';

export const getColumns = (profile) => {
  // STATUS FORMATTER
  const statusFormatter = (cell, row) => {
    if (profile === 3) {
      return <OperacionesStatus step={row.status.step} />;
    } else if (profile === 1) {
      return <AdminStatus step={row.status.step} />;
    } else {
      return <TecnicoStatus step={row.status.step} />;
    }
  };

  // CITY FORMATTER
  const cityFormatter = (cell) =>
    cell.charAt(0).toUpperCase() + cell.slice(1).toLowerCase();
  const dateFormatter = (cell) => {
    let d = new Date(cell);
    const dateTimeFormat = new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const [{ value: month }, , { value: day }, , { value: year }] =
      dateTimeFormat.formatToParts(d);
    return `${month}/${day}/${year}`;
  };

  // WAITING TIME FORMATTER
  const waitingTimeFormatter = (cell, row) => {
    let created = new Date(row.updated_at);
    let now = new Date();
    let difference = Math.abs(now.getTime() - created.getTime());
    let hourDifference = difference / 1000 / 3600;
    let days = Math.floor(hourDifference / 24);
    if (profile === 3 && row.status.step > 5) {
      return <small>Completado el {dateFormatter(created)}</small>;
    } else if (profile === 5 && row.status.step > 4) {
      return <small>Completado el {dateFormatter(created)}</small>;
    } else {
      if (hourDifference > 24) {
        return (
          <small>
            Hace {days} {days > 1 ? 'días' : 'día'}
          </small>
        );
      }
      return <small>hace {Math.floor(hourDifference)} horas</small>;
    }
  };

  const dateFilterProps = {
    delay: 400,
    withoutEmptyComparatorOption: true,
    style: { display: 'inline-grid', width: '8em' },
    dateStyle: {
      width: '8em'
    }
  };

  const columns = [
    {
      dataField: 'id',
      text: 'Cód.',
      headerClasses: 'small-column',
      sort: true,
      filter: textFilter({
        delay: 1000, // default is 500ms
        placeholder: '#'
      })
    },
    {
      dataField: 'customer.company.name',
      text: 'Cliente',
      sort: true,
      filter: textFilter()
    },
    // {
    //   dataField: 'created_at',
    //   text: 'Fecha de solicitud',
    //   formatter: dateFormatter,
    //   sort: true,
    //   filter: dateFilter(dateFilterProps)
    // },
    {
      dataField: 'municipality.name',
      text: 'Ciudad',
      formatter: cityFormatter,
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'service.name',
      text: 'Producto',
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'start_time',
      text: 'Fecha de Programación',
      formatter: dateFormatter,
      sort: true,
      filter: dateFilter(dateFilterProps)
    },
    {
      dataField: 'finish_time',
      text: 'Última interacción',
      formatter: waitingTimeFormatter,
      sort: true,
      filter: textFilter()
    },
    {
      dataField: 'status.name',
      text: 'Estado',
      formatter: statusFormatter,
      sort: true,
      filter: textFilter()
    }
  ];
  return columns;
};
