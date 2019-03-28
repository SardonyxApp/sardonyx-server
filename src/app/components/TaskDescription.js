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
      selected: false,
      error: false
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

  handleBlur() {
    this.setState({
      selected: false,
      error: false // by default 
    });

    if (this.textareaRef.current.innerText.length > 65535)  {
      this.setState({
        error: true
      });
    } else {
      this.props.onUpdateTask({ description: this.textareaRef.current.innerText });
    }
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
      <React.Fragment>
        <div id="task-description" className="taskinfo-component">
          <DescriptionIcon />
          <p 
            contentEditable={true}
            className="embed"
            style={{ cursor: this.state.selected ? '' : 'pointer', borderBottom: this.state.selected ? '2px solid #2977b6' : this.state.error ? '2px solid #f44138' : '2px solid transparent' }}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeyDown}
            ref={this.textareaRef}
          >
            {this.props.description || '\n'}
          </p>
        </div>
        <p className="error-message" style={{ display: this.state.error ? '' : 'none', textAlign: 'right' }}>Description cannot be more than 65535 chracters long.</p>
      </React.Fragment>
    );
  }
}

export default TaskDescription;