import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';
import { Button } from './button';

export default {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = () => (
  <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Card Content</p>
    </CardContent>
  </Card>
);

export const WithFooter = () => (
  <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Create Project</CardTitle>
      <CardDescription>Deploy your new project in one-click.</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Project details go here...</p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline">Cancel</Button>
      <Button>Deploy</Button>
    </CardFooter>
  </Card>
);

export const JobCard = () => (
  <Card className="w-[400px]">
    <CardHeader>
      <CardTitle>Senior Frontend Developer</CardTitle>
      <CardDescription>TechHub UPE - Remote</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p className="text-sm">
          <strong>Type:</strong> Full-time
        </p>
        <p className="text-sm">
          <strong>Salary:</strong> $80,000 - $120,000
        </p>
        <p className="text-sm">
          We are looking for an experienced frontend developer to join our team...
        </p>
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full">Apply Now</Button>
    </CardFooter>
  </Card>
);

export const StatsCard = () => (
  <Card className="w-[300px]">
    <CardHeader className="pb-2">
      <CardDescription>Total Applications</CardDescription>
      <CardTitle className="text-4xl">1,234</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-xs text-muted-foreground">
        +20% from last month
      </div>
    </CardContent>
  </Card>
);

export const EventCard = () => (
  <Card className="w-[400px]">
    <CardHeader>
      <CardTitle>Tech Workshop: React Hooks</CardTitle>
      <CardDescription>March 15, 2025 - 10:00 AM</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p className="text-sm">
          <strong>Location:</strong> Online (Zoom)
        </p>
        <p className="text-sm">
          Join us for an in-depth workshop on React Hooks. Learn about useState,
          useEffect, and custom hooks.
        </p>
      </div>
    </CardContent>
    <CardFooter className="flex gap-2">
      <Button variant="outline" className="flex-1">Save</Button>
      <Button className="flex-1">Register</Button>
    </CardFooter>
  </Card>
);
