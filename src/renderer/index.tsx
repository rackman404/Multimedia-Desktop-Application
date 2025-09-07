import { createRoot } from 'react-dom/client';
import App from './App';
import { ServicesEnum } from '../typesIPC';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron?.ipcRenderer.once(ServicesEnum.ipcExample, (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron?.ipcRenderer.sendMessage(ServicesEnum.ipcExample, ['ping']);

