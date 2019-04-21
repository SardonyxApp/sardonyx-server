import React from 'react';
import { UserIcon, AddToListIcon, SettingsIcon, InfoIcon } from '../../logos'; // use this as avatar for now

class User extends React.Component {
  constructor(props) {
    super(props);

    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd(e) {
    // if target is <path>, use coordinates of parent <svg>
    const position = e.target.nodeName === 'svg' ? e.target.getBoundingClientRect() : e.target.parentNode.getBoundingClientRect(); 
    this.props.onModal('add', position.right, 50);
  }

  render() {
    return (
      <div id="user">
        <InfoIcon onClick={() => this.props.onModal('info')} />
        <SettingsIcon onClick={() => this.props.onModal('settings')} />
        <AddToListIcon onClick={e => this.handleAdd(e)} />
        <h4 onClick={() => this.props.onModal('profile', 8, 50)}>{this.props.user.name}</h4>
        <div id="avatar" onClick={() => this.props.onModal('profile', 8, 50)}>
          <UserIcon width={28} height={28} />
        </div>
      </div>
    );
  }
}

export default User;