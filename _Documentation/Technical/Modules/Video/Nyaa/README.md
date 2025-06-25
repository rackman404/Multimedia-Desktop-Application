Overview


# Features
- Search available anime file downloads (through nyaa.si web scraper)
- Provide torrenting capabilities through web-torrent

# Composition

### External Dependencies
- Puppeteer (Webscraper)
- Cheerio
- Axios

### Communication
IPC:
- 
### Backend (Main)
Services:
- Contains all logic code
- Stored in main/services/audio_edit_service
- Composed of the following:
	- Manager Class: Maintains the service
	- Broker Class: Handles IPC requests
	- Logic Classes: 

### Frontend (Renderer)
Views:
- Composed of static and dynamic (regular) components
	Static Components: Stored in renderer/component/audio/edit/static
	Regular Components: Stored in renderer/component/audio/edit/regular
	CSS files stored in same directories as each file

# Implementation
