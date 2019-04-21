import React from 'react';

class TaskTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      error: false
    };

    this.inputRef = React.createRef();

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.title !== nextProps.title) {
      if (this.state.selected && nextState.selected) return false;
      if (this.state.error && nextState.error) return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.title !== this.props.title)  {
      this.setState({
        error: false
      });
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

    if (this.inputRef.current.innerText.length > 255) {
      return this.setState({
        error: true
      });
    } 
    
    this.props.onUpdateTask({ id: this.props.id, name: this.inputRef.current.innerText });
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
          className="embed"
          spellCheck={false}
          style={{ cursor: this.state.selected ? '' : 'pointer', borderBottom: this.state.selected ? '2px solid #2977b6' : this.state.error ? '2px solid #f44138' : '2px solid transparent' }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          ref={this.inputRef}
        >{this.props.title}</h2>
        <p className="error-message" style={{ display: this.state.error ? '' : 'none', textAlign: 'right' }}>Title cannot be more than 255 characters long.</p>
      </div>
    );
  }
}

export default TaskTitle;