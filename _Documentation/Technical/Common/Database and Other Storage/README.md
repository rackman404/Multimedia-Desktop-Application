UNFINISHED

# Overview

This application makes use of two forms of data handling for secondary storage (non volatile permanent storage). A relational database (with one schema per service as required) used in SQLite and JSON files stored in a config folder in the root folder of the application.
### Use Cases
- Relational Database
	- Used when a large dataset with many records needs to be handled *and* there may be a need to further parse or relate the data in other forms 
		- Ex. Music Service will compose of it's own schema in the application's database with tables for playlist, songs, etc..; Where records in table songs could be used in playlist table.
- JSON File:
	- Used only for simple data that doesn't require tables of records.
	- Therefore, application config data (ex. fullscreen state) as well as service specific config data (ex. DeepL key, Default lyric offset) is stored
	- Also, simple data such as last played song is stored in a Misc JSON file (but may be moved into a schema if required).

# Relational Databases

### Overview

This application will make use of SQLite due to the the fact that the application is intended to be fully portable (no requirement to connect online or to a central service for core features in services). 




# JSON File Storage

### Overview