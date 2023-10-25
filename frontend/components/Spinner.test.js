import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner.js'; // adjust the path

test('Spinner renders without crashing', () => {
  render(<Spinner />);
});

// Add more tests based on different props and expected behavior
