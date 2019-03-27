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
          onClick={() => changeFunction(label)}
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

    let subjects, categories;

    // Prepare task labels
    if (this.props.modal.name === 'filter') {
      subjects = this.props.subjects.map(mapFunction(this.props.subjectsFilter, l => this.props.onFilter('subjectsFilter', l.id)));
      categories = this.props.categories.map(mapFunction(this.props.categoriesFilter, l => this.props.onFilter('categoriesFilter', l.id)));
    }

    if (this.props.modal.name === 'labels' || this.props.modal.name === 'subjects' || this.props.modal.name === 'categories') {
      subjects = this.props.subjects.map(mapFunction([this.props.task.subject_id], l => {
        this.props.onModal();
        this.props.task.subject_id !== l.id ? this.props.onChangeTask({
            subject_id: l.id,
            subject_name: l.name,
            subject_color: l.color
          }) : this.props.onChangeTask({
            subject_id: null,
            subject_name: null,
            subject_color: null
          });
      }));

      categories = this.props.categories.map(mapFunction([this.props.task.category_id], l => {
        this.props.onModal();
        this.props.task.category_id !== l.id ? this.props.onChangeTask({
            category_id: l.id,
            category_name: l.name,
            category_color: l.color
          }) : this.props.onChangeTask({
            category_id: null,
            category_name: null,
            category_color: null
          });
      }));
    }

    // Render
    if (['subjects', 'categories', 'labels', 'filter'].includes(this.props.modal.name)) {
      let render = [];

      if (this.props.modal.name === 'subjects') {
        render = subjects;
      }

      if (this.props.modal.name === 'categories') {
        render = categories;
      }

      else {
        render = [...subjects, ...categories];
      }

      return (
        <div 
          id="labels-modal" 
          className="modal custom-scroll" 
          style={{ left: this.props.modal.x, top: this.props.modal.y, maxHeight: document.documentElement.clientHeight - this.props.modal.y - 40 }}
        >
          {render}
        </div>
      );
    }

    return null;
  }
}

export default LabelsModal;