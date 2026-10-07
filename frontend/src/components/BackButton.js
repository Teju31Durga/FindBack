import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ text = 'Back' }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="findback-back-button"
      onClick={() => navigate(-1)}
    >
      ← {text}
    </button>
  );
};

export default BackButton;