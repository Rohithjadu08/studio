import { SearchCheck } from 'lucide-react';
import type { FC } from 'react';

export const Header: FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-black/30 backdrop-blur-md">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <SearchCheck className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline text-glow-primary text-3d">
              TruthSeeker
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};
