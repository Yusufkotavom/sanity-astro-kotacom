import { Stack, Text } from "@sanity/ui";
import { set, StringInputProps, useFormValue } from "sanity";
import { useEffect, useRef } from "react";

const LOCATION_TOKEN_REGEX = /\{(lokasi|location|city)\}/gi;
const SERVICE_TOKEN_REGEX = /\{service\}/gi;

export default function AutoRouteInput(props: StringInputProps) {
  const routePattern = useFormValue(["routePattern"]) as string | undefined;
  const slug = useFormValue(["slug", "current"]) as string | undefined;
  const serviceSlug = useFormValue(["service", "slug", "current"]) as
    | string
    | undefined;
  const serviceTypeSlug = useFormValue(["serviceType", "slug", "current"]) as
    | string
    | undefined;
  const locationSlug = useFormValue(["location", "slug", "current"]) as
    | string
    | undefined;

  let computed = routePattern || "";

  // Replace {service} token
  if (computed && SERVICE_TOKEN_REGEX.test(computed)) {
    const serviceValue = serviceTypeSlug || serviceSlug || slug || "";
    if (serviceValue) {
      computed = computed.replace(SERVICE_TOKEN_REGEX, serviceValue);
    } else {
      computed = "";
    }
  }

  // Replace {lokasi}/{location}/{city} tokens
  if (computed && LOCATION_TOKEN_REGEX.test(computed)) {
    if (locationSlug) {
      computed = computed.replace(LOCATION_TOKEN_REGEX, locationSlug);
    } else {
      computed = "";
    }
  }

  const lastComputed = useRef<string>("");

  useEffect(() => {
    if (!computed) return;
    const currentValue = typeof props.value === "string" ? props.value : "";
    if (!currentValue || currentValue === lastComputed.current) {
      lastComputed.current = computed;
      props.onChange(set(computed));
    }
  }, [computed, props]);

  return (
    <Stack space={2}>
      <Text size={1} muted>
        Auto route: {computed || "—"} (dari routePattern + service/location)
      </Text>
      {props.renderDefault(props)}
    </Stack>
  );
}
