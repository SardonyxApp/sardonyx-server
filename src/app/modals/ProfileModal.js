/**
 * @fileoverview Component to render the profile modal.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { UserIcon } from '../../logos';

class ProfileModal extends React.Component {
  render() {
    // Position is set statically in CSS
    return this.props.modal.name === 'profile' ? (
      <div className="modal" id="profile-modal">
        <div>
          <UserIcon width={16} height={16} />
          <p>{this.props.user.email}</p>
        </div>
        <hr />
        <p><a href="https://kokusaiib.managebac.com" target="_blank">Open Managebac</a></p>
        <p style={{ display: this.props.user.teacher ? '' : 'none' }}>Change Password</p>
        <p><a href="/logout">Log out</a></p>
      </div>
    ) : null;
  }
}

export default ProfileModal;