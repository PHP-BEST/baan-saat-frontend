import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useCounter from '@/hooks/useCounter';
import React from 'react';

export default function Counter() {
  const { count, increment, val, setVal } = useCounter();

  return (
    <div>
      <Input
        className="w-72"
        type="text"
        value={val}
        onChange={(e) => {
          const num = e.target.value.replace(/[^0-9]/g, '');
          setVal(Math.max(0, Number(num)));
        }}
      />
      <Button className="w-72" onClick={() => increment()}>
        count is {count}
      </Button>
    </div>
  );
}
