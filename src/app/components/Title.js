import React from 'react';

const Title = props => (
  <div>
    <h1 id="title" onClick={() => props.onModal('tasklists', '50%', 50)}>{props.title}</h1>
  </div>
);

export default Title;