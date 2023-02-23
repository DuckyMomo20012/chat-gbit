import { Provider } from 'react-redux';
import { store } from '@/store/store';

const ReduxProvider = ({ children }: { children?: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};
export { ReduxProvider };
