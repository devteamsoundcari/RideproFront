import { PERFIL_TECNICO, PERFIL_OPERACIONES, PERFIL_CLIENTE } from './utils';

export const allStatus = [
  {
    profile: PERFIL_TECNICO,
    steps: [
      {
        step: 0,
        name: 'Solicitud cancelada',
        variant: 'event-canceled',
        now: 100,
        level: 100
      },
      {
        step: 1,
        name: 'Esperando confirmación',
        variant: 'event-requested',
        now: 20,
        level: 60
      },
      {
        step: 2,
        name: 'Esperando confirmación cliente',
        variant: 'confirm-event',
        now: 40,
        level: 60
      },
      {
        step: 3,
        name: 'Programación aceptada',
        variant: 'event-confirmed',
        now: 50,
        level: 60
      },
      {
        step: 4,
        name: 'Generar Informes',
        variant: 'upload-reports',
        now: 80,
        level: 80
      },
      {
        step: 5,
        name: 'Evento Finalizado',
        variant: 'event-finished',
        now: 100,
        level: 100
      }
    ]
  },
  {
    profile: PERFIL_OPERACIONES,
    steps: [
      {
        step: 0,
        name: 'Solicitud cancelada',
        variant: 'event-canceled',
        now: 100,
        level: 100
      },
      {
        step: 1,
        name: 'Esperando confirmación',
        variant: 'event-requested',
        now: 20,
        level: 60
      },
      {
        step: 2,
        name: 'Esperando confirmación cliente',
        variant: 'confirm-event',
        now: 40,
        level: 60
      },
      {
        step: 3,
        name: 'Programación aceptada',
        variant: 'event-confirmed',
        now: 50,
        level: 60
      },
      {
        step: 4,
        name: 'Confirmar recepción de documentos',
        variant: 'confirm-docs',
        now: 60,
        level: 60
      },
      {
        step: 5,
        name: 'Confirmar recepción de documentos',
        variant: 'confirm-docs',
        now: 60,
        level: 60
      }
    ]
  },
  {
    profile: PERFIL_CLIENTE,
    steps: [
      {
        step: 0,
        name: 'Solicitud cancelada',
        variant: 'event-canceled',
        now: 100,
        level: 100
      },
      {
        step: 1,
        name: 'Esperando confirmación',
        variant: 'event-requested',
        now: 20,
        level: 60
      },
      {
        step: 2,
        name: 'Confirmar programación',
        variant: 'confirm-event',
        now: 40,
        level: 60
      },
      {
        step: 3,
        name: 'Servicio programado',
        variant: 'event-confirmed',
        now: 50,
        level: 60
      },
      {
        step: 4,
        name: 'Servicio programado',
        variant: 'event-confirmed',
        now: 50,
        level: 60
      }
    ]
  }
];
