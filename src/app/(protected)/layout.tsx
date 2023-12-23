import { AuthGuard } from '@/context/AuthGuard';

const ProtectedLayout = ({ children }: { children?: React.ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default ProtectedLayout;
