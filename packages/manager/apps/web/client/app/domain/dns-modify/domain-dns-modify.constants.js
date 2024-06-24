export const APIV2_CONFIGURATION_TYPES = {
  EXTERNAL: 'EXTERNAL',
  MIXED: 'MIXED',
  EMPTY: 'EMPTY',
};

export const CONFIGURATION_TYPES = {
  ...APIV2_CONFIGURATION_TYPES,
  INTERNAL: 'INTERNAL', // hosting, anycast, hold, parking, dedicated
};

export const FORM_FIELD_NAMES = {
  IP: 'ipField',
  HOSTNAME: 'hostnameField',
};

export const COMPONENTS_PATH_PREFIX = 'domain/dns-modify/components/';

// IPV4_REGEX validates an IPV4 address by ensuring each of the four octets is a number between 0 and 255,
// where the first octet is either 25[0-5], 2[0-4][0-9], or [0-1]?[0-9]{1,2}, followed by three additional octets separated by dots,
// each conforming to the same pattern.
export const IPV4_REGEX = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})(.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})){3}$/;

// IPV6_REGEX validates an IPv6 address by ensuring it matches one of several patterns:
// eight groups of four hexadecimal digits separated by colons, compressed notation with one or more empty groups (::),
// combinations of hexadecimal and IPv4 addresses, and link-local addresses with optional zone indices.
const IPV6_REGEX = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9]))$/;

// HOSTNAME_REGEX validates a hostname by ensuring it is 1 to 253 characters long, does not start or end with a hyphen,
// consists of labels separated by periods where each label is 1 to 63 characters long,
// and ends with a top-level domain of 2 to 63 alphabetic characters.
const HOSTNAME_REGEX = /^(?=.{1,253}$)(?!-)([a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}$/;

export const VALIDATION_REGEX = {
  IP: new RegExp(`${IPV4_REGEX.source}|${IPV6_REGEX.source}`),
  HOSTNAME: HOSTNAME_REGEX,
  IPV6: IPV6_REGEX,
  IPV4: IPV4_REGEX,
};
