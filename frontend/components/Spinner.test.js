import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner.js';

test('Spinner renders without crashing', () => {
  render(<Spinner />);
});