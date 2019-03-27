/**
 * @fileoverview Component to render the profile modal.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { UserIcon, GlobeIcon, LockIcon, ExitIcon } from '../../logos';

class ProfileModal extends React.Component {
  render() {
    // Position is set statically in CSS
    return this.props.modal.name === 'profile' ? (
      <div className="modal" id="profile-modal" style={{ right: this.props.modal.x, top: this.props.modal.y }}>
        <div>
          <UserIcon width={20} height={20} />
          <p>{this.props.user.email}</p>
        </div>
        <hr />
        <div>
          <GlobeIcon width={20} height={20} onClick={() => window.open('https://kokusaiib.managebac.com', '_blank')}/>
          <p><a href="https://kokusaiib.managebac.com" target="_blank">Open Managebac</a></p>
        </div>
        <div style={{ display: this.props.user.teacher ? '' : 'none' }}>
          <LockIcon width={20} height={20} onClick={() => window.location.replace('/password')}/>
          <p><a href="/password">Change Password</a></p>
        </div>
        <div>
          <ExitIcon width={20} height={20} onClick={() => window.location.replace('/logout')}/>
          <p><a href="/logout">Log Out</a></p>
        </div>
      </div>
    ) : null;
  }
}

export default ProfileModal;