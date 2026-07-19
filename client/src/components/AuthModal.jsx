// Static backdrop shell for the account/sign-in modal (Suite SSO). Content is
// injected into #authModalBody by src/js/auth.js, matching the pattern
// CryptoPro Trader uses for its modals (fragment markup + vanilla JS toggling
// .style.display) — see that project's client/src/fragments/modals.html.
export default function AuthModal() {
  return (
    <div id="authModalBackdrop" className="modal-backdrop">
      <div className="modal" id="authModalBody" style={{ width: 'min(420px,100%)' }}></div>
    </div>
  );
}
