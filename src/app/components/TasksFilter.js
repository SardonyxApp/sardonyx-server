/**
 * @fileoverview Component to render the search filter of tasks by label.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { SearchIcon, AddIcon } from '../../logos';
import Label from './Label';

class TasksFilter extends React.Component {
  // Event listener for icons to open filter modal 
  handleClick(e) {
    const position = e.target.nodeName === 'svg' ? e.target.getBoundingClientRect() : e.target.parentNode.getBoundingClientRect();
    this.props.onModal('filter', position.left, position.bottom + 4);
  }

  render() {
    const subjects = this.props.subjects
      .filter(label => this.props.subjectsFilter.includes(label.id))
      .map(label => <Label label={label} onUpdate={id => this.props.onFilter('subjectsFilter', id)} />);

    const categories = this.props.categories
      .filter(label => this.props.categoriesFilter.includes(label.id))
      .map(label => <Label label={label} onUpdate={id => this.props.onFilter('categoriesFilter', id)} />);

    return (
      <div id="tasks-filter" className="custom-scroll">
        <SearchIcon onClick={e => this.handleClick(e)}/> 
        {subjects}
        {categories}
        <AddIcon onClick={e => this.handleClick(e)}/>
      </div>
    );
  }
}

export default TasksFilter;