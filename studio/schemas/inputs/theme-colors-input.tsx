import {
  Box,
  Card,
  Flex,
  Grid,
  Stack,
  Text,
} from "@sanity/ui";

const TOKEN_GUIDE = [
  {
    name: "Primary",
    description: "Warna utama tombol utama, highlight action, dan elemen brand paling dominan.",
  },
  {
    name: "Primary Foreground",
    description: "Warna teks atau icon di atas warna Primary. Harus kontras agar tombol tetap terbaca.",
  },
  {
    name: "Accent",
    description: "Warna surface halus untuk panel, hover, dan area pendukung yang tidak sekuat Primary.",
  },
  {
    name: "Ring",
    description: "Warna focus state dan penekanan interaktif. Dipakai saat elemen aktif atau difokuskan.",
  },
];

const PRESET_PREVIEWS = [
  {
    name: "Neutral",
    value: "neutral",
    summary: "Aman, editorial, dan paling netral untuk corporate.",
    lightPrimary: "#171717",
    lightAccent: "#F5F5F5",
    lightRing: "#0070F3",
  },
  {
    name: "Ocean",
    value: "ocean",
    summary: "Kesan tech, bersih, dan modern.",
    lightPrimary: "#0070F3",
    lightAccent: "#EBF4FF",
    lightRing: "#0070F3",
  },
  {
    name: "Sunset",
    value: "sunset",
    summary: "Lebih hangat dan sales-driven untuk CTA yang kuat.",
    lightPrimary: "#E5484D",
    lightAccent: "#FFF3E0",
    lightRing: "#F59E0B",
  },
  {
    name: "Brand Tricolor A",
    value: "brand-tricolor-a",
    summary: "Biru dominan dengan aksen kuning, cocok untuk printing dan layanan komersial.",
    lightPrimary: "#0070F3",
    lightAccent: "#FFE08A",
    lightRing: "#F59E0B",
  },
  {
    name: "Brand Tricolor B",
    value: "brand-tricolor-b",
    summary: "Merah dominan dengan nuansa promo dan urgency lebih tinggi.",
    lightPrimary: "#E5484D",
    lightAccent: "#EAF2FF",
    lightRing: "#F59E0B",
  },
  {
    name: "Brand Tricolor C",
    value: "brand-tricolor-c",
    summary: "Kuning dominan, lebih ekspresif dan retail-oriented.",
    lightPrimary: "#F59E0B",
    lightAccent: "#EAF2FF",
    lightRing: "#E5484D",
  },
];

const RECOMMENDED_COMBINATIONS = [
  "Corporate B2B: gunakan Neutral, lalu ubah Ring ke biru agar tetap terasa aktif.",
  "SaaS / Tech Agency: mulai dari Ocean, lalu buat Accent sedikit lebih terang untuk panel yang bersih.",
  "Sales Landing: mulai dari Sunset untuk CTA yang lebih agresif dan hangat.",
  "Printing / Creative: pilih Brand Tricolor A untuk kombinasi biru-kuning yang lebih hidup.",
  "Retail / UMKM: pilih Brand Tricolor C jika ingin tampilan lebih ramai dan attention-heavy.",
];

function ColorDot({ color }: { color: string }) {
  return (
    <Box
      style={{
        width: 16,
        height: 16,
        borderRadius: 999,
        backgroundColor: color,
        border: "1px solid rgba(0,0,0,0.12)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.16)",
        flexShrink: 0,
      }}
    />
  );
}

export default function ThemeColorsInput(props: any) {
  return (
    <Stack space={4}>
      <Card padding={4} radius={3} border tone="transparent">
        <Stack space={4}>
          <Stack space={2}>
            <Text size={2} weight="semibold">
              Panduan Singkat Theme Colors
            </Text>
            <Text size={1} muted>
              Ubah warna utama website tanpa edit code. Pilih preset dulu untuk hasil cepat,
              lalu pakai field override di bawah jika ingin fine-tuning per token warna.
            </Text>
          </Stack>

          <Grid columns={[1, 2, 2, 4]} gap={2}>
            {TOKEN_GUIDE.map((item) => (
              <Card key={item.name} padding={3} radius={2} border>
                <Stack space={2}>
                  <Text size={1} weight="semibold">
                    {item.name}
                  </Text>
                  <Text size={1} muted>
                    {item.description}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Grid>

          <Stack space={2}>
            <Text size={1} weight="semibold">
              Preview Preset
            </Text>
            <Grid columns={[1, 1, 2]} gap={2}>
              {PRESET_PREVIEWS.map((preset) => (
                <Card key={preset.value} padding={3} radius={2} border>
                  <Stack space={3}>
                    <Stack space={2}>
                      <Text size={1} weight="semibold">
                        {preset.name}
                      </Text>
                      <Text size={1} muted>
                        {preset.summary}
                      </Text>
                    </Stack>
                    <Flex gap={3} align="center" wrap="wrap">
                      <Flex gap={2} align="center">
                        <ColorDot color={preset.lightPrimary} />
                        <Text size={1}>Primary</Text>
                      </Flex>
                      <Flex gap={2} align="center">
                        <ColorDot color={preset.lightAccent} />
                        <Text size={1}>Accent</Text>
                      </Flex>
                      <Flex gap={2} align="center">
                        <ColorDot color={preset.lightRing} />
                        <Text size={1}>Ring</Text>
                      </Flex>
                    </Flex>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Stack>

          <Stack space={2}>
            <Text size={1} weight="semibold">
              Rekomendasi Kombinasi
            </Text>
            <Card padding={3} radius={2} border>
              <Stack space={3}>
                {RECOMMENDED_COMBINATIONS.map((item) => (
                  <Text key={item} size={1} muted>
                    • {item}
                  </Text>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </Card>

      {props.renderDefault(props)}
    </Stack>
  );
}
