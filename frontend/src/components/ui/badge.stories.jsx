import { Badge } from './badge';

export default {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual style variant of the badge',
    },
  },
};

/**
 * Default badge style
 */
export const Default = {
  args: {
    children: 'Badge',
  },
};

/**
 * Secondary variant with subtle appearance
 */
export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/**
 * Destructive variant for errors or warnings
 */
export const Destructive = {
  args: {
    variant: 'destructive',
    children: 'Error',
  },
};

/**
 * Outline variant with border
 */
export const Outline = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

/**
 * All badge variants displayed together
 */
export const AllVariants = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

/**
 * Badges with different content
 */
export const DifferentContent = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge>New</Badge>
      <Badge variant="secondary">Beta</Badge>
      <Badge variant="destructive">Deprecated</Badge>
      <Badge variant="outline">v2.0</Badge>
      <Badge>🎉 Featured</Badge>
    </div>
  ),
};
