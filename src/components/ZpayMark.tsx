import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { useTheme } from '@/theme';

export interface ZpayMarkProps {
  size?: number;
}

export function ZpayMark({ size = 88 }: ZpayMarkProps) {
  const colors = useTheme();
  const scale = size / 88;

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="ZPAY logo"
      style={[styles.root, { width: size, height: size }]}>
      <View
        style={[
          styles.halo,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colors.accent,
          },
        ]}
      />
      <View style={[styles.speedLine, styles.speedLineTop, { width: 22 * scale, height: 3 * scale }]} />
      <View style={[styles.speedLine, styles.speedLineMid, { width: 34 * scale, height: 4 * scale }]} />
      <View style={[styles.speedLine, styles.speedLineBottom, { width: 20 * scale, height: 3 * scale }]} />
      <View style={[styles.blueBar, styles.topBar, { width: 58 * scale, height: 17 * scale, borderRadius: 9 * scale }]} />
      <View style={[styles.blueBar, styles.leftBar, { width: 64 * scale, height: 18 * scale, borderRadius: 9 * scale }]} />
      <View style={[styles.greenBar, styles.rightBar, { width: 60 * scale, height: 18 * scale, borderRadius: 9 * scale }]} />
      <View style={[styles.greenBar, styles.bottomBar, { width: 58 * scale, height: 17 * scale, borderRadius: 9 * scale }]} />
      <View
        style={[
          styles.play,
          {
            width: 28 * scale,
            height: 28 * scale,
            borderRadius: 14 * scale,
          },
        ]}>
        <Icon name="play" size={14 * scale} color={colors.background} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    borderWidth: 2,
    opacity: 0.35,
  },
  speedLine: {
    position: 'absolute',
    left: 5,
    backgroundColor: '#5EFFA6',
    borderRadius: 999,
    opacity: 0.85,
  },
  speedLineTop: {
    top: 33,
  },
  speedLineMid: {
    top: 41,
  },
  speedLineBottom: {
    top: 50,
  },
  blueBar: {
    position: 'absolute',
    backgroundColor: '#0066FF',
  },
  greenBar: {
    position: 'absolute',
    backgroundColor: '#00B050',
  },
  topBar: {
    top: 19,
    right: 14,
    transform: [{ rotate: '0deg' }, { skewX: '-24deg' }],
  },
  leftBar: {
    top: 37,
    left: 15,
    transform: [{ rotate: '-48deg' }],
  },
  rightBar: {
    top: 34,
    right: 13,
    transform: [{ rotate: '-48deg' }],
  },
  bottomBar: {
    bottom: 20,
    left: 15,
    transform: [{ skewX: '-24deg' }],
  },
  play: {
    position: 'absolute',
    left: 30,
    top: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
