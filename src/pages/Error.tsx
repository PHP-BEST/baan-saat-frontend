import ActionButton from '@/components/our-components/actionButton';

export default function ErrorPage() {
  return (
    <main className="bg-background min-h-screen w-full px-10 py-10 flex flex-col justify-center items-center">
      <h1 className="font-bold text-start text-xl md:text-2xl lg:text-3xl xl:text-4xl">
        ERROR 404 Not Found
      </h1>
      <ActionButton onClick={() => window.history.back()} className="mt-8">
        Back
      </ActionButton>
    </main>
  );
}
