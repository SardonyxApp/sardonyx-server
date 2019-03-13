/**
 * @fileoverview Component to render user information in the top bar.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { IconWhiteBackground } from '../../logos'; // use this as avatar for now

class User extends React.Component {
  render() {
    return (
      <div id="user">
        <h4>{this.props.user.name}</h4>
        <div id="avatar">
          <IconWhiteBackground width={28} height={28} />
        </div>
      </div>
    );
  }
}

export default User;