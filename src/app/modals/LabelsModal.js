/**
 * @fileoverview Component to render the tasks filter modal 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { CheckIcon } from '../../logos';

class LabelsModal extends React.Component {
  render() {
    // return function to be used in map.
    const mapFunction = (list, addFunction, removeFunction) => {
      return label => (
        <div
          className="label"
          key={label.name}
          style={{ backgroundColor: label.color, display: 'block' }}
          onClick={() => (
            list.includes(label.id)
            ? removeFunction(label.id)
            : addFunction(label.id)
          )}
        >
          <p>{label.name}</p>
          <CheckIcon
            width={16}
            height={16}
            style={{ visibility: list.includes(label.id) ? 'visible' : 'hidden' }}
          />
        </div>
      );
    };

    if (this.props.modal === 'labels') {
      const subjects = this.props.subjects.map(mapFunction(this.props.subjectsFilter, id => this.props.onAddFilter('subjects', id), id => this.props.onRemoveFilter('subjects', id)));
      const categories = this.props.categories.map(mapFunction(this.props.categoriesFilter, id => this.props.onAddFilter('categories', id), id => this.props.onRemoveFilter('categories', id)));

      return (
        <div id="labels-modal" className="modal custom-scroll" style={{ left: '24px', top: '120px' }}>
          {subjects}
          {categories}
        </div>
      );
    }

    return null;
  }
}

export default LabelsModal;