import React from 'react';
import { RemoveIcon } from '../../logos';

/**
 * @param {Object} props 
 * @param {Object} props.label 
 * @param {Object} props.label.id required if updatable or removable
 * @param {Object} props.label.name required 
 * @param {Object} props.label.color required
 * @param {Function} props.onUpdate passed id 
 * @param {Function} props.onRemove passed id 
 * @param {Boolean} props.updatable if true, onUpdate will be triggered when clicked on the body 
 * @param {Bololean} props.removable if true, onRemove will be triggered when clicked on RemoveIcon
 */
const Label = props => {
  return (
    <div 
      className="label"
      style={{ 
        backgroundColor: props.label.color, 
        cursor: props.updatable ? 'pointer' : '' 
      }} 
      key={props.label.name} // Don't use id because it duplicates 
      onClick={props.updatable ? props.onUpdate : null}
    >
      <p>{props.label.name}</p>
      {props.removable ? <RemoveIcon 
        width={16} 
        height={16} 
        style={{ fill: 'white' }}
        onClick={e => {
          e.stopPropagation();
          props.onRemove(props.label.id);
        }}
      /> : null}
    </div>
  );
};

export default Label;