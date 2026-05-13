import { useMemo, useState } from "react";
import { Box, Button, Card, Grid, Stack, Text, TextInput } from "@sanity/ui";
import { set, unset, type StringInputProps } from "sanity";
import { NAVIGATION_ICON_OPTIONS } from "../blocks/shared/navigation-icon-options";

export default function NavigationIconInput(props: StringInputProps) {
  const { value, onChange, readOnly } = props;
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return NAVIGATION_ICON_OPTIONS;

    return NAVIGATION_ICON_OPTIONS.filter((option) => {
      return (
        option.title.toLowerCase().includes(normalizedQuery) ||
        option.value.toLowerCase().includes(normalizedQuery) ||
        option.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(normalizedQuery),
        )
      );
    });
  }, [query]);

  return (
    <Stack space={3}>
      <TextInput
        aria-label="Filter navigation icons"
        placeholder="Search icons..."
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />

      <Grid columns={[2, 3, 4]} gap={2}>
        <Button
          mode={value ? "default" : "ghost"}
          tone={value ? "default" : "primary"}
          disabled={readOnly}
          onClick={() => onChange(unset())}
          text="No icon"
        />

        {filteredOptions.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;
          return (
            <Card
              key={option.value}
              border
              radius={2}
              padding={2}
              tone={active ? "primary" : "default"}
              style={{ minHeight: 62 }}
            >
              <Button
                mode="bleed"
                disabled={readOnly}
                onClick={() => onChange(set(option.value))}
              >
                <Stack space={2}>
                  <Box>
                    <Icon size={16} />
                  </Box>
                  <Text size={1}>{option.title}</Text>
                </Stack>
              </Button>
            </Card>
          );
        })}
      </Grid>
    </Stack>
  );
}
