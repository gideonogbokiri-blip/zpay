import { fireEvent, render } from '@testing-library/react-native';

import { Button, Text } from '@/components/ui';
import { formatNaira } from '@/lib/format';
import { ThemeProvider } from '@/theme';

function renderWithTheme(element: React.ReactElement) {
  return render(<ThemeProvider variant="dark">{element}</ThemeProvider>);
}

describe('Text', () => {
  it('renders content', async () => {
    const { getByText } = await renderWithTheme(<Text variant="amount">{formatNaira(1000)}</Text>);
    expect(getByText('\u20A61,000.00')).toBeTruthy();
  });
});

describe('Button', () => {
  it('renders label and handles press', async () => {
    const onPress = jest.fn();
    const { getByRole, getByText } = await renderWithTheme(
      <Button label="Pay now" onPress={onPress} />
    );
    expect(getByText('Pay now')).toBeTruthy();
    await fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled', async () => {
    const onPress = jest.fn();
    const { getByRole } = await renderWithTheme(
      <Button label="Pay now" onPress={onPress} disabled />
    );
    await fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});