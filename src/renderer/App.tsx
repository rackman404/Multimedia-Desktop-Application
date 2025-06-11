import { MemoryRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

import Dashboard from './views/Dashboard'
import MusicHome from './views/audio/MusicHome'
import MusicPlayLists from './views/audio/MusicPlaylists'

import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material';
import { LeftAudioSidebar } from './components/static/Audio/LeftAudioSidebar';
import { TopHeader } from './components/static/TopHeader';
import { BottomMusicControl } from './components/static/Audio/BottomMusicControl';
import MusicController from './views/audio/MusicController';

var theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        
      }
    },
    MuiButton: { 
      styleOverrides: { 
        root: { minWidth: 0, minHeight: 0 } 
      } 
    },

    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h2',
          h2: 'h2',
          h3: 'h2',
          h4: 'h2',
          h5: 'h2',
          h6: 'h2',
          subtitle1: 'h2',
          subtitle2: 'h2',
          body1: 'span',
          body2: 'span',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      
      <TopHeader/>

      <Routes>
        <Route path="/" element={<Dashboard />} />



        <Route path="/audio/music" element={<><MusicController/></>} > 
          <Route path="/audio/music/home" element={<MusicHome/>} />
          <Route path="/audio/music/playlists" element={<MusicPlayLists />} />
        </Route>

      </Routes>
      
    </Router>
    </ThemeProvider>
  );
}
