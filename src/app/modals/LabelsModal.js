/**
 * @fileoverview Component to render the tasks filter modal 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { CheckIcon } from '../../logos';

class LabelsModal extends React.Component {
  render() {
    /**
     * @param list containing selected items 
     * @param changeFunction add or remove filter to list
     * @returns {Function} to be passed to .map 
     */
    const mapFunction = (list, changeFunction) => {
      return label => (
        <div
          className="label"
          key={label.name}
          style={{ backgroundColor: label.color, display: 'block', cursor: 'pointer' }} // Modifications to .label divs in modal 
          onClick={() => changeFunction(label.id)}
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

    // Filter tasks by labels ater TaskFilter
    if (this.props.modal === 'filter') {
      const subjects = this.props.subjects.map(mapFunction(this.props.subjectsFilter, id => this.props.onFilter('subjectsFilter', id)));
      const categories = this.props.categories.map(mapFunction(this.props.categoriesFilter, id => this.props.onFilter('categoriesFilter', id)));

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