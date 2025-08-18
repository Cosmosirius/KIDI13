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
    $(document).on("click", ".save-notes", function() {
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
      `<div class="grid grid-cols-3 gap-2">
        <img src="https://i.pinimg.com/736x/35/f3/08/35f308c88e0855cb3304a1bd51823622.jpg" class="h-full rounded-lg shadow cursor-pointer hover:scale-105 transition">
        <img src="https://i.pinimg.com/736x/ae/a8/d4/aea8d48e11c16e4916a030ffc462dfec.jpg" class="rounded-lg shadow cursor-pointer hover:scale-105 transition">
        <img src="https://i.pinimg.com/1200x/88/59/24/8859248dcd0612bc61077d9d8ddaf2ea.jpg" class="rounded-lg shadow cursor-pointer hover:scale-105 transition">
        <img src="https://i.pinimg.com/736x/c0/23/e3/c023e3e316de791d426572d53067a9ec.jpg" class="rounded-lg shadow cursor-pointer hover:scale-105 transition">
        <img src="https://i.pinimg.com/originals/ea/8b/13/ea8b137fbc46bea2f12cc9087e57053d.gif" class="rounded-lg shadow cursor-pointer hover:scale-105 transition">
        <img src="https://i.pinimg.com/1200x/c1/a3/8e/c1a38e24cba5663d75045eeafbadb4de.jpg" class="rounded-lg shadow cursor-pointer hover:scale-105 transition">
      </div>`
    );
  });
});