$(document).ready(function () {
  // ===== CLOCK =====
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    $("#clock").text(`${hours}:${minutes} ${ampm}`);
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ===== WINDOW MANAGER =====
  let z = 10; // base z-index

  function createWindow(id, title, content) {
    // Cegah duplikat
    if ($(`#${id}`).length) {
      $(`#${id}`).css("z-index", ++z);
      return;
    }

    const win = $(`
      <div id="${id}" class="window absolute top-10 left-10 w-[400px] 
        bg-white/90 backdrop-blur-md rounded-xl shadow-lg border 
        border-gray-200 overflow-hidden flex flex-col">
        
        <div class="flex justify-between items-center px-3 py-2 
          bg-gray-100 border-b cursor-move">
          <span class="font-semibold text-gray-700">${title}</span>
          <button class="closeBtn text-gray-500 hover:text-red-500">✖</button>
        </div>
        
        <div class="p-4 text-gray-800 text-sm overflow-y-auto h-[250px]">
          ${content}
        </div>
      </div>
    `).appendTo("#desktop");

    // Set z-index
    win.css("z-index", ++z);

    // Close button
    win.find(".closeBtn").on("click", function () {
      win.remove();
    });

    // Fokus window kalau diklik
    win.on("mousedown", function () {
      $(this).css("z-index", ++z);
    });

    // Dragging
    let isDragging = false, offsetX, offsetY;
    const header = win.find(".cursor-move");

    header.on("mousedown", function (e) {
      e.preventDefault();
      isDragging = true;
      const deskRect = $("#desktop")[0].getBoundingClientRect();
      const winRect = win[0].getBoundingClientRect();

      offsetX = e.clientX - winRect.left;
      offsetY = e.clientY - winRect.top;

      $(document).on("mousemove.drag", function (e) {
        if (!isDragging) return;
        let left = e.clientX - deskRect.left - offsetX;
        let top = e.clientY - deskRect.top - offsetY;

        // clamp
        left = Math.max(0, Math.min(left, deskRect.width - winRect.width));
        top = Math.max(0, Math.min(top, deskRect.height - winRect.height));

        win.css({ left, top });
      });

      $(document).on("mouseup.drag", function () {
        isDragging = false;
        $(document).off(".drag");
      });
    });
  }

  // ===== APPS =====
  $("#openNotes").on("click", function () {
    createWindow(
      "notesApp",
      "Notes",
      `
        <textarea class="w-full h-[180px] border rounded-lg p-2 resize-none focus:ring">
          ${localStorage.getItem("notes") || "Tulis catatan di sini..."}
        </textarea>
        <button class="saveNotes mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
      `
    );
  });

  $(document).on("click", ".saveNotes", function () {
    const val = $("#notesApp textarea").val();
    localStorage.setItem("notes", val);
    alert("Notes saved!");
  });

  $("#openGallery").on("click", function () {
    createWindow(
      "galleryApp",
      "Gallery",
      `
        <div class="grid grid-cols-3 gap-2">
          ${[1,2,3,4,5,6].map(i => 
            `<img src="https://picsum.photos/100?${i}" class="rounded-lg shadow">`
          ).join("")}
        </div>
      `
    );
  });
});
