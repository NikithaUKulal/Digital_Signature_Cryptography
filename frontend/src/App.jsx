import { useState } from "react";
import {
  BookOpen, Target, ListChecks, FlaskConical, HelpCircle,
  FileText, ChevronRight, ShieldCheck, KeyRound, Mail,
  CheckCircle2, XCircle, AlertTriangle, RotateCcw, Send,
  LockKeyhole, Eye, GraduationCap
} from "lucide-react";

const API = "http://127.0.0.1:5000/api";

const menu = [
  ["Introduction", "introduction", BookOpen],
  ["Objective", "objective", Target],
  ["Theory", "theory", FileText],
  ["Pre-requisites", "prerequisites", GraduationCap],
  ["Procedure", "procedure", ListChecks],
  ["Experiment", "experiment", FlaskConical],
  ["References", "references", BookOpen],
];

function App() {
  const [page, setPage] = useState("introduction");
  const [experiment, setExperiment] = useState({
    sender: "",
    receiver: "",
    subject: "",
    message: "",
    receivedMessage: "",
    signature: "",
    signaturePreview: "",
    keyInfo: null,
    sent: false,
    verified: null,
    tampered: false,
    error: "",
    loading: false
  });

  const navigate = (id) => {
    setPage(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const update = (key, value) => {
    setExperiment(prev => ({ ...prev, [key]: value, error: "" }));
  };

  async function signAndSend(e) {
    e.preventDefault();
    update("loading", true);
    try {
      const res = await fetch(`${API}/sign-send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: experiment.sender,
          receiver: experiment.receiver,
          subject: experiment.subject,
          message: experiment.message
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not sign the email.");
      setExperiment(prev => ({
        ...prev,
        sent: true,
        receivedMessage: data.received_message,
        signature: data.signature,
        signaturePreview: data.signature_preview,
        keyInfo: data.key_info,
        verified: null,
        tampered: false,
        error: "",
        loading: false
      }));
    } catch (err) {
      setExperiment(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }

  async function verifySignature() {
    update("loading", true);
    try {
      const res = await fetch(`${API}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");
      setExperiment(prev => ({ ...prev, verified: data.valid, error: "", loading: false }));
    } catch (err) {
      setExperiment(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }

  async function tamper() {
    update("loading", true);
    try {
      const res = await fetch(`${API}/tamper`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not tamper with the email.");
      setExperiment(prev => ({
        ...prev,
        receivedMessage: data.tampered_message,
        tampered: true,
        verified: null,
        error: "",
        loading: false
      }));
    } catch (err) {
      setExperiment(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }

  async function reset() {
    await fetch(`${API}/reset`, { method: "POST" });
    setExperiment({
      sender: "", receiver: "", subject: "", message: "",
      receivedMessage: "", signature: "", signaturePreview: "",
      keyInfo: null, sent: false, verified: null, tampered: false,
      error: "", loading: false
    });
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={25} /></div>
          <div>
            <div className="brand-title">Virtual Labs</div>
            <div className="brand-subtitle">Computer Science & Engineering</div>
          </div>
        </div>
        <div className="top-links">
          <span>HOME</span><span>PARTNERS</span><span>CONTACT</span>
        </div>
      </header>

      <div className="coursebar">
        <div className="course-name">Cryptography Lab</div>
        <div className="crumb">Implement Digital Signatures for Emails</div>
      </div>

      <div className="layout">
        <aside className="sidebar">
          <div className="lab-title">DIGITAL SIGNATURES</div>
          {menu.map(([label, id, Icon]) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              onClick={() => navigate(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {page === id && <ChevronRight size={16} className="nav-arrow" />}
            </button>
          ))}
        </aside>

        <main className="content">
          <div className="content-header">
            <div>
              <div className="eyebrow">CRYPTOGRAPHY VIRTUAL LAB</div>
              <h1>Implement Digital Signatures for Emails</h1>
            </div>
            <div className="security-badge"><LockKeyhole size={17}/> RSA + SHA-256</div>
          </div>

          {page === "introduction" && <Introduction navigate={navigate} />}
          {page === "objective" && <Objective />}
          {page === "theory" && <Theory />}
          {page === "prerequisites" && <Prerequisites />}
          {page === "procedure" && <Procedure />}
          {page === "experiment" && (
            <Experiment
              x={experiment}
              update={update}
              signAndSend={signAndSend}
              verifySignature={verifySignature}
              tamper={tamper}
              reset={reset}
            />
          )}
          {page === "references" && <References />}
        </main>
      </div>

      <footer>
        <span>Virtual Lab — Digital Signatures for Emails</span>
        <span>Educational Demonstration</span>
      </footer>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      <div className="section-body">{children}</div>
    </section>
  );
}

function Introduction({ navigate }) {
  return (
    <>
      <div className="hero-card">
        <div className="hero-icon"><ShieldCheck size={42}/></div>
        <div>
          <h2>Welcome to the Digital Signature Lab</h2>
          <p>
            This virtual experiment demonstrates how a digital signature can
            provide message integrity and help authenticate the sender of an email.
          </p>
          <button className="primary-btn" onClick={() => navigate("experiment")}>
            <FlaskConical size={18}/> Start Experiment
          </button>
        </div>
      </div>
      <Section title="Introduction">
        <p>
          A digital signature is a cryptographic mechanism used to prove that a
          message was signed by the holder of a private key and that the signed
          message has not been changed.
        </p>
        <p>
          In this experiment, an email is signed using an RSA private key.
          The receiver uses the corresponding public key to verify the signature.
        </p>
      </Section>
      <Section title="What will you learn?">
        <div className="cards three">
          <InfoCard icon={<KeyRound/>} title="RSA Keys" text="Generate a public/private RSA key pair."/>
          <InfoCard icon={<Mail/>} title="Email Signing" text="Sign a user-written email with RSA-PSS and SHA-256."/>
          <InfoCard icon={<Eye/>} title="Verification" text="Observe success for an unchanged message and failure after tampering."/>
        </div>
      </Section>
    </>
  );
}

function Objective() {
  return (
    <Section title="Objective">
      <ol className="number-list">
        <li>Understand the purpose of digital signatures in email communication.</li>
        <li>Generate an RSA public/private key pair.</li>
        <li>Use the private key to create a digital signature for an email.</li>
        <li>Use the public key to verify the received email.</li>
        <li>Observe why modifying a signed message causes verification to fail.</li>
      </ol>
    </Section>
  );
}

function Theory() {
  return (
    <>
      <Section title="Digital Signature">
        <p>
          A digital signature is a cryptographic value attached to a message.
          It allows the receiver to verify that the message corresponds to the
          signature produced by the signer.
        </p>
      </Section>
      <Section title="RSA and SHA-256">
        <p>
          RSA uses a pair of mathematically related keys: a private key and a
          public key. The private key is kept by the sender and the public key
          can be shared with receivers.
        </p>
        <p>
          SHA-256 produces a fixed-length digest from the message. In this
          experiment, RSA-PSS with SHA-256 is used by the Python cryptography
          library to create and verify the signature.
        </p>
      </Section>
      <Section title="Signing and Verification Flow">
        <div className="flow">
          <FlowBox icon={<Mail/>} text="Email" />
          <span>→</span>
          <FlowBox icon={<ShieldCheck/>} text="RSA-PSS Signature" />
          <span>→</span>
          <FlowBox icon={<Send/>} text="Send" />
          <span>→</span>
          <FlowBox icon={<Eye/>} text="Verify" />
        </div>
        <div className="callout">
          <strong>Important:</strong> If even one part of the signed message is
          changed, verification should fail because the current message no
          longer matches the signature.
        </div>
      </Section>
    </>
  );
}

function Prerequisites() {
  return (
    <Section title="Pre-requisites">
      <ul className="check-list">
        <li>Basic understanding of cryptography.</li>
        <li>Basic knowledge of public-key and private-key cryptography.</li>
        <li>Basic understanding of hashing and message integrity.</li>
        <li>Python and Flask environment for the local implementation.</li>
      </ul>
    </Section>
  );
}

function Procedure() {
  const steps = [
    "Open the Experiment page.",
    "Enter the sender, receiver, subject, and email message.",
    "Click Sign & Send Email.",
    "Observe RSA key generation and the digital signature.",
    "The receiver automatically receives the signed email.",
    "Click Verify Signature and observe the result.",
    "Use Simulate Tampering to modify the received message.",
    "Verify the signature again and observe the failed verification."
  ];
  return (
    <Section title="Procedure">
      <ol className="procedure">
        {steps.map((s, i) => <li key={i}><span>{i + 1}</span>{s}</li>)}
      </ol>
    </Section>
  );
}

function Experiment({ x, update, signAndSend, verifySignature, tamper, reset }) {
  return (
    <div className="experiment">
      <div className="experiment-intro">
        <div>
          <h2>Interactive Experiment</h2>
          <p>Write an email as the sender. The receiver will automatically receive the signed email.</p>
        </div>
        <button className="secondary-btn" onClick={reset}><RotateCcw size={16}/> Reset</button>
      </div>

      {x.error && <div className="alert error"><AlertTriangle size={18}/>{x.error}</div>}

      <div className="experiment-grid">
        <div className="panel">
          <div className="panel-title"><span className="step">1</span> Sender — Compose Email</div>
          <form onSubmit={signAndSend}>
            <label>From</label>
            <input value={x.sender} onChange={e => update("sender", e.target.value)} placeholder="alice@example.com" />
            <label>To</label>
            <input value={x.receiver} onChange={e => update("receiver", e.target.value)} placeholder="bob@example.com" />
            <label>Subject</label>
            <input value={x.subject} onChange={e => update("subject", e.target.value)} placeholder="Project Meeting" />
            <label>Message</label>
            <textarea rows="7" value={x.message} onChange={e => update("message", e.target.value)} placeholder="Type your email message here..." />
            <button className="primary-btn full" disabled={x.loading}>
              <LockKeyhole size={18}/> {x.loading ? "Processing..." : "Sign & Send Email"}
            </button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-title"><span className="step">2</span> Digital Signature</div>
          {!x.sent ? (
            <EmptyState icon={<KeyRound/>} text="Send an email to generate the RSA key pair and digital signature." />
          ) : (
            <>
              <div className="mini-result success"><CheckCircle2 size={18}/> RSA key pair generated</div>
              <div className="key-grid">
                <div><strong>Algorithm</strong><span>{x.keyInfo?.algorithm}</span></div>
                <div><strong>Key Size</strong><span>{x.keyInfo?.key_size} bits</span></div>
                <div><strong>Hash</strong><span>SHA-256</span></div>
                <div><strong>Padding</strong><span>RSA-PSS</span></div>
              </div>
              <label>Digital Signature (Base64 preview)</label>
              <div className="signature-box">{x.signaturePreview}</div>
              <div className="callout small">
                The signature is generated using the sender's private key.
                The corresponding public key is used for verification.
              </div>
            </>
          )}
        </div>
      </div>

      <div className="arrow-divider">↓ EMAIL SENT TO RECEIVER ↓</div>

      <div className="panel receiver-panel">
        <div className="panel-title"><span className="step">3</span> Receiver — Received Email</div>
        {!x.sent ? (
          <EmptyState icon={<Mail/>} text="The received email will appear here after the sender clicks Sign & Send." />
        ) : (
          <>
            <div className="email-meta">
              <div><strong>From</strong><span>{x.sender}</span></div>
              <div><strong>To</strong><span>{x.receiver}</span></div>
              <div><strong>Subject</strong><span>{x.subject}</span></div>
            </div>
            <div className={`received-message ${x.tampered ? "tampered" : ""}`}>
              {x.receivedMessage}
            </div>
            {x.tampered && <div className="tamper-note"><AlertTriangle size={17}/> This message was changed after it was signed.</div>}
            <div className="signature-box wide">
              <strong>Digital Signature</strong>
              <span>{x.signaturePreview}</span>
            </div>

            <div className="receiver-actions">
              <button className="primary-btn" onClick={verifySignature} disabled={x.loading}>
                <ShieldCheck size={18}/> Verify Signature
              </button>
              <button className="danger-btn" onClick={tamper} disabled={x.loading}>
                <AlertTriangle size={18}/> Simulate Tampering
              </button>
            </div>

            {x.verified !== null && (
              <div className={`verification ${x.verified ? "valid" : "invalid"}`}>
                {x.verified ? <CheckCircle2 size={34}/> : <XCircle size={34}/>}
                <div>
                  <h3>{x.verified ? "Digital Signature Verified" : "Digital Signature Verification Failed"}</h3>
                  <p>
                    {x.verified
                      ? "The received email matches the signed message and has not been modified."
                      : "The received email no longer matches the message that was signed. It may have been modified."}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="learning-note">
        <strong>Experiment takeaway:</strong> A valid signature confirms that the
        received content matches the content that was signed. Changing the content
        after signing makes the signature invalid.
      </div>
    </div>
  );
}

function References() {
  return (
    <Section title="References">
      <ul className="reference-list">
        <li>Virtual Labs — Cryptography Lab structure and experiment-oriented learning model.</li>
        <li>Python Cryptography library — RSA, PSS padding and SHA-256 APIs.</li>
        <li>William Stallings, Cryptography and Network Security.</li>
        <li>Behrouz A. Forouzan, Cryptography and Network Security.</li>
      </ul>
    </Section>
  );
}

function InfoCard({ icon, title, text }) {
  return <div className="info-card"><div className="info-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div>;
}
function FlowBox({ icon, text }) {
  return <div className="flow-box"><div>{icon}</div><span>{text}</span></div>;
}
function EmptyState({ icon, text }) {
  return <div className="empty"><div className="empty-icon">{icon}</div><p>{text}</p></div>;
}

export default App;
