import { Input } from './input';
import { Label } from './label';

export default {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'The input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
  },
};

export const Default = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Email = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Password = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const Disabled = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithLabel = () => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    <Label htmlFor="email">Email</Label>
    <Input type="email" id="email" placeholder="Email" />
  </div>
);

export const WithLabelAndDescription = () => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    <Label htmlFor="email-2">Email</Label>
    <Input type="email" id="email-2" placeholder="Email" />
    <p className="text-sm text-muted-foreground">
      Enter your email address.
    </p>
  </div>
);

export const FileInput = () => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    <Label htmlFor="picture">Picture</Label>
    <Input id="picture" type="file" />
  </div>
);

export const SearchInput = () => (
  <div className="flex w-full max-w-sm items-center space-x-2">
    <Input type="search" placeholder="Search..." />
  </div>
);

export const FormExample = () => (
  <div className="w-full max-w-sm space-y-4">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="John Doe" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="email-form">Email</Label>
      <Input id="email-form" type="email" placeholder="john@example.com" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="phone">Phone</Label>
      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
    </div>
  </div>
);
