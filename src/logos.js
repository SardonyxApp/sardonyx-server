import React from 'react';

// Custom designed logos 
class Icon extends React.Component {
  render() {
    return (
      <svg 
        className="icon-icon" 
        viewBox="0 0 1024 1024" 
        width={this.props.width || 100} 
        height={this.props.height || 100}
        style={this.props.style}
      >
        <path fill="#d17b46" d="M717.23,199.29,417.79,498.74a23.08,23.08,0,0,1-32.53,0h0a23.08,23.08,0,0,1,0-32.53L675.79,175.68A372.59,372.59,0,0,0,512,138c-206.55,0-374,167.45-374,374a376.27,376.27,0,0,0,6.06,67.41L296.78,426.7a23,23,0,0,1,32.52,0h0a23,23,0,0,1,0,32.52L157.38,631.14a373.61,373.61,0,0,0,70.68,124.28L541.21,442.26a23.08,23.08,0,0,1,32.53,0h0a23.08,23.08,0,0,1,0,32.53L260.09,788.44A372.66,372.66,0,0,0,512,886c206.55,0,374-167.45,374-374C886,381.24,818.89,266.15,717.23,199.29ZM367,389a23.06,23.06,0,0,1,0-32.53l45.25-45.25a23.06,23.06,0,0,1,32.53,0h0a23.06,23.06,0,0,1,0,32.53L399.52,389A23.06,23.06,0,0,1,367,389Z"/>
      </svg>
    );
  }
}

class IconWhiteBackground extends React.Component {
  render() {
    return (
      <svg 
        className="icon-white-background" 
        viewBox="0 0 1024 1024" 
        width={this.props.width || 100} 
        height={this.props.height || 100}
        style={this.props.style}
      >
        <rect fill="#fff" x="-27" y="-28" width="1080" height="1080"/>
        <path fill="#d17b46" d="M717.23,199.29,417.79,498.74a23.08,23.08,0,0,1-32.53,0h0a23.08,23.08,0,0,1,0-32.53L675.79,175.68A372.59,372.59,0,0,0,512,138c-206.55,0-374,167.45-374,374a376.27,376.27,0,0,0,6.06,67.41L296.78,426.7a23,23,0,0,1,32.52,0h0a23,23,0,0,1,0,32.52L157.38,631.14a373.61,373.61,0,0,0,70.68,124.28L541.21,442.26a23.08,23.08,0,0,1,32.53,0h0a23.08,23.08,0,0,1,0,32.53L260.09,788.44A372.66,372.66,0,0,0,512,886c206.55,0,374-167.45,374-374C886,381.24,818.89,266.15,717.23,199.29ZM367,389a23.06,23.06,0,0,1,0-32.53l45.25-45.25a23.06,23.06,0,0,1,32.53,0h0a23.06,23.06,0,0,1,0,32.53L399.52,389A23.06,23.06,0,0,1,367,389Z"/>
      </svg>
    );
  }
}

class IconInverted extends React.Component {
  render() {
    return(
      <svg 
        className="icon-inverted" 
        viewBox="0 0 1024 1024" 
        width={this.props.width || 100} 
        height={this.props.height || 100}
        style={this.props.style}
      >
        <path fill="#fff" d="M717.23,199.29,417.79,498.74a23.08,23.08,0,0,1-32.53,0h0a23.08,23.08,0,0,1,0-32.53L675.79,175.68A372.59,372.59,0,0,0,512,138c-206.55,0-374,167.45-374,374a376.27,376.27,0,0,0,6.06,67.41L296.78,426.7a23,23,0,0,1,32.52,0h0a23,23,0,0,1,0,32.52L157.38,631.14a373.61,373.61,0,0,0,70.68,124.28L541.21,442.26a23.08,23.08,0,0,1,32.53,0h0a23.08,23.08,0,0,1,0,32.53L260.09,788.44A372.66,372.66,0,0,0,512,886c206.55,0,374-167.45,374-374C886,381.24,818.89,266.15,717.23,199.29ZM367,389a23.06,23.06,0,0,1,0-32.53l45.25-45.25a23.06,23.06,0,0,1,32.53,0h0a23.06,23.06,0,0,1,0,32.53L399.52,389A23.06,23.06,0,0,1,367,389Z"/>
      </svg>
    );
  }
}

// Material icons 
class LabelIcon extends React.Component {
  render() {
    return (
      <svg 
        className="label-icon material-icon" 
        viewBox="0 0 24 24" 
        width={this.props.width || 24} 
        height={this.props.height || 24}
        style={this.props.style}
      >
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/>
      </svg>
    );
  }
}

class DescriptionIcon extends React.Component {
  render() {
    return (
      <svg 
        className="description-icon material-icon" 
        viewBox="0 0 24 24" 
        width={this.props.width || 24} 
        height={this.props.height || 24}
        style={this.props.style}
      >
        <path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"/>
        <path fill="none" d="M0 0h24v24H0V0z"/>
      </svg>
    );
  }
}

class TimeIcon extends React.Component {
  render() {
    return (
      <svg 
        className="time-icon material-icon" 
        viewBox="0 0 24 24" 
        width={this.props.width || 24} 
        height={this.props.height || 24}
        style={this.props.style}
      >
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
      </svg>
    );
  }
}

class UserIcon extends React.Component {
  render() {
    return (
      <svg 
        className="user-icon material-icon" 
        viewBox="0 0 24 24" 
        width={this.props.width || 24} 
        height={this.props.height || 24}
        style={this.props.style}
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    );
  }
}

class CheckIcon extends React.Component {
  render() {
    return (
      <svg 
        className="check-icon material-icon" 
        viewBox="0 0 24 24" 
        width={this.props.width || 24} 
        height={this.props.height || 24}
        style={this.props.style}
      >
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    );
  }
}

class SearchIcon extends React.Component {
  render() {
    return (
      <svg 
        className="search-icon material-icon action" 
        viewBox="0 0 24 24" 
        width={this.props.width || 24} 
        height={this.props.height || 24}
        style={this.props.style}
        onClick={this.props.onClick}
      >
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    );
  }
}

class AddIcon extends React.Component {
  render() {
    return (
      <svg 
        className="add-icon material-icon action" 
        viewBox="0 0 24 24" 
        width={this.props.width || 24} 
        height={this.props.height || 24}
        style={this.props.style}
        onClick={this.props.onClick}
      >
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    );
  }
}

class RemoveIcon extends React.Component {
  render() {
    return (
      <svg 
        className="remove-icon material-icon action" 
        viewBox="0 0 24 24" 
        width={this.props.width || 24} 
        height={this.props.height || 24}
        style={this.props.style}
        onClick={this.props.onClick}
      >
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    );
  }
}

class EditIcon extends React.Component {
  render() {
    return (
      <svg 
        className="edit-icon material-icon action" 
        viewBox="0 0 24 24" 
        width={this.props.width || 24} 
        height={this.props.height || 24}
        style={this.props.style}
        onClick={this.props.onClick}
      >
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    );
  }
}

class AddToListIcon extends React.Component {
  render() {
    return (
      <svg 
        className="add-to-list-icon material-icon action" 
        viewBox="0 0 24 24" 
        width={this.props.width || 24} 
        height={this.props.height || 24}
        style={this.props.style}
        onClick={this.props.onClick}
      >
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/>
      </svg>
    );
  }
}

export { 
  Icon, 
  IconWhiteBackground, 
  IconInverted, 
  LabelIcon, 
  DescriptionIcon, 
  TimeIcon, 
  UserIcon, 
  CheckIcon,
  SearchIcon,
  AddIcon,
  RemoveIcon,
  EditIcon,
  AddToListIcon
};