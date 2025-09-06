import React from 'react';
import MDEditor from '@uiw/react-md-editor';

const RichTextEditor = ({ value, onChange, height = 400 }) => {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        preview="edit"
      />
    </div>
  );
};

export default RichTextEditor;