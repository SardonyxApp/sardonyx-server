/**
 * @fileoverview Component to render the tasklist settings and preferences modal. 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { RemoveIcon, UserIcon, TasklistIcon, InfoIcon, LabelIcon, AddIcon } from '../../logos';

class Label extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };

    this.textRef = React.createRef();

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleFocus() {
    this.setState({
      selected: true
    });
  }

  handleBlur(type, label) {
    this.setState({
      selected: false
    });
    
    label = Object.assign(label, {
      name: this.textRef.current.innerText
    });

    this.props.onUpdateLabel(type, label);
  }

  handleKeyDown(e) {
    if (e.keyCode === 13 || e.keyCode === 27) {
      this.textRef.current.blur();
    }
  }

  handleDelete(type, id) {
    if (confirm('Once deleted, the label cannot be restored. Are you sure?')) {
      this.props.onDeleteLabel(type, id);
    }
  }

  render() {
    return (
      <div
        className="label"
        key={this.props.label.name}
        style={{ backgroundColor: this.props.label.color, padding: '4px 12px' }} // Modifications to .label divs in modal
      >
        <p 
          contentEditable
          style={{ cursor: this.state.selected ? 'auto' : 'pointer' }}
          onFocus={this.handleFocus}
          onBlur={() => this.handleBlur(this.props.type, this.props.label)}
          onKeyDown={e => this.handleKeyDown(e)}
          ref={this.textRef}
        >
          {this.props.label.name || '\n'}
        </p>
        <RemoveIcon 
          height={20}
          width={20}
          style={{ marginLeft: '4px', fill: '#fff' }}
          onClick={() => this.handleDelete(this.props.type, this.props.label.id)}
        />
      </div>
    );
  }
}

class SettingsModal extends React.Component {
  render() {
    const subjects = this.props.subjects.map(label => <Label label={label} onDeleteLabel={this.props.onDeleteLabel} onUpdateLabel={this.props.onUpdateLabel} type="subjects" />);
    const categories = this.props.categories.map(label => <Label label={label} onDeleteLabel={this.props.onDeleteLabel} onUpdateLabel={this.props.onUpdateLabel} type="categories" />);

    return this.props.modal.name === 'settings' ? (
      <div id="settings-modal" className="modal">
        <RemoveIcon onClick={() => this.props.onModal()} />
        <div id="settings-container" className="content-container">
          <div className="heading">
            <TasklistIcon width={36} height={36} />
            <h2>Tasklist Settings</h2>
          </div>
          <div className="setting">
            <div className="heading">
              <InfoIcon />
              <h3 className="subheading">Information</h3>
            </div>
            <p><b>Name</b>: {this.props.tasklist.name || 'No name provided.'}</p>
            <p><b>Description</b>: {this.props.tasklist.description || 'No description provided.'}</p>
          </div>
          <div className="setting">
            <div className="heading">
              <LabelIcon />
              <h3 className="subheading">Subject Labels</h3>
            </div>
            <p>These are used to indicate the subject of the task. (e.g. Mathematics, English)</p>
            {subjects}
            <AddIcon onClick={e => {
              const position = e.target.nodeName === 'svg' ? e.target.getBoundingClientRect() : e.target.parentNode.getBoundingClientRect();
              this.props.onSecondModal('add-subject', document.documentElement.clientWidth - position.right, position.bottom + 8);
            }} />
          </div>
          <div className="setting">
            <div className="heading">
              <LabelIcon />
              <h3 className="subheading">Category Labels</h3>
            </div>
            <p>These are used to indicate the type of the work. (e.g. Homework, Exam Preparation)</p>
            {categories}
            <AddIcon onClick={e => {
              const position = e.target.nodeName === 'svg' ? e.target.getBoundingClientRect() : e.target.parentNode.getBoundingClientRect();
              this.props.onSecondModal('add-category', document.documentElement.clientWidth - position.right, position.bottom + 8);
            }} />
          </div>
          <div className="heading">
            <UserIcon width={36} height={36} />
            <h2>Account Preferences</h2>
          </div>
        </div>
      </div>
    ) : null;
  }
}

export default SettingsModal;