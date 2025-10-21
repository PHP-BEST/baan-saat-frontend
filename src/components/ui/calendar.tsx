import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useState } from 'react';
interface MyDatePickerProps {
  onSendData: (date: Date | undefined) => void;
  disabled?: boolean;
}
export default function MyDatePicker({ onSendData }: MyDatePickerProps) {
  const [selected, setSelected] = useState<Date>();
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return (
    <DayPicker
      disabled={[{ before: today }]}
      showOutsideDays={false}
      classNames={{
        caption: 'text-sm font-semibold text-gray-700 mb-2 text-center',
        day: 'rounded-full hover:bg-gray-200 active:bg-gray-400 transition-colors',
        day_selected: 'bg-black text-white rounded-full hover:bg-black',
        today: 'text-red-500 font-bold',
      }}
      style={{ '--rdp-day_button-height': '32px' } as React.CSSProperties}
      animate
      mode="single"
      selected={selected}
      onSelect={(val) => {
        setSelected(val);
        onSendData(val);
      }}
      navLayout="around"
      captionLayout="dropdown"
      startMonth={new Date(now.getFullYear(), now.getMonth())}
      endMonth={new Date(now.getFullYear() + 1, 11)}
    />
  );
}
