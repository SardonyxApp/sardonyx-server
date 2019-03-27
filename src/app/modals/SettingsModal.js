/**
 * @fileoverview Component to render the tasklist settings and preferences modal. 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { RemoveIcon, UserIcon, TasklistIcon, InfoIcon, LabelIcon } from '../../logos';

class Label extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };

    this.textRef = React.createRef();
  }

  handleFocus() {
    this.setState({
      selected: true
    });
  }

  handleBlur() {
    this.setState({
      selected: false
    });
  }

  handleKeyDown(e) {
    if (e.keyCode === 27) {
      this.textRef.current.blur();
    }
  }

  render() {
    return (
      <div
        className="label"
        key={this.props.label.name}
        style={{ backgroundColor: this.props.label.color, cursor: 'pointer', padding: '4px 12px' }} // Modifications to .label divs in modal
      >
        <p contentEditable>{this.props.label.name || '\n'}</p>
        <RemoveIcon 
          height={20}
          width={20}
          style={{ marginLeft: '4px', fill: '#fff' }}
          // onClick={/*handle delete*/}
        />
      </div>
    );
  }
}

class SettingsModal extends React.Component {
  render() {
    const subjects = this.props.subjects.map(label => <Label label={label}/>);
    const categories = this.props.categories.map(label => <Label label={label}/>);

    return this.props.modal.name === 'settings' ? (
      <div id="settings-modal" className="modal">
        <RemoveIcon />
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
              <p>These are used to indicate the subject of the task. (e.g. Mathematics, English)</p>
            </div>
            {subjects}
          </div>
          <div className="setting">
            <div className="heading">
              <LabelIcon />
              <h3 className="subheading">Category Labels</h3>
              <p>These are used to indicate the type of the work. (e.g. Homework, Exam Preparation)</p>
            </div>
            {categories}
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