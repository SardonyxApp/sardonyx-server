import React from 'react';
import { RemoveIcon, Icon, InfoIcon, AddToListIcon, DescriptionIcon } from '../../logos';

class InfoModal extends React.Component {
  handleNavigation(e) {
    this.props.onModal('settings');
    e.preventDefault();
  }

  render() {
    return (
      <div id="info-modal" className="modal custom-scroll">
        <RemoveIcon onClick={() => this.props.onModal()} />
        <div id="info-container" className="content-container">
          
          <div className="heading">
            <Icon width={36} height={36} />
            <h2>Sardonyx</h2>
          </div>

          <div className="section">
            <p>Thank you for using Sardonyx. Sardonyx is a group tasklist application for students and teachers. Sardonyx was made for students to keep track of schoolwork and for teachers to understand the amount of work students are getting at the moment.</p>
            <p>Sardonyx is most useful when users set their default subjects and task categories. By doing so, the application will automatically filter the tasks for you on startup. You can change your preferences in the <a href="" onClick={e => this.handleNavigation(e)}> settings panel</a>.</p>
            <p>Sardonyx allows you to create and edit cards with titles, labels, descriptions, and due dates. If more features are requested, they will be considered.</p>
            <p>If you find any bugs (mistakes) in the application, please report them to the authors.</p>
          </div>

          <div className="section">
            <div className="heading">
              <InfoIcon style={{ cursor: 'auto' }} />
              <h3 className="subheading">About</h3>
            </div>
            <p>&#169; 2018-2019 SardonyxApp</p>
            <p>You are running:</p>
            <ul>
              <li>Version: <b>Sardonyx Web App v1.1.0</b></li>
              <li>Stable Release Build</li>
              <li>Released: June 22 2019</li>
              <li>Source code: <a href="https://github.com/SardonyxApp/sardonyx-server" target="_blank">See on GitHub</a></li>
            </ul>
            <p>To view the changelog, please see <a href="/changelog">here.</a></p>
            <p><a href="/terms">Terms of Service</a> | <a href="/privacy">Privacy Policy</a></p>
          </div>

          <div className="section">
              <div className="heading">
                <DescriptionIcon />
                <h3 className="subheading">FAQ</h3>
              </div>
              <div className="subsection">
                <p><b>How do I create new tasks?</b></p>
                <p>Click on the <AddToListIcon style={{ cursor: 'auto', verticalAlign: 'middle' }} /> icon at the top right menu, choose "add task", then enter the name of the task.</p>
              </div>
              <div className="subsection">
                <p><b>How do I edit tasks?</b></p>
                <p>Choose a task from the list on the left, then simpmly click on the field you want to edit in the detailed view on the right.</p>
              </div>
              <div className="subsection">
                <p><b>How do I delete tasks?</b></p>
                <p>Select a task from the list on the left, then simply click on "delete task" at the bottom. Do this carefully, as this action cannot be reversed.</p>
              </div>
              {this.props.user.teacher ? (
                <div className="subsection">
                  <p><b>How do I switch between tasklists?</b></p>
                  <p>Click on the name of the tasklist on the top menu, then select the tasklist of your choice.</p>
                </div>
              ) : null}
              {this.props.user.teacher ? (<div className="subsection">
                  <p><b>How do I change my default tasklist?</b></p>
                  <p>In the <a href="" onClick={e => this.handleNavigation(e)}>settings panel</a>, you can change your account preferences at the bottom.</p>
                </div>
              ) : null}
              <div className="subsection">
                <p><b>How do I share links related to tasks?</b></p>
                <p>Links can be placed in the description of the task. When you finish editing, they will automatically embedded.</p>
              </div>
              <div className="subsection">
                <p><b>How do I upload files related to tasks?</b></p>
                <p>Sardonyx cannot store files for now. Please use services like <a href="https://drive.google.com" target="_blank">Google Drive</a>, <a href="https://onedrive.com" target="_blank">OneDrive</a>, or <a href="https://send.firefox.com" target="_blank">FireFox Send</a> to securely host your files, then link the URL to the file in the description.</p>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InfoModal;