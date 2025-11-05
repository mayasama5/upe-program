import { Alert, AlertDescription, AlertTitle } from './alert';
import { Terminal, AlertCircle, Info } from 'lucide-react';

export default {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'Visual style variant of the alert',
    },
  },
};

/**
 * Default alert with icon
 */
export const Default = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Destructive alert for errors
 */
export const Destructive = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Info alert without title
 */
export const WithoutTitle = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>
        This is a simple informational message without a title.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alert with only title
 */
export const OnlyTitle = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>System Maintenance Scheduled</AlertTitle>
    </Alert>
  ),
};

/**
 * Multiple alerts displayed together
 */
export const MultipleAlerts = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          This action cannot be undone. Please proceed with caution.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
