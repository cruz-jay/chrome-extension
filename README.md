This extension simplifies the process of converting video files directly from your browser. It features a drag-and-drop interface and a visual loading indicator to enhance user experience. The conversion is handled by a backend server using ffmpeg on a Linux environment.

frontend/ – Contains all client-side logic:

Drag-and-drop file upload

Loading indicator

UI components

backend/ – Handles file conversion:

Built with Node.js

Uses multer for file uploads

Executes ffmpeg commands via child_process.exec

How it Works:
When a user drops an MP4 file into the extension:

The file is sent to the backend server.

The backend uses ffmpeg to convert the file with the following command:

ffmpeg -i "${inputFile}" -c:v libvpx -b:v 1M -c:a libvorbis "${outputFile}"

I'm thinking of actually hosting on this in a linux hosting site but i don't want to pay for anything.
