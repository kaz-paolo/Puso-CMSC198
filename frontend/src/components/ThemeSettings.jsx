import { Stack, Group, Button, Text, Drawer } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from '../theme/ThemeProvider';
import { colorOptions } from '../theme/colors';
import { useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useState } from 'react';

const platformOptions = [
  { label: 'System', value: 'system' },
  { label: 'Default', value: 'default' },
  { label: 'Windows', value: 'windows' },
  { label: 'iOS', value: 'ios' },
  { label: 'Android', value: 'android' },
  { label: 'macOS', value: 'macos' },
];

export function ThemeSettings({ opened, onClose }) {
  const { primaryColor, changePrimaryColor, currentColors, platform, setPlatform } = useTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const mantineTheme = useMantineTheme();

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title="Theme Settings"
      size="sm"
      padding="md"
      zIndex={1000}
      overlayProps={{ opacity: 0.5 }}
    >
      <Stack gap="xl">
        <div>
          <Text size="sm" fw={600} mb="sm">
            Font Settings
          </Text>
          <Group gap="xs">
            {platformOptions.map(opt => (
              <Button
                key={opt.value}
                variant={platform === opt.value ? 'filled' : 'outline'}
                onClick={() => setPlatform(opt.value)}
                size="xs"
              >
                {opt.label}
              </Button>
            ))}
          </Group>
        </div>

        {/* Color Scheme Section */}
        <div>
          <Text size="sm" fw={600} mb="sm">
            Color Scheme
          </Text>
          <Group gap="md" grow>
            <Button
              leftSection={<IconSun size={16} />}
              variant={colorScheme === 'light' ? 'filled' : 'outline'}
              onClick={() => setColorScheme('light')}
              fullWidth
            >
              Light
            </Button>
            <Button
              leftSection={<IconMoon size={16} />}
              variant={colorScheme === 'dark' ? 'filled' : 'outline'}
              onClick={() => setColorScheme('dark')}
              fullWidth
            >
              Dark
            </Button>
          </Group>
        </div>

        {/* Color Palette Section */}
        <div>
          <Text size="sm" fw={600} mb="sm">
            Color Palette
          </Text>
          <Stack gap="xs">
            {colorOptions.map((color) => (
              <Button
                key={color.value}
                variant={primaryColor === color.value ? 'filled' : 'outline'}
                onClick={() => changePrimaryColor(color.value)}
                fullWidth
              >
                {color.name}
              </Button>
            ))}
          </Stack>
        </div>

      </Stack>
    </Drawer>
  );
}