import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import ActionButton from '@/components/our-components/actionButton';
import { Calendar } from '@/components/ui/calendar';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      className={cn(
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

export const ServiceRequestPage: React.FC = () => {
  const [formData, setFormData] = useState({
    requestTitle: '',
    description: '',
    tags: '',
    pricing: '',
    location: '',
  });
  const [date, setDate] = useState<Date | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      date: date ? format(date, 'yyyy-MM-dd') : 'Not selected',
    };
    alert(`Form Submitted:\n${JSON.stringify(dataToSend, null, 2)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow w-full max-w-4xl mx-auto py-12 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create a Request
          </h1>
          <div className="space-y-6">
            {/* Request Title */}
            <div>
              <label
                htmlFor="requestTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Request Title
              </label>
              <Input
                id="requestTitle"
                name="requestTitle"
                type="text"
                placeholder="Request Title"
                value={formData.requestTitle}
                onChange={handleInputChange}
                className="border-gray-300"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="border-gray-300"
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tags
              </label>
              <Input
                id="tags"
                name="tags"
                type="text"
                placeholder="Add Tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="border-gray-300"
              />
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="pricing"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Budget
              </label>
              <Input
                id="pricing"
                name="pricing"
                type="text"
                placeholder="Budget"
                value={formData.pricing}
                onChange={handleInputChange}
                className="border-gray-300"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
                className="border-gray-300"
              />
            </div>

            {/* Custom Calendar in Popover */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border rounded-md shadow-lg">
                  <Calendar
                    mode="single"
                    value={date}
                    onSelect={(val) => {
                      if (val instanceof Date || val === null) {
                        setDate(val);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <ActionButton
                type="button"
                buttonColor="blue"
                buttonType="filled"
                onClick={() => {
                  const confirmed = window.confirm(
                    'Are you sure you want to submit?',
                  );
                  if (confirmed) {
                    const dataToSend = {
                      ...formData,
                      date: date ? format(date, 'yyyy-MM-dd') : 'Not selected',
                    };
                    alert(
                      `Form Submitted:\n${JSON.stringify(dataToSend, null, 2)}`,
                    );
                  }
                }}
              >
                Submit
              </ActionButton>

              <ActionButton
                type="button"
                buttonColor="red"
                buttonType="outline"
                onClick={() => {
                  const confirmed = window.confirm('Cancel and go back?');
                  if (confirmed) {
                    window.location.href = '/';
                  }
                }}
              >
                Cancel
              </ActionButton>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceRequestPage;
