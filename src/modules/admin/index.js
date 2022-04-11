import React from 'react'
import { Redirect } from 'react-router-dom';

import { AdminPanel } from './AdminPanel';

function Admin({ isAdmin }) {
  return !isAdmin ? <Redirect to={'/'} /> : <AdminPanel />;
}

export {
  Admin
}