import React from 'react';

// Custom designed logos 

/**
 * @description Sardonyx logo icon with transparent background
 */
const Icon = props => {
  return (
    <svg 
      className="icon-icon" 
      viewBox="0 0 1024 1024" 
      width={props.width || 100} 
      height={props.height || 100}
      style={props.style}
    >
      <path fill="#d17b46" d="M717.23,199.29,417.79,498.74a23.08,23.08,0,0,1-32.53,0h0a23.08,23.08,0,0,1,0-32.53L675.79,175.68A372.59,372.59,0,0,0,512,138c-206.55,0-374,167.45-374,374a376.27,376.27,0,0,0,6.06,67.41L296.78,426.7a23,23,0,0,1,32.52,0h0a23,23,0,0,1,0,32.52L157.38,631.14a373.61,373.61,0,0,0,70.68,124.28L541.21,442.26a23.08,23.08,0,0,1,32.53,0h0a23.08,23.08,0,0,1,0,32.53L260.09,788.44A372.66,372.66,0,0,0,512,886c206.55,0,374-167.45,374-374C886,381.24,818.89,266.15,717.23,199.29ZM367,389a23.06,23.06,0,0,1,0-32.53l45.25-45.25a23.06,23.06,0,0,1,32.53,0h0a23.06,23.06,0,0,1,0,32.53L399.52,389A23.06,23.06,0,0,1,367,389Z"/>
    </svg>
  );
};

/**
 * @description Sardonyx logo icon with colors inverted (fill = white by default)
 */
const IconInverted = props => {
  return(
    <svg 
      className="icon-inverted" 
      viewBox="0 0 1024 1024" 
      width={props.width || 100} 
      height={props.height || 100}
      style={props.style}
    >
      <path fill="#fff" d="M717.23,199.29,417.79,498.74a23.08,23.08,0,0,1-32.53,0h0a23.08,23.08,0,0,1,0-32.53L675.79,175.68A372.59,372.59,0,0,0,512,138c-206.55,0-374,167.45-374,374a376.27,376.27,0,0,0,6.06,67.41L296.78,426.7a23,23,0,0,1,32.52,0h0a23,23,0,0,1,0,32.52L157.38,631.14a373.61,373.61,0,0,0,70.68,124.28L541.21,442.26a23.08,23.08,0,0,1,32.53,0h0a23.08,23.08,0,0,1,0,32.53L260.09,788.44A372.66,372.66,0,0,0,512,886c206.55,0,374-167.45,374-374C886,381.24,818.89,266.15,717.23,199.29ZM367,389a23.06,23.06,0,0,1,0-32.53l45.25-45.25a23.06,23.06,0,0,1,32.53,0h0a23.06,23.06,0,0,1,0,32.53L399.52,389A23.06,23.06,0,0,1,367,389Z"/>
    </svg>
  );
};

// Material icons (normal)

/**
 * @description Tag icon
 */
const LabelIcon = props => {
  return (
    <svg 
      className="label-icon material-icon" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
    >
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/>
    </svg>
);
};

/**
 * @description Text icon with three horizontal lines (two long, one short)
 */
const DescriptionIcon = props => {
  return (
    <svg 
      className="description-icon material-icon" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
    >
      <path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"/>
      <path fill="none" d="M0 0h24v24H0V0z"/>
    </svg>
  );
};

/**
 * @description Clock icon
 */
const TimeIcon = props => {
  return (
    <svg 
      className="time-icon material-icon" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
    >
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>
  );
};

/**
 * @description Person icon
 */
const UserIcon = props => {
  return (
    <svg 
      className="user-icon material-icon" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  );
};

/**
 * @description List alt icon
 */
const TasklistIcon = props => {
  return (
    <svg 
      className="tasklist-icon material-icon" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
    >
      <path d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7z"/>
      <path fill="none" d="M0 0h24v24H0z"/>
    </svg>
  );
};

/**
 * @description School icon 
 */
const SchoolIcon = props => {
  return (
    <svg 
      className="info-icon material-icon" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
    >
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
    </svg>
  );
};

/**
 * @description Book icon
 */
const BookIcon = props => {
  return (
    <svg 
      className="info-icon material-icon" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
    >
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
    </svg>
  );
};

/**
 * @description Check mark icon
 */
const CheckIcon = props => {
  return (
    <svg 
      className="check-icon material-icon" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
    >
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  );
};

/**
 * @description Magnifying glass icon
 */
const SearchIcon = props => {
  return (
    <svg 
      className="search-icon material-icon action" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
      onClick={props.onClick}
    >
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  );
};

/**
 * @description + icon
 */
const AddIcon = props => {
  return (
    <svg 
      className="add-icon material-icon action" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
      onClick={props.onClick}
    >
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  );
};

/**
 * @description x icon
 */
const RemoveIcon = props => {
  return (
    <svg 
      className="remove-icon material-icon action" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
      onClick={props.onClick}
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  );
};

/**
 * @description Trash can icon
 */
const DeleteIcon = props => {
  return (
    <svg
      className="delete-icon material-icon action" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
      onClick={props.onClick}
    >
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  );
};

/**
 * @description Hamburger menu icon (three lines) with a small plus on the bottom right corner
 */
const AddToListIcon = props => {
  return (
    <svg 
      className="add-to-list-icon material-icon action" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
      onClick={props.onClick}
    >
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/>
    </svg>
  );
};

/**
 * @description Forward arrow icon
 */
const NextIcon = props => {
  return (
    <svg 
      className="next-icon material-icon action" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
      onClick={props.onClick}
    >
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
    </svg>
  );
};

/**
 * @description Language icon
 */
const GlobeIcon = props => {
  return (
    <svg 
      className="globe-icon material-icon action" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
      onClick={props.onClick}
    >
      <path fill="none" d="M0 0h24v24H0V0z"/>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
    </svg>
  );
};

/**
 * @description Lock icon 
 */
const LockIcon = props => {
  return (
    <svg 
      className="lock-icon material-icon action" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
      onClick={props.onClick}
    >
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  );
};

/**
 * @description Exit icon (arrow pointing towards square)
 */
const ExitIcon = props => {
  return (
    <svg 
      className="exit-icon material-icon action" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
      onClick={props.onClick}
    >
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
    </svg>
  );
};

/**
 * @description Gear icon
 */
const SettingsIcon = props => {
  return (
    <svg 
      className="settings-icon material-icon action" 
      viewBox="0 0 20 20"  // do NOT change 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
      onClick={props.onClick}
    >
      <path fill="none" d="M0 0h20v20H0V0z"/>
      <path d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
    </svg>
  );
};

/**
 * @description Info icon
 */
const InfoIcon = props => {
  return (
    <svg 
      className="info-icon material-icon action" 
      viewBox="0 0 24 24" 
      width={props.width || 24} 
      height={props.height || 24}
      style={props.style}
      onClick={props.onClick}
    >
      <path fill="none" d="M0 0h24v24H0V0z"/>
      <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </svg>
  );
};

export { 
  Icon, 
  IconWhiteBackground, 
  IconInverted, 
  LabelIcon, 
  DescriptionIcon, 
  TimeIcon, 
  UserIcon, 
  TasklistIcon,
  SchoolIcon,
  BookIcon,
  CheckIcon,
  SearchIcon,
  AddIcon,
  RemoveIcon,
  DeleteIcon,
  AddToListIcon,
  NextIcon,
  GlobeIcon,
  LockIcon,
  ExitIcon,
  SettingsIcon,
  InfoIcon
};