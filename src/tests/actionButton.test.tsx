// Testing actionButton.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionButton from '@/components/our-components/actionButton';

describe('ActionButton', () => {
  it('renders with children', () => {
    render(<ActionButton>Click</ActionButton>);
    expect(screen.getByRole('button')).toHaveTextContent('Click');
  });

  it('applies default props correctly', () => {
    render(<ActionButton>Default</ActionButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveStyle({ fontSize: '20px', minWidth: '100px' });
    expect(button).toHaveClass(
      'inline-flex',
      'rounded-full',
      'px-6',
      'py-2',
      'h-10',
    );
  });

  it('handles onClick events', () => {
    const handleClick = jest.fn();
    render(<ActionButton onClick={handleClick}>Clickable</ActionButton>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies cursor-pointer when onClick is provided', () => {
    const handleClick = jest.fn();
    render(<ActionButton onClick={handleClick}>Clickable</ActionButton>);

    expect(screen.getByRole('button')).toHaveClass('cursor-pointer');
  });

  it('does not apply cursor-pointer when no onClick', () => {
    render(<ActionButton>Not clickable</ActionButton>);

    expect(screen.getByRole('button')).not.toHaveClass('cursor-pointer');
  });

  it('applies random className', () => {
    render(<ActionButton className="custom-class">Styled</ActionButton>);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('applies custom className for TailwindCSS', () => {
    render(
      <ActionButton className="bg-blue-500 text-white hover:bg-blue-700">
        Tailwind Button
      </ActionButton>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'bg-blue-500',
      'text-white',
      'hover:bg-blue-700',
    );
  });

  it('applies custom fontSize', () => {
    render(<ActionButton fontSize={16}>Small text</ActionButton>);

    expect(screen.getByRole('button')).toHaveStyle({ fontSize: '16px' });
  });

  describe('Button Colors', () => {
    it('applies blue color by default', () => {
      render(<ActionButton>Blue</ActionButton>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass(
        'text-white',
        'bg-button-action',
        'border-button-action',
      );
    });

    it('applies red color', () => {
      render(<ActionButton buttonColor="red">Red</ActionButton>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass(
        'text-white',
        'bg-button-cancel',
        'border-button-cancel',
      );
    });

    it('applies green color', () => {
      render(<ActionButton buttonColor="green">Green</ActionButton>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass(
        'text-white',
        'bg-button-upload',
        'border-button-upload',
      );
    });
  });

  describe('Button Types', () => {
    it('applies filled style by default', () => {
      render(<ActionButton>Filled</ActionButton>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass(
        'text-white',
        'bg-button-action',
        'border-button-action',
      );
    });

    it('applies outline style', () => {
      render(<ActionButton buttonType="outline">Outline</ActionButton>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass(
        'text-button-action',
        'bg-white',
        'border-button-action',
      );
    });
  });

  it('passes through additional props', () => {
    render(<ActionButton aria-label="Custom label">Button</ActionButton>);

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Custom label',
    );
  });

  describe('Color and Type Combinations', () => {
    const testCases = [
      {
        color: 'blue' as const,
        type: 'filled' as const,
        expectedClasses: [
          'text-white',
          'bg-button-action',
          'border-button-action',
        ],
      },
      {
        color: 'blue' as const,
        type: 'outline' as const,
        expectedClasses: [
          'text-button-action',
          'bg-white',
          'border-button-action',
        ],
      },
      {
        color: 'red' as const,
        type: 'outline' as const,
        expectedClasses: [
          'text-button-cancel',
          'bg-white',
          'border-button-cancel',
        ],
      },
      {
        color: 'green' as const,
        type: 'outline' as const,
        expectedClasses: [
          'text-button-upload',
          'bg-white',
          'border-button-upload',
        ],
      },
    ];

    testCases.forEach(({ color, type, expectedClasses }) => {
      it(`applies correct styles for ${color} ${type}`, () => {
        render(
          <ActionButton buttonColor={color} buttonType={type}>
            {color} {type} Button
          </ActionButton>,
        );

        const button = screen.getByRole('button');
        expectedClasses.forEach((className) => {
          expect(button).toHaveClass(className);
        });
      });
    });
  });
});
