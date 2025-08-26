import { getSamples, type Sample } from '@/api/samples';
import { testConnection } from '@/api/connection';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ActionButton from '@/components/our-components/actionButton';

export const LandingPage = () => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [connectionWord, setConnectionWord] = useState<string>('');
  const [isConnecting, setConnecting] = useState<boolean>(false);
  const [isFetchingSamples, setFetchingSamples] = useState<boolean>(false);

  useEffect(() => {
    async function checkConnection() {
      setConnecting(true);
      try {
        const connection = await testConnection();
        setConnectionWord(connection);
      } catch (error) {
        console.error(error);
        setConnectionWord('There is something wrong... ');
      }
      setConnecting(false);
    }
    checkConnection();
  }, []);

  useEffect(() => {
    async function fetchSamples() {
      setFetchingSamples(true);
      try {
        const samplesFromAPI = await getSamples();
        setSamples(samplesFromAPI);
      } catch (error) {
        console.error(error);
        setSamples([]);
      }
      setFetchingSamples(false);
    }
    fetchSamples();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-bold text-2xl">This is Landing Page</p>

      {/* Buttons */}
      <div className="flex gap-4">
        <ActionButton
          buttonColor="blue"
          buttonType="filled"
          onClick={() => {
            alert('Register button clicked');
          }}
          asChild
        >
          <Link to="/register">Register</Link>
        </ActionButton>

        <ActionButton buttonColor="red" buttonType="outline">
          Sign out
        </ActionButton>

        <ActionButton
          buttonColor="green"
          buttonType="outline"
          onClick={() => {
            alert('Upload Successfully');
          }}
          fontSize={16}
        >
          Upload
        </ActionButton>

        <ActionButton className="bg-black text-white text-2xl font-semibold">
          Customize
        </ActionButton>
      </div>

      {/* API Things */}
      <p className="text-2xl font-bold">Testing Connection</p>
      {isConnecting ? <p>Loading...</p> : <p>{connectionWord}</p>}

      {isFetchingSamples ? (
        <p>Loading...</p>
      ) : samples.length == 0 ? (
        <p>{"There's no Objects!"}</p>
      ) : (
        <>
          <p>{"Here's the objects..."}</p>
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
