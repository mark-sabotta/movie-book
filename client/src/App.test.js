import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';
import MovieBookApi from './api/api';

jest.mock('./api/api');

describe('App component', () => {
  beforeEach(() => {
    MovieBookApi.mockClear();
  });

  it('renders loading spinner while info is loaded', () => {
    render(<App />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders content after info is loaded', async () => {
    const mockCurrentUser = { username: 'test_user' };
    const mockMovieRatings = { 'tt12345': { title: 'Test Movie', poster: 'poster.jpg', rating: 4 } };
    MovieBookApi.mockImplementation(() => ({
      getCurrentUser: jest.fn().mockResolvedValue(mockCurrentUser),
      getUserRatings: jest.fn().mockResolvedValue({ movies: [{ imdbid: 'tt12345', title: 'Test Movie', poster: 'poster.jpg', rating: 4 }] }),
    }));

    await act(async () => render(<App />));

    expect(screen.getByTestId('loading-spinner')).not.toBeInTheDocument();
    expect(screen.getByText(mockCurrentUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockMovieRatings['tt12345'].title)).toBeInTheDocument();
  });

  it('calls rateMovie on rating button click', async () => {
    const mockCurrentUser = { username: 'test_user' };
    MovieBookApi.mockImplementation(() => ({
      getCurrentUser: jest.fn().mockResolvedValue(mockCurrentUser),
      getUserRatings: jest.fn().mockResolvedValue({ movies: [] }),
      rateMovie: jest.fn(),
    }));

    await act(async () => render(<App />));

    const rateButton = screen.getByRole('button', { name: /Rate/i });
    fireEvent.click(rateButton);

    expect(MovieBookApi.rateMovie).toHaveBeenCalledTimes(1);
  });

  // Add more tests for other functionalities like signup, login, recommended movies
});
