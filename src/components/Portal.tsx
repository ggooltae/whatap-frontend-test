import React from 'react';
import { createPortal } from 'react-dom';

interface IPortal {
  children: React.ReactNode;
}

function Portal({ children }: IPortal) {
  return createPortal(
    children,
    document.getElementById('portal-root') || document.body,
  );
}

export default Portal;
