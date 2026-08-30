function splitWordmark(wordmark: string): [string, string] {
  const emLength = Math.min(2, Math.max(1, wordmark.length - 1));
  const splitAt = wordmark.length - emLength;
  return [wordmark.slice(0, splitAt), wordmark.slice(splitAt)];
}

export default function Logo({ wordmark }: { wordmark: string }) {
  const [bold, em] = splitWordmark(wordmark);
  return (
    <span className="site-navbar-logo">
      <svg
        className="site-navbar-logo-mark"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="13" stroke="var(--gold)" strokeWidth="1.2" />
        <path
          d="M20 9 L24.2 16.5 L20 24 L15.8 16.5 Z"
          stroke="var(--gold)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M20 16 L27.5 20.2 L20 24.4 L12.5 20.2 Z"
          stroke="var(--gold)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="20" r="3" fill="var(--gold)" />
      </svg>
      <span className="site-navbar-logo-word">
        {bold}
        <em>{em}</em>
      </span>
    </span>
  );
}
