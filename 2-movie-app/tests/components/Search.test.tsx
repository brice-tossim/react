import { render, screen, fireEvent } from '@testing-library/react';
import Search from '../../src/components/Search';

describe('Search Component', () => {
  it('calls setSearchTerm when input value changes', () => {
    // Create a mock function to track calls
    const mockSetSearchTerm = vi.fn();
    
    // Render the Search component with the mock function
    render(<Search setSearchTerm={mockSetSearchTerm} />);
    
    // Find the input element
    const input = screen.getByPlaceholderText('Search through 300+ movies online');
    
    // Simulate typing in the input
    const testValue = 'test search';
    fireEvent.change(input, { target: { value: testValue } });
    
    // Verify that setSearchTerm was called with the correct value
    expect(mockSetSearchTerm).toHaveBeenCalledWith(testValue);
  });
});
