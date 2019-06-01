/**
 * @fileoverview Component to render "Sardonyx"
 * @author SardonyxApp
 * @license MIT
 */

import React from 'react';
import { IconInverted } from '../../logos';

const Sardonyx = () => (
  <div id="sardonyx" style={{ cursor: 'pointer' }} onClick={() => window.location.replace('/?redirect=false')}>
    <IconInverted width={32} height={32} />
    <h1 style={{ lineHeight: '36px', fontSize: '24px', marginLeft: '4px' }}>Sardonyx</h1>
  </div>
);

export default Sardonyx;