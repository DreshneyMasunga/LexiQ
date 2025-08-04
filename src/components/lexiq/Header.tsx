import { Gavel } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
        <div className="flex items-center gap-2">
            <Gavel className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
            LexiQ
            </h1>
        </div>
      </div>
    </header>
  );
}
