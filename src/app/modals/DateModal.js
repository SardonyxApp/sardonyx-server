/**
 * @fileoverviw Component to render the date selector modal.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class DateModal extends React.Component {
  render() {
    return this.props.modal.name === 'date' ? (
      <div id="date-modal" className="modal">
      <p>Hi</p>
      </div>
    ) : null;
  }
}

export default DateModal;