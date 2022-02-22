import React from 'react';
import { Badge, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { dateFromNow } from '../../../utils/dateFormatter';
import { ILineService } from '../../../contexts';
import './ServiceLineCard.scss';
import { GiFullMotorcycleHelmet } from 'react-icons/gi';
import { COMPANY_NAME } from '../../../utils/constants';

export interface IServiceLineCardProps {
  data: ILineService;
  setSelected: (line: ILineService) => void;
}

export function ServiceLineCard({ data, setSelected }: IServiceLineCardProps) {
  const { updated_at, name, description, image } = data;

  const truncate = (str) => (str.length > 10 ? str.substring(0, 80) + '...' : str);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {description}
    </Tooltip>
  );

  return (
    <Card className="service-line-card" onClick={() => setSelected(data)}>
      <Card.Header>
        <Badge className="bg-secondary text-white text-capitalize">
          {COMPANY_NAME} <GiFullMotorcycleHelmet />
        </Badge>
        <div className="img" style={{ backgroundImage: `url(${image})` }}></div>
      </Card.Header>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <OverlayTrigger placement="bottom" delay={{ show: 800, hide: 600 }} overlay={renderTooltip}>
          <Card.Text>{truncate(description)}</Card.Text>
        </OverlayTrigger>
        <small className="text-muted">Actualizado {dateFromNow(updated_at)}</small>
      </Card.Body>
    </Card>
  );
}
