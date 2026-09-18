import { Link } from 'expo-router';
import { Asset } from 'expo-asset';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ZpayMark } from '@/components/ZpayMark';
import { Button, Screen, Text } from '@/components/ui';
import { Spacing, TouchTarget } from '@/theme/tokens';

const welcomeVideo = require('../../../assets/videos/welcome.mp4');

export default function WelcomeScreen() {
  const [showVideo, setShowVideo] = useState(false);
  const [webVideoSrc, setWebVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    setShowVideo(true);
  }, []);

  const isWeb = Platform.OS === 'web';

  // On web, resolve the bundled mp4 to its real, served URL string (browsers
  // need a URL, not a Metro module id, in <video src>). Cache-buster forces a
  // fresh fetch past any stale service-worker/cache from the old build.
  useEffect(() => {
    if (!isWeb) return;
    Asset.fromModule(welcomeVideo)
      .downloadAsync()
      .then((a) => setWebVideoSrc(`${a.localUri ?? a.uri}?v=2`))
      .catch(() => {
        const u = Asset.fromModule(welcomeVideo).uri;
        if (u) setWebVideoSrc(`${u}?v=2`);
      });
  }, [isWeb]);

  const player = useVideoPlayer(welcomeVideo, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const renderVideo = (style: object) => {
    if (isWeb) {
      // Native <video> with inline autoplay/muted/loop attrs — the only way to
      // get reliable autoplay on web (browser autoplay-policy drops JS play()).
      if (!webVideoSrc) return null;
      return <video src={webVideoSrc} autoPlay muted loop playsInline style={style} key={webVideoSrc} />;
    }
    return <VideoView player={player} style={style} contentFit="cover" nativeControls={false} />;
  };

  return (
    <Screen title={undefined} scroll={false} contentStyle={styles.content}>
      <StatusBar style="light" />

      {/* Background video layer */}
      <View style={styles.videoLayer}>{showVideo ? renderVideo(styles.video) : null}</View>

      {/* Dark overlay for text legibility over the video */}
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.78)']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.topBrand}>
            <ZpayMark size={38} />
            <Text style={styles.brandName}>ZPAY</Text>
          </View>

          {/* Tagline over the video */}
          <Text style={styles.tagline}>Your Money,{`\n`}Your Way.</Text>
          <Text style={styles.sub}>Pay bills, buy airtime and register{`\n`}for exams — all in one place.</Text>

          <View style={styles.heroGap} />

          <View style={styles.actions}>
            <Link href="/login" asChild>
              <Button label="Log in to your account" />
            </Link>
            <Link href="/signup" asChild>
              <Button label="Create a free account" variant="secondary" />
            </Link>
            <Text style={styles.terms}>
              By continuing, you agree to our <Text style={styles.termsLink}>Terms and Conditions</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Screen>
  );
}

const GOLD = '#F5B82E';
const GOLD_END = '#D99614';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    position: 'relative',
  },
  videoLayer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Spacing.xxl,
  },
  topBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xxl,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 3,
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 42,
    letterSpacing: -0.5,
    color: '#FFFFFF',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
  },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.75)',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.sm,
  },
  heroGap: {
    flex: 1,
  },
  actions: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  terms: {
    textAlign: 'center',
    marginTop: Spacing.xs,
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },
  termsLink: {
    color: GOLD,
    textDecorationLine: 'underline',
  },
});
