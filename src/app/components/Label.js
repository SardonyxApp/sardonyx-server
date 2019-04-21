import React from 'react';
import { RemoveIcon } from '../../logos';

/**
 * @param {Object} props 
 * @param {Object} props.label contains id, name, color 
 * @param {Function} onUpdate passed id 
 */
const Label = props => {
  return (
    <div 
      className="label"
      style={{ backgroundColor: props.label.color, fill: 'white' }} 
      key={props.label.name} // Don't use id because it duplicates 
    >
      <p>{props.label.name}</p>
      <RemoveIcon 
        width={16} 
        height={16} 
        style={{ fill: 'white' }}
        onClick={() => props.onUpdate(props.label.id)} 
      />
    </div>
  );
};

export default Label;