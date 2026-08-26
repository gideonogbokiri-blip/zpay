import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { PurchaseFlow } from '@/components/flows/PurchaseFlow';
import { RegistrationFlow } from '@/components/flows/RegistrationFlow';
import { Screen, Text } from '@/components/ui';
import { SERVICE_NAMES } from '@/constants/services';
import type { ServiceType } from '@/lib/api';

const SLUG_TO_SERVICE: Record<string, ServiceType> = {
  electricity: 'ELECTRICITY',
  airtime: 'AIRTIME',
  data: 'DATA',
  tv: 'TV',
  waec: 'WAEC',
  jamb: 'JAMB',
  neco: 'NECO',
};

export default function ServiceScreen() {
  const params = useLocalSearchParams<{ service?: string }>();
  const service = params.service ? SLUG_TO_SERVICE[params.service.toLowerCase()] : undefined;

  useEffect(() => {
    if (!service) {
      router.replace('/service');
    }
  }, [service]);

  if (!service) {
    return (
      <Screen title="Service" back>
        <Text variant="small" color="textMuted">
          Loading...
        </Text>
      </Screen>
    );
  }

  if (service === 'WAEC' || service === 'JAMB' || service === 'NECO') {
    return <RegistrationFlow service={service} serviceName={SERVICE_NAMES[service]} />;
  }

  return <PurchaseFlow service={service} serviceName={SERVICE_NAMES[service]} fee={0} />;
}