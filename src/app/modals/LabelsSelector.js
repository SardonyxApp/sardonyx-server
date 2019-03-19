/**
 * @fileoverview Component to render the tasks selector modal 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { CheckIcon, RemoveIcon } from '../../logos';

class LabelsSelector extends React.Component {
  render() {
    const subjects = this.props.subjects.map(label => (
      <div 
        className="label" 
        key={label.name}
        style={{ backgroundColor: label.color, display: 'block' }}
        onClick={() => (
          this.props.subjectsFilter.includes(label.id) 
          ? this.props.onRemoveFilter('subjects', label.id) 
          : this.props.onAddFilter('subjects', label.id)
        )}
      >
        <p>{label.name}</p>
        {
          this.props.subjectsFilter.includes(label.id) 
          ? <CheckIcon width={16} height={16} /> 
          : null
        }
      </div>
    ));
    
    const categories = this.props.categories.map(label => (
      <div 
        className="label" 
        key={label.name}
        style={{ backgroundColor: label.color, display: 'block' }}
        onClick={() => (
          this.props.categoriesFilter.includes(label.id) 
          ? this.props.onRemoveFilter('categories', label.id) 
          : this.props.onAddFilter('categories', label.id)
        )}
      >
        <p>{label.name}</p>
        {
          this.props.categoriesFilter.includes(label.id) 
          ? <CheckIcon width={16} height={16} /> 
          : null
        }
      </div>
    ));

    return this.props.modal === 'labels' ? (
      <div id="labels-selector" className="modal">
        <RemoveIcon onClick={() => this.props.onModal(null)}/>
        <div id="labels-container" className="custom-scroll">
          {subjects}
          {categories}
        </div>
      </div>
    ) : null;
  }
}

export default LabelsSelector;