import React from 'react';
import { IconInverted } from '../../logos';

const Sardonyx = () => (
<<<<<<< HEAD
  <div id="sardonyx" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
=======
  <div id="sardonyx" style={{ cursor: 'pointer' }} onClick={() => window.location.replace('/?redirect=false')}>
>>>>>>> dev-board
    <IconInverted width={32} height={32} />
    <h1 style={{ lineHeight: '36px', fontSize: '24px', marginLeft: '4px' }}>Sardonyx</h1>
  </div>
);

export default Sardonyx;