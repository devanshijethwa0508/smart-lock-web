
async function register() {
  try {
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array(32),
        rp: { name: "Smart Lock" },
        user: {
          id: new Uint8Array(16),
          name: "devanshi@example.com",
          displayName: "Devanshi"
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        authenticatorSelection: { userVerification: "required" },
        timeout: 60000,
        attestation: "direct"
      }
    });
    localStorage.setItem("credId", arrayBufferToBase64(cred.rawId));
    document.getElementById("status").innerText = "✅ Fingerprint registered successfully!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Registration failed.";
  }
}

async function unlock() {
  const pin = document.getElementById("pin").value;
  if (pin !== "1234") {
    document.getElementById("status").innerText = "❌ Incorrect PIN";
    return;
  }

  const credIdBase64 = localStorage.getItem("credId");
  if (!credIdBase64) {
    document.getElementById("status").innerText = "❌ No fingerprint registered! Please register first.";
    return;
  }

  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(32),
        allowCredentials: [{
          id: base64ToArrayBuffer(credIdBase64),
          type: "public-key"
        }],
        timeout: 60000,
        userVerification: "required"
      }
    });
    document.getElementById("status").innerText = "✅ Unlock successful!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Authentication failed.";
  }
}

function resetEverything() {
  localStorage.removeItem("credId");
  document.getElementById("status").innerText = "🔄 Reset complete. Please register again.";
}

function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
