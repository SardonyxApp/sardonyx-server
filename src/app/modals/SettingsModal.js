/**
 * @fileoverview Component to render the tasklist settings and preferences modal. 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { RemoveIcon, UserIcon, TasklistIcon, InfoIcon, LabelIcon } from '../../logos';

class SettingsModal extends React.Component {
  render() {
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
              <h3 className="subheading">Labels</h3>
            </div>
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