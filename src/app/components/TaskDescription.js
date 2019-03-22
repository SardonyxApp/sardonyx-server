/**
 * @fileoverview Component to render the description for a task in info view. 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { DescriptionIcon } from '../../logos';

class TaskDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };

    this.textareaRef = React.createRef();

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleFocus() {
    this.setState({
      selected: true
    });
  }

  handleBlur(e) {
    this.props.onChangeTask('description', e.target.innerText);

    this.setState({
      selected: false 
    });

    // make request 
  }

  handleKeyDown(e) {
    if (e.keyCode === 27) {
      this.textareaRef.current.blur();
      // This will trigger handleBlur
      e.preventDefault();
    }
  }

  render() {
    return (
      <div id="task-description" className="taskinfo-component">
        <DescriptionIcon />
        <p 
          contentEditable={true}
          className="embed"
          style={{ cursor: this.state.selected ? '' : 'pointer', borderBottom: this.state.selected ? '2px solid #2977b6' : '2px solid transparent' }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          ref={this.textareaRef}
        >
          {this.props.description}
        </p>
      </div>
    );
  }
}

export default TaskDescription;