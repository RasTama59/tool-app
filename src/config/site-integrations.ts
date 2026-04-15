const ADSENSE_SYSTEM_ID = "f08c47fec0942fa0";

function getTrimmedEnvValue(...keys: string[]) {
  const env = process.env as Record<string, string | undefined>;

  for (const key of keys) {
    const value = env[key]?.trim();

    if (value) {
      return value;
    }
  }

  return undefined;
}

export function getGoogleAnalyticsId() {
  return getTrimmedEnvValue(
    "NEXT_PUBLIC_GA_MEASUREMENT_ID",
    "NEXT_PUBLIC_GOOGLE_ANALYTICS_ID",
  );
}

export function getGoogleSiteVerification() {
  return getTrimmedEnvValue(
    "GOOGLE_SITE_VERIFICATION",
    "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION",
  );
}

export function getAdSenseClientId() {
  const configuredValue = getTrimmedEnvValue(
    "NEXT_PUBLIC_ADSENSE_CLIENT_ID",
    "NEXT_PUBLIC_GOOGLE_ADSENSE_ID",
    "ADSENSE_CLIENT_ID",
  );

  if (!configuredValue) {
    return undefined;
  }

  if (configuredValue.startsWith("ca-pub-")) {
    return configuredValue;
  }

  if (configuredValue.startsWith("pub-")) {
    return `ca-${configuredValue}`;
  }

  return undefined;
}

export function getAdSensePublisherId() {
  const configuredPublisherId = getTrimmedEnvValue(
    "NEXT_PUBLIC_ADSENSE_PUBLISHER_ID",
    "ADSENSE_PUBLISHER_ID",
  );

  if (configuredPublisherId?.startsWith("pub-")) {
    return configuredPublisherId;
  }

  const clientId = getAdSenseClientId();

  if (clientId?.startsWith("ca-pub-")) {
    return clientId.replace(/^ca-/, "");
  }

  return undefined;
}

export function getAdsTxtContent() {
  const publisherId = getAdSensePublisherId();

  if (!publisherId) {
    return undefined;
  }

  return `google.com, ${publisherId}, DIRECT, ${ADSENSE_SYSTEM_ID}`;
}
