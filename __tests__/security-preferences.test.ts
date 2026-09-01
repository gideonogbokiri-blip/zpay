import { useSecurityPreferences } from '@/state/security';

describe('security preferences', () => {
  beforeEach(() => {
    const SecureStore = require('expo-secure-store');
    SecureStore.__clear();
    useSecurityPreferences.setState({
      accountFrozen: false,
      biometricsEnabled: false,
      recentEvents: [],
    });
  });

  it('freezes and unfreezes outgoing payments', () => {
    useSecurityPreferences.getState().setAccountFrozen(true);
    expect(useSecurityPreferences.getState().accountFrozen).toBe(true);

    useSecurityPreferences.getState().setAccountFrozen(false);
    expect(useSecurityPreferences.getState().accountFrozen).toBe(false);
  });

  it('records freeze security activity', () => {
    useSecurityPreferences.getState().recordSecurityEvent({
      type: 'account_frozen',
      title: 'Outgoing payments frozen',
      detail: 'Payments are blocked on this device.',
    });

    expect(useSecurityPreferences.getState().recentEvents[0]).toMatchObject({
      type: 'account_frozen',
      title: 'Outgoing payments frozen',
    });
  });
});
