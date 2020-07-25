const statusStepFormatter = (step: number, profile: number) => {
  if (profile === 2) {
    switch (step) {
      case 0:
        return {
          name: "Solicitud cancelada",
          bgColor: "bg-event-canceled",
          color: "#fff",
        };
      case 1:
        return {
          name: "Esperando confirmación",
          bgColor: "bg-event-requested",
          color: "#333",
        };
      case 2:
        return {
          name: "Confirmar programación",
          bgColor: "bg-confirm-event",
          color: "#fff",
        };
      case 3:
        return {
          name: "Servicio programado",
          bgColor: "bg-event-confirmed",
          color: "#fff",
        };
      case 4:
        return {
          name: "Servicio programado",
          bgColor: "bg-event-confirmed",
          color: "#fff",
        };
      case 5:
        return {
          name: "Servicio programado",
          bgColor: "bg-event-confirmed",
          color: "#fff",
        };
      default:
        return {
          name: "Undefined",
          bgColor: "bg-dark",
          color: "#fff",
        };
    }
  } else {
    switch (step) {
      case 0:
        return {
          name: "Solicitud cancelada",
          bgColor: "bg-event-canceled",
          color: "#fff",
        };
      case 1:
        return {
          name: "Esperando confirmación",
          bgColor: "bg-event-requested",
          color: "#333",
        };
      case 2:
        return {
          name: "Esperando confirmación cliente",
          bgColor: "bg-confirm-event",
          color: "#fff",
        };
      case 3:
        return {
          name: "Programación aceptada",
          bgColor: "bg-event-confirmed",
          color: "#fff",
        };
      case 4:
        return {
          name: "Confirmar recepción de documentos",
          bgColor: "bg-confirm-docs",
          color: "#fff",
        };
      case 5:
        return {
          name: "Evento Finalizado",
          bgColor: "bg-event-finished",
          color: "#333",
        };
      default:
        return {
          name: "Undefined",
          bgColor: "bg-dark",
          color: "#fff",
        };
    }
  }
};

export default statusStepFormatter;
