import React from 'react';
import { SearchIcon, AddIcon } from '../../logos';
import Label from './Label';

class TasksFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  // Event listener for icons to open filter modal 
  handleClick(e) {
    const position = e.target.nodeName === 'svg' || e.target.nodeName === 'p' ? e.target.getBoundingClientRect() : e.target.parentNode.getBoundingClientRect();
    this.props.onModal('filter', { left: position.left, top: position.bottom, maxHeight: document.documentElement.clientHeight - position.bottom - 44 });
  }

  render() {
    const subjects = this.props.subjects
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(label => this.props.subjectsFilter.includes(label.id))
      .map(label => <Label label={label} onRemove={id => this.props.onFilter('subjectsFilter', id)} removable={true} />);

    const categories = this.props.categories
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(label => this.props.categoriesFilter.includes(label.id))
      .map(label => <Label label={label} onRemove={id => this.props.onFilter('categoriesFilter', id)}  removable={true} />);

    return (
      <div id="tasks-filter" className="custom-scroll">
        <SearchIcon onClick={this.handleClick}/> 
        {subjects}
        {categories}
        {!subjects.length && !categories.length ? <p className="overview-description" style={{ cursor: 'pointer' }} onClick={this.handleClick}>Filter labels...</p> : null}
        <AddIcon onClick={this.handleClick}/>
      </div>
    );
  }
}

export default TasksFilter;