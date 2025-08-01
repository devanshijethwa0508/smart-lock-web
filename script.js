
function addDigit(digit) {
  const input = document.getElementById('pinInput');
  if (input.value.length < 4) {
    input.value += digit;
  }
}

function clearPin() {
  document.getElementById('pinInput').value = '';
}

async function startAuth() {
  const pin = document.getElementById('pinInput').value;
  if (pin !== "1234") {
    alert("❌ Incorrect PIN");
    return;
  }

  const options = {
    publicKey: {
      challenge: new Uint8Array(32),
      timeout: 60000,
      userVerification: "required"
    }
  };

  try {
    const credential = await navigator.credentials.get(options);
    alert("✅ Authenticated!");
    fetch("http://192.168.4.1/unlock", { method: "POST" }); // replace with ESP8266 IP
  } catch (err) {
    alert("❌ Authentication failed");
  }
}
