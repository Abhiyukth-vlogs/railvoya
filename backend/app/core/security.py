import hashlib
import os
import secrets
import hmac

ITERATIONS = 600_000
ALGORITHM = "sha256"

def hash_password(password: str) -> str:
    """Hash a plaintext password using PBKDF2-HMAC-SHA256 with 600,000 iterations and a 32-byte salt."""
    salt = secrets.token_bytes(32)
    derived = hashlib.pbkdf2_hmac(
        ALGORITHM,
        password.encode("utf-8"),
        salt,
        ITERATIONS
    )
    salt_hex = salt.hex()
    hash_hex = derived.hex()
    return f"pbkdf2_{ALGORITHM}${ITERATIONS}${salt_hex}${hash_hex}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a stored PBKDF2 hash."""
    try:
        parts = hashed_password.split("$")
        if len(parts) != 4:
            return False
        algo, iter_str, salt_hex, expected_hash_hex = parts
        iterations = int(iter_str)
        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(expected_hash_hex)
        
        actual_hash = hashlib.pbkdf2_hmac(
            ALGORITHM,
            plain_password.encode("utf-8"),
            salt,
            iterations
        )
        return hmac.compare_digest(actual_hash, expected_hash)
    except Exception:
        return False

def generate_session_token() -> str:
    """Generate a cryptographically secure 64-character hex session token."""
    return secrets.token_hex(32)

def generate_pnr(is_demo: bool = True) -> str:
    """Generate a 10-character railway PNR or clearly labeled Demo PNR."""
    # Real Indian Railways PNRs are 10 numeric digits.
    # Demo PNR format: 3 random digits + 7 digits (e.g., 284-9102847 or DEMO-RV-XXXXXX)
    # The requirement asks for demo identifiers that cannot be mistaken for real PNRs:
    # "Use demo identifiers that cannot be mistaken for real PNRs."
    digits = "".join([str(secrets.randbelow(10)) for _ in range(7)])
    return f"RV-DEMO-{digits}"
