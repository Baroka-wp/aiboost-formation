import React from 'react';

const TableOfContents = ({ headings }) => {
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-4 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2 text-orange-800">Table des matières</h2>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li key={index} className={`pl-${(heading.level - 1) * 4}`}>
            <button
              onClick={() => scrollToHeading(heading.id)}
              className="text-gray-600 hover:text-orange-600 cursor-pointer text-left"
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;