import { Gavel } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Gavel className="w-8 h-8 text-primary" />
        <h1 className="ml-3 text-2xl font-bold tracking-tight text-foreground font-headline">
          LexiQ
        </h1>
      </div>
    </header>
  );
}
