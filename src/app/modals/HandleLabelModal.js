import React from 'react';
import { NextIcon } from '../../logos';
import { TwitterPicker } from 'react-color';

class HandleLabelModal extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      // Generate random hex color 
      color: "#000000".replace(/0/g, () => Math.floor(Math.random() * 16).toString(16)),
      anmeErrorMessage: null,
      urlErrorMessage: null
    };

    this.nameRef = React.createRef();
    this.urlRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.modal.name.includes('edit')) {
      const target = this.props.modal.name.includes('subject') ? this.props.subjects : this.props.categories;
      this.setState({
        color: target.find(t => t.id === this.props.modal.data.label_id).color
      });
    }
  }

  handleLabel(type) {
    const payload = {};
    payload.name = this.nameRef.current.value;
    if (!payload.name || payload.name.length > 255) return this.handleError(this.nameRef.current);

    payload.color = this.state.color;

    if (this.props.modal.name.includes('edit')) payload.id = this.props.modal.data.label_id;

    this.props.modal.name.includes('edit') 
    ? this.props.onUpdateLabel(type === 'subject' ? 'subjects' : 'categories', payload) 
    : this.props.onCreateLabel(type === 'subject' ? 'subjects' : 'categories', payload);
    this.props.onModal();
  }

  handleColor(color) {
    this.setState({ color });
  }

  handleError(el) {
    el.style.borderBottom = '2px solid #f44138';
    el.focus();

    this.setState({
      nameErrorMessage: el.value ? 'Name has to be shorter than 255 characters.' : 'Name cannot be empty.'
    });
}

  render() {
    // Choose type of label to add/edit 
    const type = this.props.modal.name.includes('subject') ? 'subject' : 'category';
    let label;
    if (this.props.modal.name.includes('edit')) {
      const target = this.props.modal.name.includes('subject') ? this.props.subjects : this.props.categories;
      label = target.find(t => t.id === this.props.modal.data.label_id);
    }

    return (
      <div id={`add-${type}-modal`} className="modal" style={{ ...this.props.modal.position, zIndex: this.props.zIndex }}>
        <div>
          <input
            id={`add-${type}-input`}
            className="name-input"
            type="text"
            style={{ width: '236px' }}
            placeholder={`Enter the name of the ${type}`}
            defaultValue={this.props.modal.name.includes('edit') ? label.name : ''}
            autoFocus
            onKeyDown={e => {
              if (e.keyCode === 13) this.handleLabel(type);
              if (e.keyCode === 27) this.props.onModal();
            }}
            ref={this.nameRef}
          />
          <NextIcon 
            width={16}
            height={16}
            style={{ cursor: 'pointer' }}
            onClick={() => this.handleLabel(type)}
          />
        </div>

        <p className="error-message" style={{ textAlign: 'right' }}>{this.state.nameErrorMessage}</p>

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
      </div>
    );
  }
}

export default HandleLabelModal;