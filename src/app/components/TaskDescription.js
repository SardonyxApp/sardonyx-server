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

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.description != nextProps.description) { // React does not recommend deep equality checks in shouldComponentUpdate lifecycle 
      if (this.state.selected && nextState.selected) return false;
      if (this.state.error && nextState.error) return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    // If current task is changed, error should be reset. If task is hidden, error gets automatically reset as it is unmounted.
    if (prevProps.description !== this.props.description)  {
      this.setState({
        error: false
      });
    }
  }

  handleMouseDown(e) {
    if (e.target.nodeName === 'A' && !this.state.selected) {
      this.textareaRef.current.blur();
      window.open(e.target.getAttribute('href'), '_blank');
      e.preventDefault();
    }
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
      return this.setState({
        error: true
      });
    }

    this.props.onUpdateTask({ id: this.props.id, description: this.textareaRef.current.innerText });
  }

  handleKeyDown(e) {
    if (e.keyCode === 27) {
      this.textareaRef.current.blur();
      // This will trigger handleBlur
      e.preventDefault();
    }
  }

  render() {
    const desc = this.props.description ? this.props.description.replace(/https?:\/\/[^\s/$.?#].[^\s]*/g, '<a href="$&" style="cursor:pointer">$&</a>') : '\n'; 
    return (
      <React.Fragment>
        <div id="task-description" className="taskinfo-component">
          <DescriptionIcon />
          <p 
            contentEditable={true}
            className="embed"
            spellCheck={false}
            style={{ cursor: this.state.selected ? '' : 'pointer', borderBottom: this.state.selected ? '2px solid #2977b6' : this.state.error ? '2px solid #f44138' : '2px solid transparent' }}
            onMouseDown={this.handleMouseDown}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeyDown}
            ref={this.textareaRef}
            dangerouslySetInnerHTML={{__html: desc}}
          >
          </p>
        </div>
        <p className="error-message" style={{ display: this.state.error ? '' : 'none', textAlign: 'right' }}>Description cannot be more than 65535 chracters long.</p>
      </React.Fragment>
    );
  }
}

export default TaskDescription;