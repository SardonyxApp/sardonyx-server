/**
 * @fileoverview Component to render the search filter of tasks by label.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { SearchIcon, AddIcon, RemoveIcon } from '../../logos';

class TasksFilter extends React.Component {
  componentDidMount() {
    // Add methods to change parent state here because icons are React elements that do not get triggered by onClick
    document.getElementById('tasks-filter').addEventListener('click', e => {
      if (e.target.nodeName === 'svg') {
        this.props.onRemoveFilter(e.target.parentNode.dataset.labelType, Number(e.target.parentNode.dataset.labelId));
      } else if (e.target.nodeName === 'path') {
        this.props.onRemoveFilter(e.target.parentNode.parentNode.dataset.labelType, Number(e.target.parentNode.parentNode.dataset.labelId));
      }
    });
  }

  render() {
    const subjects = this.props.subjects
      .filter(label => this.props.subjectsFilter.includes(label.id))
      .map(label => (
        <div 
          className="label" 
          data-label-type="subjects"
          data-label-id={label.id}
          style={{ backgroundColor: label.color, fill: 'white' }} 
          key={label.name} // Don't use id because it duplicates 
        >
          <p>{label.name}</p>
          <RemoveIcon width={16} height={16}/>
        </div>
      ));
    const categories = this.props.categories
      .filter(label => this.props.categoriesFilter.includes(label.id))
      .map(label => (
        <div 
          className="label" 
          data-label-type="categories"
          data-label-id={label.id}
          style={{ backgroundColor: label.color, fill: 'white' }} 
          key={label.name} // Don't use id because it duplicates 
        >
          <p>{label.name}</p>
          <RemoveIcon width={16} height={16}/>
        </div>
      ));
      // The repetition here is not preferable but it will do for now 

    return (
      <div id="tasks-filter" className="custom-scroll">
        <SearchIcon /> 
        {subjects}
        {categories}
        <AddIcon />
      </div>
    );
  }
}

export default TasksFilter;