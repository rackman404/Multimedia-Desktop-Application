import { MemoryRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

import Dashboard from './views/Dashboard'
import MusicHome from './views/audio/music/MusicHome'
import MusicPlayLists from './views/audio/music/MusicPlaylists'
import Settings from './views/utility/Settings'
import Help from './views/utility/Help'
import About from './views/utility/About'

import FFmpeg from './views/audio_utils/AudioUtilFFMpeg'

import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material';
import { TopHeader } from './components/static/TopHeader';
import { BottomMusicControl } from './components/static/Audio/Music/BottomMusicControl';
import MusicController from './views/audio/music/MusicController';
import { useGlobalSettingsState } from './state_stores/GlobalSettingsStateStore';

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
  const setMouseState = useGlobalSettingsState((state) => state.setIsMouseDown);

  document.body.onpointerdown = function() { 
    setMouseState(true);
    //console.log("mouse down");
  }

  document.body.onpointerup = function() { 
    setMouseState(false);
    //console.log("mouse up");
  }

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

        <Route path="/audioutil/ffmpeg" element={<FFmpeg />} />

        <Route path="/utility/settings" element={<Settings />} />
        <Route path="/utility/help" element={<Help />} />
        <Route path="/utility/about" element={<About />} />

      </Routes>
      
    </Router>
    </ThemeProvider>
  );
}
