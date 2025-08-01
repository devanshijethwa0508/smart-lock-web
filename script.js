
function addDigit(digit) {
  const input = document.getElementById('pinInput');
  if (input.value.length < 4) {
    input.value += digit;
  }
}

function clearPin() {
  document.getElementById('pinInput').value = '';
}

async function register() {
  const options = {
    publicKey: {
      challenge: new Uint8Array(32),
      rp: { name: "Smart Lock" },
      user: {
        id: new Uint8Array(16),
        name: "user@example.com",
        displayName: "Smart Lock User"
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required"
      },
      timeout: 60000,
      attestation: "none"
    }
  };

  try {
    const credential = await navigator.credentials.create(options);
    const id = arrayBufferToBase64(credential.rawId);
    localStorage.setItem("credentialId", id);
    alert("✅ Fingerprint Registered!");
  } catch (err) {
    alert("❌ Registration failed: " + err);
  }
}

async function startAuth() {
  const pin = document.getElementById('pinInput').value;
  if (pin !== "1234") {
    alert("❌ Incorrect PIN");
    return;
  }

  const storedId = localStorage.getItem("credentialId");
  if (!storedId) {
    alert("❌ No fingerprint registered. Please register first.");
    return;
  }

  const allowCred = [{
    type: "public-key",
    id: base64ToArrayBuffer(storedId),
    transports: ["internal"]
  }];

  const options = {
    publicKey: {
      challenge: new Uint8Array(32),
      timeout: 60000,
      allowCredentials: allowCred,
      userVerification: "required"
    }
  };

  try {
    const credential = await navigator.credentials.get(options);
    alert("✅ Authenticated!");
    fetch("http://192.168.4.1/unlock", { method: "POST" }); // Replace with your ESP8266 IP
  } catch (err) {
    alert("❌ Authentication failed: " + err);
  }
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
