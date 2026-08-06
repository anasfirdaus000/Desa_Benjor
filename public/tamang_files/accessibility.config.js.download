window.addEventListener(
  "load",
  function () {
    new Accessibility({
      icon: {
        circular: true,
        // img: ["accessibility"/"accessible"],
        img: ["accessible"],
        position: {
          bottom: { size: 10, units: "px" },
          right: { size: 180, units: "px" },
          type: "fixed",
        },
      },
      session: { persistent: false },
      hotkeys: { enabled: true },
      labels: {
        resetTitle: "Reset",
        closeTitle: "Tutup",
        menuTitle: "Aksesibilitas",
        increaseText: "Perbesar Teks",
        decreaseText: "Perkecil Teks",
        increaseTextSpacing: "Tambah Jarak Teks",
        decreaseTextSpacing: "Kurangi Jarak Teks",
        increaseLineHeight: "Tambah Tinggi Teks",
        decreaseLineHeight: "Kurangi Tinggi Teks",
        invertColors: "Balik Warna",
        grayHues: "Warna Abu-Abu",
        underlineLinks: "Garis Bawahi Teks",
        bigCursor: "Perbesar Kursor",
        readingGuide: "Alat Bantu Baca",
        textToSpeech: "Ubah Teks Jadi Suara",
        speechToText: "Ubah Suara Jadi Teks",
        disableAnimations: "Matikan Animasi",
      },
      textToSpeechLang: "id-ID",
      speechToTextLang: "id-ID",
      modules: {
        increaseText: false,
        decreaseText: false,
        invertColors: false,
        // increaseTextSpacing: false,
        // decreaseTextSpacing: false,
        // increaseLineHeight: false,
        // decreaseLineHeight: false,
        grayHues: false,
        // underlineLinks: false,
        bigCursor: false,
        readingGuide: false,
        textToSpeech: false,
        speechToText: false,
        disableAnimations: false,
      },
      // iframeModals: [{
      //   iframeUrl: 'https://github.com/ranbuch/accessibility',
      //   buttonText: 'terms',
      //   icon: 'favorite',
      //   emoji: '❤️',
      // }],
      // customFunctions: [{
      //   method: (cf, state) => {
      //     console.log('The provided customFunctions object:', cf);
      //     console.log('Toggle state:', state);
      //   },
      //   buttonText: 'my foo',
      //   id: 1,
      //   toggle: true,
      //   icon: 'psychology_alt',
      //   emoji: '❓',
      // }],
    })

    document
      .querySelector(".mantine-AppShell-root")
      .addEventListener("click", function () {
        let el = document.querySelector("._access-menu")
        el.classList.add("close")
        el.querySelector("ul").classList.add("before-collapse")
      })
  },
  false,
)
