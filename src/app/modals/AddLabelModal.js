/**
 * @fileoverview Component to render the menu modal for adding new items.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { NextIcon } from '../../logos';
import { TwitterPicker } from 'react-color';

class AddModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Generate random hex color 
      color: "#000000".replace(/0/g, () => Math.floor(Math.random() * 16).toString(16)),
      errorMessage: null
    };

    this.nameRef = React.createRef();
    this.urlRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.modal !== this.props.modal) {
      this.setState({
        color: "#000000".replace(/0/g, () => Math.floor(Math.random() * 16).toString(16)),
        errorMessage: null
      });
    }
  }

  handleAddLabel(type) {
    const name = this.nameRef.current.value;
    if (!name || name.length > 255) return this.handleError(this.nameRef.current);

    this.props.onCreateLabel(type === 'subject' ? 'subjects' : 'categories', { name, color: this.state.color })
    this.props.onModal();
  }

  handleColor(color) {
    this.setState({ color });
  }

  handleError(el) {
    el.style.borderBottom = '2px solid #f44138';
    el.focus();

    this.setState({ 
      errorMessage: el.value ? 'Name has to be shorter than 255 characters.' : 'Name cannot be empty.'
    });
  }

  render() {
    const position = () => {
      if (this.props.modal.y > document.documentElement.clientHeight / 2) {
        return {
          left: this.props.modal.x,
          bottom: document.documentElement.clientHeight - this.props.modal.y
        };
      }

      return {
        right: document.documentElement.clientWidth - this.props.modal.x,
        top: this.props.modal.y
      };
    };
    const type = this.props.modal.name === 'add-subject' ? 'subject' : 'category';
    return (
      <div id={`add-${type}-modal`} className="modal" style={{ ...position(), zIndex: this.props.zIndex }}>
        <div>
          <input
            id={`add-${type}-input`}
            className="name-input"
            type="text"
            style={{ width: '236px' }}
            placeholder={`Enter the name of the ${type}`}
            autoFocus
            onKeyDown={e => {
              if (e.keyCode === 13) this.handleAddLabel(type);
              if (e.keyCode === 27) this.props.onModal();
            }}
            ref={this.nameRef}
          />
          <NextIcon 
            width={16}
            height={16}
            style={{ cursor: 'pointer' }}
            onClick={() => this.handleAddLabel(type)}
          />
        </div>

        <p className="error-message" style={{ textAlign: 'right' }}>{this.state.errorMessage}</p>

        <TwitterPicker 
          color={this.state.color}
          onChangeComplete={color => this.handleColor(color.hex)}
          width={252}
          triangle="hide"
        />

        <div>
          <p style={{ display: 'inline-block' }}>Use color</p>
          <div className="dot" style={{ background: this.state.color, marginLeft: '4px' }}></div>
        </div>

        {type === 'subject' ? <div>
          <input 
            className="url-input"
            type="text"
            style={{ width: '236px' }}
            placeholder={`Enter linked Managebac URL (optional)`}
            onKeyDown={e => {
              if (e.keyCode === 13) this.handleAddLabel(type);
              if (e.keyCode === 27) this.props.onModal();
            }}
            ref={this.urlRef}
          />
        </div> : null}
      </div>
    );
  }
}

export default AddModal;