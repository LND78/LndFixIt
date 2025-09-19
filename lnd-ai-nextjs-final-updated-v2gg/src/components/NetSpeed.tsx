"use client";
import React, { useState } from "react";

const HashConverter = () => {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [salt, setSalt] = useState("");
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");

  const generateRandomSaltString = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let salt = "";
    for (let i = 0; i < 16; i++) {
      salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSalt(salt);
    return salt;
  };

  const generatePBKDF2 = async (
    password: string,
    salt: string,
    iterations = 100000
  ) => {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: encoder.encode(salt),
        iterations: iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );

    const hashArray = Array.from(new Uint8Array(derivedBits));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const generateHash = async () => {
    if (!input) {
      setError("Please enter text to hash.");
      return;
    }
    setError("");
    setHash("");

    const saltedInput = salt ? salt + input : input;

    try {
      let finalHash = "";
      switch (algorithm) {
        case "pbkdf2":
          finalHash = await generatePBKDF2(
            input,
            salt || generateRandomSaltString()
          );
          break;

        default: // SHA-1, SHA-256, SHA-512
          const encoder = new TextEncoder();
          const data = encoder.encode(saltedInput);
          const normalizedAlgo =
            algorithm.toUpperCase() === "SHA1"
              ? "SHA-1"
              : algorithm.toUpperCase();
          const hashBuffer = await crypto.subtle.digest(normalizedAlgo, data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          finalHash = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
      }

      setHash(finalHash);
    } catch (e: unknown) {
      setError(
        "Error generating hash. This algorithm may not be supported by your browser."
      );
      console.error(e);
    }
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: "20px" }}>
        Hash Converter & Encryption
      </h3>
      <div className="form-group">
        <label htmlFor="hashInput" className="form-label">
          Input Text
        </label>
        <textarea
          id="hashInput"
          className="prompt-input"
          placeholder="Enter text to hash..."
          style={{ minHeight: "100px" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      </div>
      <div className="controls-grid">
        <div className="form-group">
          <label htmlFor="hashAlgorithm" className="form-label">
            Hash Algorithm
          </label>
          <div className="select-wrapper">
            <select
              id="hashAlgorithm"
              className="custom-select"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="sha1">SHA-1</option>
              <option value="sha256">SHA-256</option>
              <option value="sha512">SHA-512</option>
              <option value="pbkdf2">PBKDF2 (with salt)</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="hashSalt" className="form-label">
            Salt (Optional)
          </label>
          <input
            type="text"
            id="hashSalt"
            className="prompt-input"
            style={{ minHeight: "auto", padding: "15px" }}
            placeholder="Enter custom salt..."
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
        </div>
      </div>
      <div className="controls-grid">
        <button className="generate-btn" onClick={generateHash}>
          <span className="btn-icon">🔐</span>
          Generate Hash
        </button>
        <button
          className="generate-btn"
          onClick={generateRandomSaltString}
          style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
        >
          <span className="btn-icon">🎲</span>
          Generate Salt
        </button>
      </div>
      {error && (
        <div className="error-message" style={{ marginTop: "20px" }}>
          <span>❌</span>
          <span>{error}</span>
        </div>
      )}
      {hash && (
        <div id="hashResult" style={{ marginTop: "20px" }}>
          <div
            className="results-section"
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              borderRadius: "15px",
              padding: "25px",
              marginTop: "20px",
            }}
          >
            <h4 style={{ color: "var(--text-light)", marginBottom: "15px" }}>
              🔐 Hash Result
            </h4>
            <div style={{ display: "grid", gap: "15px" }}>
              <div>
                <strong style={{ color: "var(--accent-purple)" }}>
                  Algorithm:
                </strong>
                <span style={{ color: "var(--text-light)" }}>
                  {algorithm.toUpperCase()}
                </span>
              </div>
              {salt && (
                <div>
                  <strong style={{ color: "var(--accent-purple)" }}>Salt:</strong>{" "}
                  <span
                    style={{
                      color: "var(--text-light)",
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    {salt}
                  </span>
                </div>
              )}
              <div>
                <strong style={{ color: "var(--accent-purple)" }}>Hash:</strong>
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.5)",
                    padding: "15px",
                    borderRadius: "8px",
                    marginTop: "10px",
                    wordBreak: "break-all",
                    fontFamily: "'Courier New', monospace",
                    color: "var(--text-light)",
                  }}
                >
                  {hash}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                className="download-btn"
                onClick={() => navigator.clipboard.writeText(hash)}
              >
                📋 Copy Hash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HashConverter;
