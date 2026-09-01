import * as Clipboard from 'expo-clipboard';

import { copyToClipboard } from '@/lib/clipboard';

describe('copyToClipboard', () => {
  it('copies a value using the native clipboard module', async () => {
    await copyToClipboard('ZP_123');

    expect(Clipboard.setStringAsync).toHaveBeenCalledWith('ZP_123');
  });
});
