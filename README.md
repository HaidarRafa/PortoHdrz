# Haidar Rafa Radinka — Portofolio

Website portofolio mahasiswa dengan section perkenalan, keahlian, proyek, perjalanan belajar, mata kuliah, dan kontak. Fase ini berfokus pada portfolio; aplikasi daftar tugas akan dikerjakan terpisah pada branch berikutnya.

## Panduan untuk AI coding assistant

README ini adalah sumber aturan proyek. Sebelum mengubah kode, ikuti spesifikasi di bawah ini. Jika permintaan baru bertentangan dengan aturan yang sudah ada, jelaskan konflik dan ubah aturan hanya jika memang diminta.

### Stack dan struktur

- Gunakan Vite dan TypeScript strict tanpa framework UI tambahan.
- Gunakan HTML semantik dan CSS biasa; hindari dependensi baru jika platform web sudah memadai.
- Entry point HTML berada di root sesuai default Vite.
- Struktur:

  ```text
  .
  ├── index.html             # Landing portfolio dengan section dan anchor navigation
  ├── style.css              # Gaya bersama untuk seluruh halaman
  ├── src/
  │   ├── main.ts            # Data dan interaksi portfolio
  │   └── vite-env.d.ts      # Tipe environment Vite
  ├── images/
  │   ├── profile.png       # Foto profil portrait 9:16
  │   └── skills/           # Logo teknologi
  ├── .env.example           # Contoh konfigurasi non-rahasia
  ├── .env                   # Konfigurasi lokal; jangan commit
  ├── package.json
  ├── package-lock.json
  ├── tsconfig.json
  ├── .gitignore
  └── .vscode/
      └── settings.json     # Sembunyikan folder hasil install/build di Explorer
  ```

- Gunakan tautan relatif (`./...`) agar portfolio dapat di-host di root domain maupun subpath.
- Pertahankan fakta profil dan aset yang sudah ada kecuali diminta untuk mengubahnya.

### Standar coding

- Tulis TypeScript dengan `strict` aktif. Gunakan `interface` untuk bentuk data, type alias untuk union, tipe eksplisit untuk batas input/output, dan fungsi generik hanya saat meningkatkan keamanan/kemudahan penggunaan.
- Gunakan nama yang menjelaskan maksud, fungsi kecil, dan hindari duplikasi.
- Jangan menambahkan komentar untuk kode yang sudah jelas.
- Untuk DOM, gunakan elemen semantik, `textContent`, dan event listener; jangan membangun markup dari input pengguna menggunakan `innerHTML`.
- Tampilkan kegagalan pemrosesan secara eksplisit; jangan abaikan error atau memberi kesan seolah-olah proses berhasil.

### Aturan desain UI/UX

- Arah visual: portfolio modern, editorial, dan personal. Gunakan hero lebar dengan teks dan foto, section yang jelas, baris/grid teknologi yang responsif, kartu proyek sederhana, dan navigasi anchor yang mudah ditemukan.
- Palet:
  - Latar hangat: `#F7F5F1`
  - Permukaan: `#FFFFFF`
  - Indigo utama: `#2F355C`
  - Coral aksen: `#C63823` (teks/aksi kecil berkontras tinggi), `#E7472B` (aksen dekoratif)
  - Teks sekunder: `#666670`
  - Garis pemisah: `#E2DFD8`
- Gunakan Nunito untuk tipografi yang hangat dan ramah, dengan fallback `Trebuchet MS`, `Segoe UI`, sans-serif. Nunito dari Google Fonts sudah disetujui untuk desain ini; jangan menambah font eksternal lain.
- Tampilkan nama teknologi sebagai label teks. Simpan logo satuan di `images/skills/`; karena nama sudah terlihat, logo diberi `alt=""` dan disembunyikan dari pembaca layar.
- Simpan logo kontak Email, GitHub, dan Instagram di `images/contact/`. Tautannya hanya menampilkan logo; berikan nama aksesibel pada setiap tautan dan `alt=""` pada gambar dekoratif.
- Gunakan ruang putih, hierarki heading yang tegas, dan aksen warna secukupnya. Animasi dan hover harus halus serta tidak menghalangi penggunaan.
- Gunakan copy orisinal dalam bahasa Indonesia. Jangan mengarang pengalaman, pencapaian, atau skill.
- Navigasi hanya mengarah ke section portfolio yang tersedia. Pada fase ini jangan menambahkan tautan atau halaman aplikasi tugas.
- Ambil inspirasi dari pola umum (hero, skill group, project summary, contact), bukan menyalin teks, foto, logo, ikon, kode, atau komposisi khas website referensi. Pakai foto/aset milik proyek atau yang memiliki izin.
- Jangan menambahkan form yang mengumpulkan data, cookie banner, reCAPTCHA, logo pihak ketiga, font eksternal selain Nunito yang sudah disetujui, atau layanan jarak jauh tanpa kebutuhan dan persetujuan.
- Mulai dari layout mobile; gunakan grid/flex responsif dan pastikan tidak ada scroll horizontal.
- Semua kontrol harus memiliki label yang jelas, fokus keyboard terlihat, kontras yang memadai, dan status/peringatan yang dapat dibaca teknologi bantu.
- Hormati `prefers-reduced-motion` jika menambahkan animasi.

### Data, localStorage, dan API

- Fase portfolio ini tidak menggunakan database, localStorage, atau API.
- Jangan menambah layanan data atau API eksternal tanpa permintaan.

### Environment dan keamanan

- Gunakan `.env` hanya untuk konfigurasi non-rahasia, misalnya nama dan versi aplikasi; sertakan pasangan contoh di `.env.example`.
- Nilai `VITE_APP_NAME` dan `VITE_APP_VERSION` disisipkan Vite ke metadata HTML saat build; versi aplikasi tidak perlu ditampilkan pada footer.
- Nilai `VITE_*` masuk ke bundle browser dan bukan tempat untuk password, token, API key rahasia, atau data pribadi.
- Jangan pernah menambahkan rahasia ke kode, log, README, atau repository. Pertahankan `.env` di `.gitignore`.
- Perlakukan semua input pengguna dan data browser sebagai tidak tepercaya. Hindari injeksi HTML, validasi data, dan minta konfirmasi sebelum tindakan destruktif yang berisiko.
- Jangan mengirim data pribadi ke layanan eksternal.

## Menjalankan proyek

Prasyarat: Node.js dan npm.

```bash
npm install
npm run dev
```

Jika `.env` belum ada, salin `.env.example` menjadi `.env` dari folder proyek. Di PowerShell:

```powershell
Copy-Item .env.example .env
```

Perintah lain:

```bash
npm run typecheck
npm run build
npm run preview
```

Hasil produksi ada di `dist/` dan dapat diterbitkan sebagai situs statis pada layanan hosting yang mendukung Vite. Atur base path sesuai layanan jika website dipasang di subpath.

### Dependencies dan semantic versioning

- Vite dan TypeScript tercatat sebagai `devDependencies` karena digunakan saat pengembangan, typecheck, dan build.
- `package-lock.json` mencatat versi dependency yang terpasang agar instalasi dapat direproduksi.
- Nomor versi mengikuti pola `MAJOR.MINOR.PATCH`; awalan `^` pada rentang dependency mengizinkan pembaruan yang kompatibel sebelum major berikutnya.

## Fitur

- Landing portfolio berisi profil, keahlian, proyek, perjalanan belajar/mata kuliah, dan kontak.
- Tidak ada pengelola tugas pada fase ini; fitur tersebut dikerjakan di branch terpisah.

## Checklist Git dan GitHub untuk tugas kuliah

Lakukan langkah berikut pada repository GitHub milik sendiri; jangan membuat commit/PR tanpa remote dan akun yang sesuai.

1. Inisialisasi repository, tambahkan `.gitignore`, lalu hubungkan remote GitHub.
2. Buat beberapa commit kecil dengan pesan yang menjelaskan perubahan (minimal lima commit sesuai tugas).
3. Buat minimal dua branch selain branch utama, kerjakan perubahan terpisah, lalu merge kembali.
4. Untuk latihan conflict, ubah baris yang sama pada dua branch, merge, selesaikan conflict secara manual, jalankan build, lalu commit hasilnya.
5. Praktikkan `git push` dan `git pull` pada remote yang benar.
6. Buat minimal satu Pull Request dari branch fitur ke branch utama, tinjau perubahan, lalu merge.
7. Jangan commit `.env`, `node_modules/`, atau `dist/`.

Pastikan semua fitur diuji dan build berhasil sebelum membuat Pull Request atau menerbitkan website.
