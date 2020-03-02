import React from 'react';
import { UserIcon, GlobeIcon, LockIcon, ExitIcon, SettingsIcon } from '../../logos';

class ProfileModal extends React.Component {
  render() {
    // Position is set statically in CSS
    return (
      <div className="modal" id="profile-modal" style={this.props.modal.position}>
        <div>
          <UserIcon width={20} height={20} />
          <p>{this.props.user.email}</p>
        </div>
        <hr />
        <div>
          <LockIcon width={20} height={20} onClick={() => window.location.href = '/password'} />
          <p><a href="/password">Change Password</a></p>
        </div>
        <div>
          <ExitIcon width={20} height={20} onClick={() => window.location.href = '/logout'} />
          <p><a href="/logout">Log Out</a></p>
        </div>
        <div>
          <SettingsIcon width={20} height={20} onClick={() => this.props.onModal('settings')} />
          <p onClick={() => this.props.onModal('settings')}><a style={{ cursor: 'pointer' }}>Settings</a></p>
        </div>
      </div>
    );
  }
}

export default ProfileModal;