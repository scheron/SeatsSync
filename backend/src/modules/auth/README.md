# Authorization workflow

0. Handshake: User sends handshake request to backend.
   0.1. If token is active, user is logged in.
   0.2. If token is expired or not exists, user is not logged in.
1. Candidate: User enters username and sends it to backend.
   1.1. Backend checks username, and returns candidate if it exists.
   1.2. Frontend shows candidate qr code, and user scans it with authenticator app.
   1.3. User enters 6 digits code from authenticator app and sends it to backend.
   1.4. Backend checks code and if it is correct, user is authorized as a candidate.
   1.5. Frontend shows user a secret phrase for recovery access.
2. User: User enters secret phrase and sends it to backend.
   2.1. Backend checks secret phrase and if it is correct, user is authorized as a user.
   2.2. Backend returns a token to frontend.
   2.4. After this frontend should call wink to get a new token in cookies.
