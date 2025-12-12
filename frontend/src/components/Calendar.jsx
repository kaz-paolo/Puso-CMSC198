import { Calendar } from '@mantine/dates';
import { Paper, Text, Badge, Stack, Group, ActionIcon, Menu, ScrollArea, UnstyledButton } from '@mantine/core';
import { useState, useMemo } from 'react';
import { IconCalendar, IconCalendarWeek, IconCalendarMonth, IconCalendarStats } from '@tabler/icons-react';

function EventCalendar({ markedDates = [] }) {
  const [viewMode, setViewMode] = useState('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // earliest event date and set as initial month
  const earliestEventDate = useMemo(() => {
    if (markedDates.length === 0) return new Date();
    const sortedDates = [...markedDates].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    return new Date(sortedDates[0].date);
  }, [markedDates]);

  const [selected, setSelected] = useState(earliestEventDate);

  const getDayProps = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return {};
    }
    
    const dateStr = date.toISOString().split('T')[0];
    const marked = markedDates.find(d => d.date === dateStr);
    
    if (marked) {
      const isEvent = marked.type === 'event';
      return {
        style: {
          backgroundColor: isEvent ? '#40916c' : '#f4a261',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '4px',
          position: 'relative',
        },
      };
    }
    return {};
  };

  const handleDateClick = (dateStr) => {
    const newDate = new Date(dateStr);
    setSelected(newDate);
    setCurrentMonth(newDate);
  };

  // group events
  const eventsByMonth = useMemo(() => {
    const grouped = {};
    markedDates.forEach(event => {
      const date = new Date(event.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(event);
    });
    return grouped;
  }, [markedDates]);

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text fw={600} size="lg">Event Calendar</Text>
          <Group gap="xs">
            <Badge color="green" variant="light" size="sm">Event</Badge>
            <Badge color="orange" variant="light" size="sm">Deadline</Badge>
            
            <Menu shadow="md" width={120}>
              <Menu.Target>
                <ActionIcon variant="light" size="lg">
                  <IconCalendar size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item 
                  leftSection={<IconCalendar size={16} />}
                  onClick={() => setViewMode('day')}
                >
                  Day
                </Menu.Item>
                <Menu.Item 
                  leftSection={<IconCalendarWeek size={16} />}
                  onClick={() => setViewMode('week')}
                >
                  Week
                </Menu.Item>
                <Menu.Item 
                  leftSection={<IconCalendarMonth size={16} />}
                  onClick={() => setViewMode('month')}
                >
                  Month
                </Menu.Item>
                <Menu.Item 
                  leftSection={<IconCalendarStats size={16} />}
                  onClick={() => setViewMode('year')}
                >
                  Year
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>

        <Group align="flex-start" gap="md">
          <div style={{ flex: 1 }}>
            <Calendar
              value={selected}
              onChange={setSelected}
              getDayProps={getDayProps}
              firstDayOfWeek={0}
              size="md"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              level={viewMode === 'year' ? 'year' : 'month'}
            />
          </div>

          <ScrollArea h={300} style={{ flex: '0 0 250px' }}>
            <Stack gap="xs">
              <Text size="sm" fw={600} c="dimmed">Upcoming Schedule</Text>
              {Object.entries(eventsByMonth).map(([monthKey, events]) => (
                <div key={monthKey}>
                  <Text size="xs" fw={500} c="dimmed" mt="sm" mb="xs">
                    {new Date(monthKey + '-01').toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </Text>
                  {events.map((event, idx) => (
                    <UnstyledButton
                      key={idx}
                      onClick={() => handleDateClick(event.date)}
                      style={{ width: '100%' }}
                    >
                      <Paper 
                        p="xs" 
                        withBorder 
                        style={{ 
                          cursor: 'pointer',
                          backgroundColor: selected.toISOString().split('T')[0] === event.date 
                            ? '#f0f0f0' 
                            : 'transparent'
                        }}
                      >
                        <Group gap="xs">
                          <Badge 
                            color={event.type === 'event' ? 'green' : 'orange'} 
                            variant="dot" 
                            size="sm"
                          >
                            {new Date(event.date).getDate()}
                          </Badge>
                          <Text size="xs" lineClamp={1}>{event.title}</Text>
                        </Group>
                      </Paper>
                    </UnstyledButton>
                  ))}
                </div>
              ))}
            </Stack>
          </ScrollArea>
        </Group>
      </Stack>
    </Paper>
  );
}

export default EventCalendar;