/**
 * @fileoverview Component for rendering the title of a task in info view.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class TaskTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };

    this.inputRef = React.createRef();

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
    this.setState({
      selected: false
    });

    this.props.onChangeTask('name', e.target.innerText)

    // make request here 
  }

  handleKeyDown(e) {
    if (e.keyCode === 13 || e.keyCode === 27) {
      this.inputRef.current.blur();
      // This will trigger handleBlur
      e.preventDefault();
    }
  }

  render() {
    return (
      <div id="task-title">
        <h2
          contentEditable={true}
          style={{ cursor: this.state.selected ? '' : 'pointer', borderBottom: this.state.selected ? '2px solid #2977b6' : '2px solid transparent' }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          ref={this.inputRef}
        >{this.props.title}</h2>
      </div>
    );
  }
}

export default TaskTitle;