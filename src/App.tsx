import React from 'react';
import TextEditor from './TextEditor';
import ErrorBoundary from './Components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
    <TextEditor/>
    </ErrorBoundary>
  );
}

export default App;
