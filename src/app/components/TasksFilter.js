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
          <RemoveIcon width={16} height={16} onClick={() => this.props.onFilter('subjectsFilter', label.id)}/>
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
          <RemoveIcon width={16} height={16} onClick={() => this.props.onFilter('categoriesFilter', label.id)}/>
        </div>
      ));
      // The repetition here is not preferable but it will do for now 

    return (
      <div id="tasks-filter" className="custom-scroll">
        <SearchIcon onClick={e => {
          const position = e.target.getBoundingClientRect();
          this.props.onModal('filter', position.left, position.bottom + 4);
        }}/> 
        {subjects}
        {categories}
        <AddIcon onClick={e => {
          const position = e.target.getBoundingClientRect();
          this.props.onModal('filter', position.left, position.bottom + 4);
        }}/>
      </div>
    );
  }
}

export default TasksFilter;