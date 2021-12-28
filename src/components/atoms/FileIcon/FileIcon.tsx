import React from 'react';
import { Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaRegFilePdf } from 'react-icons/fa';
import './FileIcon.scss';

export interface IFileIconProps {
  loading: boolean;
  file: string;
  size?: 'sm' | 'lg';
}

export function FileIcon({ loading, file, size }: IFileIconProps) {
  return (
    <div className="fileIcon">
      <a
        href={file}
        target={'n_blank'}
        className="pdf-icon"
        style={{ fontSize: `${size === 'sm' ? '1rem' : '2rem'}` }}>
        <FaRegFilePdf />
      </a>
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <span className="pdf-icon text-success">
          <FaCheckCircle />
        </span>
      )}
    </div>
  );
}
