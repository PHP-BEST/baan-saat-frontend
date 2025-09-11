import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useState } from 'react';
interface MyDatePickerProps {
  onSendData: (date: Date | undefined) => void;
}
export default function MyDatePicker({
  onSendData
}: MyDatePickerProps
) {
  const [selected, setSelected] = useState<Date>();

  return (
    <DayPicker
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
      showOutsideDays={true}
      navLayout="around"
      captionLayout="dropdown"
    />
  );
}