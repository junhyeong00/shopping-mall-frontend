import { cleanup, render } from '@testing-library/react';

import ReviewWriteablePage from './ReviewWriteablePage';

const navigate = jest.fn();

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line react/prop-types
  Link({ children, to }) {
    return (
      <a href={to}>
        {children}
      </a>
    );
  },
  useNavigate: () => (
    navigate
  ),
}));

describe('ReviewWriteablePage', () => {
  it('render screen', () => {
    render(<ReviewWriteablePage />);
    cleanup();
  });
});
