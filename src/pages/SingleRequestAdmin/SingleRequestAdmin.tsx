import React from 'react';
import { useParams } from 'react-router';

export interface ISingleRequestAdminProps {}

export function SingleRequestAdmin(props: ISingleRequestAdminProps) {
  let params = useParams();
  return <div>SingleRequestAdmin: {params.requestId}</div>;
}
