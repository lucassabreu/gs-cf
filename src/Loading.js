import React from 'react';
export default function Loading({ className, ...attributes }) {
  className = className || "";
  return (
    <div className={`row ${className}`} {...attributes}>
      <div className="col-12">
        <div className="progress">
          <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '100%' }} ></div>
        </div>
      </div>
    </div>
  );
}