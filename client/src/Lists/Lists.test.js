import React from 'react';
import { render } from '@testing-library/react';
import Lists from './Lists';

test('renders learn react link', () => {
  const { getByText } = render(<Lists />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
