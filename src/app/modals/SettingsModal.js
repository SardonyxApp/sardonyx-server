/**
 * @fileoverview Component to render the tasklist settings and preferences modal. 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { 
  RemoveIcon, 
  UserIcon, 
  TasklistIcon, 
  InfoIcon, 
  LabelIcon, 
  AddIcon, 
  SchoolIcon, 
  BookIcon 
} from '../../logos';
import Label from '../components/Label';

class EditableLabel extends React.Component {
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

    if (label.name.length > 255) return this.handleError();

    this.props.onUpdateLabel(type, label);
  }

  handleKeyDown(e) {
    if (e.keyCode === 13 || e.keyCode === 27) {
      this.textRef.current.blur();
      e.preventDefault();
    }
  }

  handleDelete(type, id) {
    if (confirm('Once deleted, the label cannot be restored. Are you sure?')) {
      this.props.onDeleteLabel(type, id);
    }
  }

  handleError() {
    // Do not display red bottom border to avoid confusion in red background labels 
    alert('Labels cannot be over 255 characters long.');
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
          className="embed"
          spellCheck={false}
          style={{ cursor: this.state.selected ? 'auto' : 'pointer', minWidth: '24px', minHeight: '24px' }}
          onFocus={this.handleFocus}
          onBlur={() => this.handleBlur(this.props.type, this.props.label)}
          onKeyDown={e => this.handleKeyDown(e)}
          ref={this.textRef}
        >
          {this.props.label.name || ''}
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
  handleAdd(e, fn) {
    const position = e.target.nodeName === 'svg' ? e.target.getBoundingClientRect() : e.target.parentNode.getBoundingClientRect();
    fn(position);
  }

  render() {
    const subjects = this.props.subjects.map(label => <EditableLabel label={label} onDeleteLabel={this.props.onDeleteLabel} onUpdateLabel={this.props.onUpdateLabel} type="subjects" />);

    const categories = this.props.categories.map(label => <EditableLabel label={label} onDeleteLabel={this.props.onDeleteLabel} onUpdateLabel={this.props.onUpdateLabel} type="categories" />);

    const defaultSubjects = this.props.subjects
      .filter(l => this.props.user.subjects.includes(l.id))
      .map(label => <Label label={label} onUpdate={id => this.props.onUpdateUserLabel('subjects', id)} />);

    const defaultCategories = this.props.categories
      .filter(l => this.props.user.categories.includes(l.id))
      .map(label => <Label label={label} onUpdate={id => this.props.onUpdateUserLabel('categories', id)} />)

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
            <AddIcon onClick={e => this.handleAdd(e, position => this.props.onSecondModal('add-subject', document.documentElement.clientWidth - position.right, position.bottom + 8))} />
          </div>

          <div className="setting">
            <div className="heading">
              <LabelIcon />
              <h3 className="subheading">Category Labels</h3>
            </div>
            <p>These are used to indicate the type of the work. (e.g. Homework, Exam Preparation)</p>
            {categories}
            <AddIcon onClick={e => this.handleAdd(e, position => this.props.onSecondModal('add-category', document.documentElement.clientWidth - position.right, position.bottom + 8))} />
          </div>

          <div className="heading">
            <UserIcon width={36} height={36} />
            <h2>Account Preferences</h2>
          </div>

          <div className="setting">
            <div className="heading">
              <InfoIcon />
              <h3 className="subheading">Information</h3>
            </div>
            <p><b>Name</b>: {this.props.user.name || 'No name provided.'}</p>
            <p><b>Email</b>: {this.props.user.email || 'No email provided.'}</p>
            <p><b>User type</b>: {this.props.user.teacher ? 'Teacher' : 'Student'}</p>
            {this.props.user.teacher ? null : <p><b>Year group</b>: {this.props.tasklist.name}</p>}
          </div>

          <div className="setting">
            <div className="heading">
              <SchoolIcon />
              <h3 className="subheading">My subjects</h3>
            </div>
            <p>If you want to filter subjects by default, set them here.</p>
            {defaultSubjects}
            <AddIcon onClick={e => this.handleAdd(e, position => this.props.onSecondModal('default-subjects', position.left, position.bottom + 8))} />
          </div>

          <div className="setting">
            <div className="heading">
              <BookIcon />
              <h3 className="subheading">My task categories</h3>
            </div>
            <p>If you want to filter categories by default, set them here.</p>
            {defaultCategories}
            <AddIcon onClick={e => this.handleAdd(e, position => this.props.onSecondModal('default-categories', position.left, position.bottom + 8))} />
          </div>
        </div>
      </div>
    ) : null;
  }
}

export default SettingsModal;