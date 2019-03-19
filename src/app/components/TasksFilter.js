/**
 * @fileoverview Component to render the search filter of tasks by label.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { SearchIcon, AddIcon, RemoveIcon } from '../../logos';

class TasksFilter extends React.Component {
  render() {
    const subjects = this.props.subjects
      .filter(label => this.props.subjectsFilter.includes(label.id))
      .map(label => (
        <div 
          className="label"
          style={{ backgroundColor: label.color, fill: 'white' }} 
          key={label.name} // Don't use id because it duplicates 
        >
          <p>{label.name}</p>
          <RemoveIcon width={16} height={16} onClick={() => this.props.onRemoveFilter('subjects', label.id)}/>
        </div>
      ));
    const categories = this.props.categories
      .filter(label => this.props.categoriesFilter.includes(label.id))
      .map(label => (
        <div 
          className="label" 
          style={{ backgroundColor: label.color, fill: 'white' }} 
          key={label.name} // Don't use id because it duplicates 
        >
          <p>{label.name}</p>
          <RemoveIcon width={16} height={16} onClick={() => this.props.onRemoveFilter('categories', label.id)}/>
        </div>
      ));
      // The repetition here is not preferable but it will do for now 

    return (
      <div id="tasks-filter" className="custom-scroll">
        <SearchIcon onClick={() => this.props.onModal('labels')}/> 
        {subjects}
        {categories}
        <AddIcon onClick={() => this.props.onModal('labels')}/>
      </div>
    );
  }
}

export default TasksFilter;