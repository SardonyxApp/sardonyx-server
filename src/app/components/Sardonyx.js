/**
 * @fileoverview Component to render "Sardonyx"
 * @author SardonyxApp
 * @license MIT
 */

import React from 'react';
import { IconInverted } from '../../logos';

class Sardonyx extends React.Component {
  render() {
    return (
      <div id="sardonyx">
        <IconInverted width={32} height={32}/>
        <h1 style={{ lineHeight: '36px', fontSize: '24px', marginLeft: '4px' }}>Sardonyx</h1>
      </div>
    );
  }
}

export default Sardonyx;