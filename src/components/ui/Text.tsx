import { StyleSheet, Text as RNText, type TextProps } from 'react-native';

import { FontFamily, FontSize, FontWeight, LineHeight } from '@/theme/tokens';
import { useTheme } from '@/theme';

export type TextVariant =
  | 'display'
  | 'heading'
  | 'title'
  | 'body'
  | 'bodyBold'
  | 'small'
  | 'smallBold'
  | 'caption'
  | 'label'
  | 'mono'
  | 'amount';

export interface ZpayTextProps extends TextProps {
  variant?: TextVariant;
  color?: keyof ReturnType<typeof useTheme>;
}

export function Text({ variant = 'body', color, style, ...rest }: ZpayTextProps) {
  const colors = useTheme();
  const resolved = color ?? 'text';

  return (
    <RNText
      style={[
        { color: colors[resolved] },
        styles.base,
        variantStyles[variant],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: FontFamily.sans,
  },
});

const variantStyles = StyleSheet.create({
  display: {
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
    fontWeight: FontWeight.bold,
  },
  heading: {
    fontSize: FontSize.heading,
    lineHeight: LineHeight.heading,
    fontWeight: FontWeight.bold,
  },
  title: {
    fontSize: FontSize.title,
    lineHeight: LineHeight.title,
    fontWeight: FontWeight.semibold,
  },
  body: {
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
    fontWeight: FontWeight.regular,
  },
  bodyBold: {
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
    fontWeight: FontWeight.semibold,
  },
  small: {
    fontSize: FontSize.small,
    lineHeight: LineHeight.small,
    fontWeight: FontWeight.regular,
  },
  smallBold: {
    fontSize: FontSize.small,
    lineHeight: LineHeight.small,
    fontWeight: FontWeight.semibold,
  },
  caption: {
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    fontWeight: FontWeight.regular,
  },
  label: {
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  mono: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.small,
    lineHeight: LineHeight.small,
  },
  amount: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.amount,
    lineHeight: LineHeight.amount,
    fontWeight: FontWeight.bold,
  },
});