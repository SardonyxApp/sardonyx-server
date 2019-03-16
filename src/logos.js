import React from 'react';

// Custom designed logos 
class Icon extends React.Component {
  render() {
    return (
      <svg viewBox="0 0 1024 1024" width={this.props.width || 100} height={this.props.height || 100}>
        <path fill="#d17b46" d="M717.23,199.29,417.79,498.74a23.08,23.08,0,0,1-32.53,0h0a23.08,23.08,0,0,1,0-32.53L675.79,175.68A372.59,372.59,0,0,0,512,138c-206.55,0-374,167.45-374,374a376.27,376.27,0,0,0,6.06,67.41L296.78,426.7a23,23,0,0,1,32.52,0h0a23,23,0,0,1,0,32.52L157.38,631.14a373.61,373.61,0,0,0,70.68,124.28L541.21,442.26a23.08,23.08,0,0,1,32.53,0h0a23.08,23.08,0,0,1,0,32.53L260.09,788.44A372.66,372.66,0,0,0,512,886c206.55,0,374-167.45,374-374C886,381.24,818.89,266.15,717.23,199.29ZM367,389a23.06,23.06,0,0,1,0-32.53l45.25-45.25a23.06,23.06,0,0,1,32.53,0h0a23.06,23.06,0,0,1,0,32.53L399.52,389A23.06,23.06,0,0,1,367,389Z"/>
      </svg>
    );
  }
}

class IconWhiteBackground extends React.Component {
  render() {
    return (
      <svg viewBox="0 0 1024 1024" width={this.props.width || 100} height={this.props.height || 100}>
        <rect fill="#fff" x="-27" y="-28" width="1080" height="1080"/>
        <path fill="#d17b46" d="M717.23,199.29,417.79,498.74a23.08,23.08,0,0,1-32.53,0h0a23.08,23.08,0,0,1,0-32.53L675.79,175.68A372.59,372.59,0,0,0,512,138c-206.55,0-374,167.45-374,374a376.27,376.27,0,0,0,6.06,67.41L296.78,426.7a23,23,0,0,1,32.52,0h0a23,23,0,0,1,0,32.52L157.38,631.14a373.61,373.61,0,0,0,70.68,124.28L541.21,442.26a23.08,23.08,0,0,1,32.53,0h0a23.08,23.08,0,0,1,0,32.53L260.09,788.44A372.66,372.66,0,0,0,512,886c206.55,0,374-167.45,374-374C886,381.24,818.89,266.15,717.23,199.29ZM367,389a23.06,23.06,0,0,1,0-32.53l45.25-45.25a23.06,23.06,0,0,1,32.53,0h0a23.06,23.06,0,0,1,0,32.53L399.52,389A23.06,23.06,0,0,1,367,389Z"/>
      </svg>
    );
  }
}

class IconInverted extends React.Component {
  render() {
    return(
      <svg viewBox="0 0 1024 1024" width={this.props.width || 100} height={this.props.height || 100}>
        <path fill="#fff" d="M717.23,199.29,417.79,498.74a23.08,23.08,0,0,1-32.53,0h0a23.08,23.08,0,0,1,0-32.53L675.79,175.68A372.59,372.59,0,0,0,512,138c-206.55,0-374,167.45-374,374a376.27,376.27,0,0,0,6.06,67.41L296.78,426.7a23,23,0,0,1,32.52,0h0a23,23,0,0,1,0,32.52L157.38,631.14a373.61,373.61,0,0,0,70.68,124.28L541.21,442.26a23.08,23.08,0,0,1,32.53,0h0a23.08,23.08,0,0,1,0,32.53L260.09,788.44A372.66,372.66,0,0,0,512,886c206.55,0,374-167.45,374-374C886,381.24,818.89,266.15,717.23,199.29ZM367,389a23.06,23.06,0,0,1,0-32.53l45.25-45.25a23.06,23.06,0,0,1,32.53,0h0a23.06,23.06,0,0,1,0,32.53L399.52,389A23.06,23.06,0,0,1,367,389Z"/>
      </svg>
    );
  }
}

// Material icons 
class LabelIcon extends React.Component {
  render() {
    return (
      <svg viewBox="0 0 24 24" width={this.props.width || 24} height={this.props.height || 24}><path d="M0 0h24v24H0z" fill="none"/><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/></svg>
    );
  }
}

class DescriptionIcon extends React.Component {
  render() {
    return (
      <svg viewBox="0 0 24 24" width={this.props.width || 24} height={this.props.height || 24}>
        <path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"/>
        <path fill="none" d="M0 0h24v24H0V0z"/>
      </svg>
    );
  }
}

class TimeIcon extends React.Component {
  render() {
    return (
      <svg viewBox="0 0 24 24" width={this.props.width || 24} height={this.props.height || 24}>
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
      <svg viewBox="0 0 24 24" width={this.props.width || 24} height={this.props.height || 24}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    );
  }
}

class EditIcon extends React.Component {
  render() {
    return (
      <svg viewBox="0 0 24 24" width={this.props.width || 24} height={this.props.height || 24}>
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
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
  EditIcon 
};