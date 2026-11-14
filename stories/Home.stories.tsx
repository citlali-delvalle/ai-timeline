import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Home from '../app/page';
import { timelineContent } from '../app/timeline-content';
import '../app/globals.css';
import '../app/glass.css';

const meta = {
  title: 'Timeline/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    content: timelineContent,
  },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleEvent: Story = {
  args: {
    content: {
      ...timelineContent,
      events: timelineContent.events.slice(0, 1),
    },
  },
};

export const EmptyTimeline: Story = {
  args: {
    content: {
      ...timelineContent,
      events: [],
    },
  },
};
