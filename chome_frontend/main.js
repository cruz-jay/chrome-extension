// document.addEventListener("DOMContentLoaded", function () {
//   const dropArea = document.getElementById("drop-area");
//   const fileInput = document.getElementById("fileInput");
//   const fileList = document.getElementById("file-list");
//   const selectButton = document.querySelector(".button");

//   // Handle file selection when clicking the button
//   selectButton.addEventListener("click", () => fileInput.click());

//   // Handle file selection via file input
//   fileInput.addEventListener("change", (event) => {
//     handleFiles(event.target.files);
//   });

//   // Prevent default drag behaviors
//   ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
//     dropArea.addEventListener(eventName, (event) => event.preventDefault());
//   });

//   // Highlight drop area when a file is dragged over
//   dropArea.addEventListener("dragover", () => {
//     dropArea.classList.add("drag-over");
//   });

//   dropArea.addEventListener("dragleave", () => {
//     dropArea.classList.remove("drag-over");
//   });

//   // Handle dropped files
//   dropArea.addEventListener("drop", (event) => {
//     dropArea.classList.remove("drag-over");
//     handleFiles(event.dataTransfer.files);
//   });

//   // Function to handle files
//   function handleFiles(files) {
//     for (const file of files) {
//       if (file.type !== "video/mp4") {
//         alert("Only MP4 files are allowed!");
//         continue;
//       }

//       // Display file in the UI
//       const fileItem = document.createElement("div");
//       fileItem.className = "file-item";
//       fileItem.innerHTML = `
//         <div class="file-info">
//           <span class="file-name">${file.name}</span>
//           <span class="file-status">Uploading...</span>
//         </div>
//         <div class="file-actions"></div>
//       `;
//       fileList.appendChild(fileItem);

//       uploadFile(file, fileItem);
//     }
//   }

//   // Function to upload file to server
//   async function uploadFile(file, fileItem) {
//     const statusElement = fileItem.querySelector(".file-status");
//     const actionsElement = fileItem.querySelector(".file-actions");

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       statusElement.textContent = "Uploading...";

//       const response = await fetch("http://localhost:32300/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (response.ok) {
//         statusElement.textContent = "Conversion successful!";
//         statusElement.style.color = "green";

//         // Create download button
//         const downloadButton = document.createElement("button");
//         downloadButton.className = "download-button";
//         downloadButton.textContent = "Download";
//         downloadButton.addEventListener("click", () => {
//           // Create full download URL
//           const downloadUrl = `http://localhost:32300${result.downloadUrl}`;

//           // Create a temporary link and trigger download
//           const tempLink = document.createElement("a");
//           tempLink.href = downloadUrl;
//           tempLink.setAttribute("download", "");
//           tempLink.style.display = "none";
//           document.body.appendChild(tempLink);
//           tempLink.click();
//           document.body.removeChild(tempLink);
//         });

//         actionsElement.appendChild(downloadButton);
//       } else {
//         statusElement.textContent = `Error: ${
//           result.error || "Conversion failed"
//         }`;
//         statusElement.style.color = "red";
//       }
//     } catch (error) {
//       statusElement.textContent = "Server error, please try again";
//       statusElement.style.color = "red";
//       console.error("Upload error:", error);
//     }
//   }
// });

document.addEventListener("DOMContentLoaded", function () {
  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("file-list");
  const selectButton = dropArea.querySelector("button");

  // Handle file selection when clicking the button
  selectButton.addEventListener("click", () => fileInput.click());

  // Handle file selection via file input
  fileInput.addEventListener("change", (event) => {
    handleFiles(event.target.files);
  });

  // Prevent default drag behaviors
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  });

  // Highlight drop area when a file is dragged over
  dropArea.addEventListener("dragover", () => {
    dropArea.classList.add("border-primary-500");
    dropArea.classList.add("bg-primary-50");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("border-primary-500");
    dropArea.classList.remove("bg-primary-50");
  });

  // Handle dropped files
  dropArea.addEventListener("drop", (event) => {
    dropArea.classList.remove("border-primary-500");
    dropArea.classList.remove("bg-primary-50");
    handleFiles(event.dataTransfer.files);
  });

  // Function to handle files
  function handleFiles(files) {
    for (const file of files) {
      if (file.type !== "video/mp4") {
        // Create alert for invalid file type
        const alertDiv = document.createElement("div");
        alertDiv.className =
          "bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded";
        alertDiv.innerHTML = `
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm">${file.name} is not an MP4 file. Only MP4 files are supported.</p>
            </div>
          </div>
        `;
        fileList.appendChild(alertDiv);

        // Remove the alert after 5 seconds
        setTimeout(() => {
          alertDiv.remove();
        }, 5000);

        continue;
      }

      // Create file item UI
      const fileItem = document.createElement("div");
      fileItem.className =
        "bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden";

      const fileSize = formatFileSize(file.size);

      fileItem.innerHTML = `
        <div class="p-4">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span class="font-medium text-gray-800 truncate" title="${file.name}">${file.name}</span>
          </div>
          <div class="text-xs text-gray-500 mt-1">${fileSize}</div>
        </div>
        <div class="file-progress bg-gray-100 h-1">
          <div class="bg-primary-500 h-1 w-0 transition-all duration-300"></div>
        </div>
        <div class="p-4">
          <div class="file-status text-sm text-gray-600">Preparing to upload...</div>
          <div class="file-actions mt-3 flex justify-end"></div>
        </div>
      `;

      fileList.appendChild(fileItem);

      // Get references to elements
      const progressBar = fileItem.querySelector(".file-progress > div");
      const statusElement = fileItem.querySelector(".file-status");
      const actionsElement = fileItem.querySelector(".file-actions");

      // Start the upload
      uploadFile(file, fileItem, progressBar, statusElement, actionsElement);
    }
  }

  // Function to upload file to server
  async function uploadFile(
    file,
    fileItem,
    progressBar,
    statusElement,
    actionsElement
  ) {
    try {
      // Update status
      statusElement.textContent = "Uploading...";

      // Simulate progress updates (since fetch doesn't provide progress easily)
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress <= 90) {
          progressBar.style.width = `${progress}%`;
        }
      }, 300);

      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload file
      const response = await fetch("http://localhost:32300/upload", {
        method: "POST",
        body: formData,
      });

      // Clear progress interval
      clearInterval(progressInterval);

      // Get response data
      const result = await response.json();

      if (response.ok) {
        // Complete progress bar
        progressBar.style.width = "100%";

        // Update status
        statusElement.textContent = "Conversion successful!";
        statusElement.classList.add("text-green-600");

        // Create download button
        const downloadButton = document.createElement("button");
        downloadButton.className =
          "bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium py-1.5 px-3 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary-300";
        downloadButton.innerHTML = `
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download WebM</span>
          </div>
        `;

        downloadButton.addEventListener("click", () => {
          // Create full download URL
          const downloadUrl = `http://localhost:32300${result.downloadUrl}`;

          // Create a temporary link and trigger download
          const tempLink = document.createElement("a");
          tempLink.href = downloadUrl;
          tempLink.setAttribute("download", "");
          tempLink.style.display = "none";
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
        });

        actionsElement.appendChild(downloadButton);
      } else {
        // Update progress bar to red for error
        progressBar.style.width = "100%";
        progressBar.classList.remove("bg-primary-500");
        progressBar.classList.add("bg-red-500");

        // Update status
        statusElement.textContent = `Error: ${
          result.error || "Conversion failed"
        }`;
        statusElement.classList.add("text-red-600");
      }
    } catch (error) {
      console.error("Upload error:", error);

      // Update progress bar to red for error
      progressBar.style.width = "100%";
      progressBar.classList.remove("bg-primary-500");
      progressBar.classList.add("bg-red-500");

      // Update status
      statusElement.textContent = "Server error, please try again";
      statusElement.classList.add("text-red-600");

      // Add retry button
      const retryButton = document.createElement("button");
      retryButton.className =
        "bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-1.5 px-3 rounded transition duration-300 focus:outline-none";
      retryButton.textContent = "Retry";
      retryButton.addEventListener("click", () => {
        // Reset progress bar
        progressBar.style.width = "0%";
        progressBar.classList.add("bg-primary-500");
        progressBar.classList.remove("bg-red-500");

        // Reset status
        statusElement.textContent = "Preparing to upload...";
        statusElement.classList.remove("text-red-600");

        // Remove retry button
        retryButton.remove();

        // Try again
        uploadFile(file, fileItem, progressBar, statusElement, actionsElement);
      });

      actionsElement.appendChild(retryButton);
    }
  }

  // Format file size in a human-readable way
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
});
