import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    width: 'auto',
    height: 32,
  },
  text: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 900,
    fontSize: '24px',
    letterSpacing: '-0.07em',
  },
});

const LogoFull = () => {
  const classes = useStyles();

  return (
    <svg
      className={classes.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 40"
    >
      <defs>
        <linearGradient id="devhubGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      {/* Code brackets icon */}
      <path
        d="M8 8 L2 20 L8 32"
        fill="none"
        stroke="url(#devhubGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 8 L38 20 L32 32"
        fill="none"
        stroke="url(#devhubGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hub circle */}
      <circle
        cx="20"
        cy="20"
        r="5"
        fill="none"
        stroke="url(#devhubGradient)"
        strokeWidth="3"
      />

      {/* DeV-Hub text in Inter */}
      <text
        x="50"
        y="29"
        fill="url(#devhubGradient)"
        className={classes.text}
      >
        DeV-Hub
      </text>
    </svg>
  );
};

export default LogoFull;
