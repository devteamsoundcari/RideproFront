import React, { ReactNode } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import './CustomCard.scss';
interface ICustomCardProps {
  title?: string;
  subtitle?: string;
  actionButtons?: {
    icon: ReactNode;
    onClick: () => any;
    disabled?: boolean;
  }[];
  children: any;
  loading?: boolean;
  bodyPadding?: string;
  hideHeader?: boolean;
}

export const CustomCard: React.FunctionComponent<ICustomCardProps> = ({
  title,
  subtitle,
  actionButtons,
  children,
  loading,
  bodyPadding = '1.25rem',
  hideHeader = false
}) => {
  return (
    <Card className={hideHeader ? 'custom-card' : ''}>
      {!hideHeader && (
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {title && (
                <h2 className="display-6 mb-0">
                  {title} {loading && <Spinner animation="border" size="sm" className="mb-2" />}
                </h2>
              )}
              {subtitle && <div className="card-text">{subtitle}</div>}
            </div>
            <div className="d-flex gap-2">
              {actionButtons?.map(({ onClick, icon, disabled }, idx) => (
                <button
                  disabled={disabled}
                  className="btn btn-sm btn-text-primary"
                  key={idx}
                  type="button"
                  onClick={onClick}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </Card.Header>
      )}
      <Card.Body style={{ padding: bodyPadding }} className="overflow-hidden">
        {children}
      </Card.Body>
    </Card>
  );
};
