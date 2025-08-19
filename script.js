$(document).ready(function() {
  function updateJam() {
    const kini = new Date();
    let jam = kini.getHours();
    const menit = String(kini.getMinutes())
                  .padStart(2, "0");
    const ampm = jam >= 12 ? "PM" : "AM";
    jam = jam % 12 || 12;
    $("#jam-text").text(`${jam}:${menit} ${ampm}`)
  }

  updateJam();
  setInterval(updateJam, 1000);

  // Buat window
  let z = 10;

  $(document).on("mousedown",".window", function() {
    z += 1;
    $(this).css("z-index", z);
  });

  function buatWindow(id, title, content) {
    const win = $(`
      <div id="${id}"
           class="window absolute top-10 left-10 w-[400px]
           bg-white/90 backdrop-blur-md rounded-xl
           shadow-lg border border-gray-200
           overflow-hidden flex flex-col">

          <!-- Bagian header window -->
          <div class="flex justify-between items-center
                      px-3 py-2 bg-gray-100 border-b cursor-move">
              <span class="font-semibold text-gray-700">${title}</span>
              <button class="close-btn text-gray-500 hover:text-red-500">✖</button>  
          </div>

          <!-- Isi konten window -->
          <div class="p-4 text-gray-800 text-sm overflow-y-auto h-[250px]">
              ${content}
          </div>
      </div>
      `)

      $("#desktop").append(win);

      // Drag and drop window
      let iniDragging = false, offsetX, offsetY; 

      win.find(".cursor-move").on("mousedown", function(e) {
        e.preventDefault();
        iniDragging = true;

        const deskRect = $("#desktop")[0].getBoundingClientRect();
        const winRect = win[0].getBoundingClientRect();

        offsetX = e.clientX - winRect.left;
        offsetY = e.clientY - winRect.top;

        $(document).on("mousemove.drag", function(e) {
          if (!iniDragging) return;
          
          // Posisi relatif
          let left = e.clientX - deskRect.left - offsetX;
          let top = e.clientY - deskRect.top - offsetY;

          // Biar ga keluar dekstop
          left = Math.max(0, Math.min(left, deskRect.width - winRect.width));
          top = Math.max(0, Math.min(top, deskRect.height - winRect.height));

          win.css({ left, top });

        }).on("mouseup.drag", function() {
          iniDragging = false;
          $(document).off(".drag");
        });
      });

      // Tutup window klo klik X
      win.find(".close-btn").on("click", function() {
        win.remove();
      });
  }

  // Buat notes
  $("#shortcut-notes, #open-notes").on("click", function() {
    const udahAda = $("#notes-app");
    if (udahAda.length) {
      z += 1;
      udahAda.css("z-index", z);
      return;
    }

    buatWindow("notes-app", "Notes", 
      `<textarea class="w-full h-full border rounded-lg p-2 resize-none focus:ring">${localStorage.getItem("notes") || "Tulis catatan di sini..."}</textarea>
      <button class="save-notes mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
        Save
      </button>
      `
    );

    // Save
    $("#notes-app").find(".save-notes").on("click", function() {
      const val = $("#notes-app textarea").val();
      localStorage.setItem("notes", val);
      alert("Notes saved!");
    });
  });

  // Buat gallery
  $("#shortcut-gallery, #open-gallery").on("click", function() {
    const existing = $("#gallery-app");
    if (existing.length) {
      z += 1;
      existing.css("z-index", z);
      return;
    }

    buatWindow("gallery-app", "Gallery", 
      `<div id="gallery-content" class="flex flex-col h-full">
        <div id="media-viewer" class="flex-1 flex items-center justify-center text-white rounded-lg">
          loading...
        </div>
        <div class="mt-3 flex justify-center gap-4">
          <button id="prev-btn" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Prev</button>
          <button id="next-btn" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Next</button>
        </div>
      </div>`
    );

    let galleryData = [];
    let kiniIndex = 0;

    $.getJSON("gallery.json", function(data) {
      galleryData = data.items || [];
      if (galleryData.length > 0) {
        showMedia(kiniIndex);
      } else {
        $("#media-viewer").text("tidak ada data gallery");
      }
    });

    function showMedia(index){
      const item = galleryData[index];
      if (!item) return;

      if (item.type === "image" || item.type === "gif") {
        $("#media-viewer").html(`<img src="${item.src}" class="w-auto h-[190px] object-contain rounded-lg shadow">`);
      } else if (item.type === "video") {
        $("#media-viewer").html(
          `<video controls class="w-auto h-[190px] object-contain rounded-lg shadow">
            <source src="${item.src}" type="video/mp4">
            Browser Anda tidak mendukung video.
          </video>`);
      }
    }

    $(document).on("click", "#next-btn", function() {
      if (galleryData.length === 0) return;
      kiniIndex = (kiniIndex + 1) % galleryData.length;
      showMedia(kiniIndex);
    });
    
    $(document).on("click", "#prev-btn", function() {
      if (galleryData.length === 0) return;
      kiniIndex = (kiniIndex - 1 + galleryData.length) % galleryData.length;
      showMedia(kiniIndex);
    });
  });
});