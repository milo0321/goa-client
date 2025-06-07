import React from 'react';

interface Props {
  tagFilter: string;
  setTagFilter: (tag: string) => void;
}

const tags = ['All', 'Work', 'Personal', 'Invoices', 'Important'];

const Sidebar: React.FC<Props> = ({ tagFilter, setTagFilter }) => {
  return (
    <div className="w-64 border-r p-4 space-y-2 bg-gray-100">
      <h2 className="text-lg font-semibold">Tags</h2>
      {tags.map(tag => (
        <div
          key={tag}
          className={`cursor-pointer px-3 py-1 rounded hover:bg-gray-300 ${tagFilter === tag ? 'bg-blue-200 font-bold' : ''
            }`}
          onClick={() => setTagFilter(tag)}
        >
          {tag}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
