import Navigation from '../sections/Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)]">
      <Navigation />
      <main className="pt-4">{children}</main>
    </div>
  );
};
