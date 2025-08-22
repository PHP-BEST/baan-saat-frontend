import { getSamples, type Sample } from '@/api/samples';
import Counter from '@/components/our-components/counter';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  const [samples, setSamples] = useState<Sample[]>([]);

  useEffect(() => {
    async function fetchSamples() {
      try {
        const samplesFromAPI = await getSamples();
        setSamples(samplesFromAPI);
      } catch (error) {
        setSamples([]);
      }
    }
    fetchSamples();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-bold text-2xl">This is Landing Page</p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => {
            alert('Landing button clicked');
          }}
          asChild
        >
          <Link to="/register">Register</Link>
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            alert('For what...');
          }}
          asChild
          className="bg-red-500 text-black hover:bg-red-400 transition duration-300"
        >
          <Link to="/xdza555+">What is this?</Link>
        </Button>
      </div>

      {/* Counter */}
      <Counter />

      {/* API Things */}
      {samples.length == 0 ? (
        <p>There's no Objects!</p>
      ) : (
        <>
          <p>Here's the objects...</p>
          <ul>
            {samples.map((s) => (
              <li key={s._id}>
                <p>{s.name}</p>
                <p>{s.description}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
