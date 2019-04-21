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

class SettingsModal extends React.Component {
  handleAdd(e, fn) {
    const position = e.target.nodeName === 'svg' || e.target.nodeName === 'DIV' ? e.target.getBoundingClientRect() : e.target.parentNode.getBoundingClientRect();
    fn(position);
  }

  render() {
    const subjects = this.props.subjects.map(label => <Label 
      label={label} 
      onRemove={() => {
        if (confirm('Once deleted, the label cannot be restored. Are you sure?')) {
          this.props.onDeleteLabel('subjects', label.id);
        }
      }} 
      onUpdate={e => this.handleAdd(e, position => this.props.onSecondModal('edit-subject', position.right, position.bottom, { label_id: label.id }))} 
      removable={true}
      updatable={true}
    />);

    const categories = this.props.categories.map(label => <Label 
      label={label} 
      onRemove={() => {
        if (confirm('Once deleted, the label cannot be restored. Are you sure?')) {
          this.props.onDeleteLabel('categories', label.id);
        }
      }} 
      onUpdate={e => this.handleAdd(e, position => this.props.onSecondModal('edit-category', position.right, position.bottom, { label_id: label.id }))} 
      removable={true}
      updatable={true}
    />);

    const defaultSubjects = this.props.subjects
      .filter(l => this.props.user.subjects.includes(l.id))
      .map(label => <Label label={label} onRemove={id => this.props.onUpdateUserLabel('subjects', id)} removable={true} />);

    const defaultCategories = this.props.categories
      .filter(l => this.props.user.categories.includes(l.id))
      .map(label => <Label label={label} onRemove={id => this.props.onUpdateUserLabel('categories', id)} removable={true} />)

    return (
      <div id="settings-modal" className="modal">
        <RemoveIcon onClick={() => this.props.onModal()} />
        <div id="settings-container" className="content-container">

          <div className="heading">
            <TasklistIcon width={36} height={36} />
            <h2>Tasklist Settings</h2>
          </div>

          <div className="section">
            <div className="heading">
              <InfoIcon style={{ cursor: 'auto' }} />
              <h3 className="subheading">Information</h3>
            </div>
            <p><b>Name</b>: {this.props.tasklist.name || 'No name provided.'}</p>
            <p><b>Description</b>: {this.props.tasklist.description || 'No description provided.'}</p>
          </div>

          <div className="section">
            <div className="heading">
              <LabelIcon />
              <h3 className="subheading">Subject Labels</h3>
            </div>
            <p>These are used to indicate the subject of the task. (e.g. Mathematics, English)</p>
            {subjects}
            <AddIcon onClick={e => this.handleAdd(e, position => this.props.onSecondModal('add-subject', position.right, position.bottom + 8))} />
          </div>

          <div className="section">
            <div className="heading">
              <LabelIcon />
              <h3 className="subheading">Category Labels</h3>
            </div>
            <p>These are used to indicate the type of the work. (e.g. Homework, Exam Preparation)</p>
            {categories}
            <AddIcon onClick={e => this.handleAdd(e, position => this.props.onSecondModal('add-category', position.right, position.bottom + 8))} />
          </div>

          <div className="heading">
            <UserIcon width={36} height={36} />
            <h2>Account Preferences</h2>
          </div>

          <div className="section">
            <div className="heading">
              <InfoIcon style={{ cursor: 'auto' }} />
              <h3 className="subheading">Information</h3>
            </div>
            <p><b>Name</b>: {this.props.user.name || 'No name provided.'}</p>
            <p><b>Email</b>: {this.props.user.email || 'No email provided.'}</p>
            <p><b>User type</b>: {this.props.user.teacher ? 'Teacher' : 'Student'}</p>
            {this.props.user.teacher ? (
              <p>
                <b>Default tasklist</b>: 
                <select className="dropdown" onChange={e => this.props.onChangeUserTasklist(Number(e.target.value))}>
                  {this.props.tasklists.map(t => (
                    <option selected={t.id == this.props.user.tasklistId ? 'selected' : ''} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </p> 
            ) : (<p><b>Year group</b>: {this.props.tasklist.name}</p>)}
          </div>

          <div className="section">
            <div className="heading">
              <SchoolIcon />
              <h3 className="subheading">My subjects</h3>
            </div>
            <p>If you want to filter subjects by default, set them here.</p>
            {defaultSubjects}
            <AddIcon onClick={e => this.handleAdd(e, position => this.props.onSecondModal('default-subjects', position.right, position.bottom + 8))} />
          </div>

          <div className="section">
            <div className="heading">
              <BookIcon />
              <h3 className="subheading">My task categories</h3>
            </div>
            <p>If you want to filter categories by default, set them here.</p>
            {defaultCategories}
            <AddIcon onClick={e => this.handleAdd(e, position => this.props.onSecondModal('default-categories', position.right, position.bottom + 8))} />
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsModal;