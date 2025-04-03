import React, { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UIActions } from '@/store/ui/ui.slice';
import { useTheme } from '@/hooks/useTheme';
import ThemeSelector from './ThemeSelector';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { appName } = useSelector((state: RootState) => state.settings);
  const { isMobileMenuOpen } = useSelector((state: RootState) => state.ui);

  const toggleMobileMenu = () => {
    dispatch(UIActions.toggleMobileMenu());
  };

  return (
    <div className="flex h-full flex-col bg-base-100 text-neutral">
      <header className="flex items-center justify-between border-b border-neutral/10 bg-base-200 px-4 py-2">
        <div className="flex items-center">
          <button
            className="mr-4 rounded p-2 text-neutral hover:bg-base-300 md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold">{appName}</h1>
        </div>
        <div className="flex items-center">
          <ThemeSelector />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`w-64 flex-shrink-0 border-r border-neutral/10 bg-base-200 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        >
          <nav className="flex h-full flex-col p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Conversations</h2>
              {/* Conversation list would go here */}
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
