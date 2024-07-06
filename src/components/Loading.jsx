import React from 'react';
import './Loading.css'; // Importer les styles de l'animation

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="rocket">
        <div className="rocket-body">
          <div className="rocket-fins"></div>
        </div>
      </div>
      <p>Loading</p>
    </div>
  );
};

export default Loading;
