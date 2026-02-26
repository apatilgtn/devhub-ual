import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    width: 'auto',
    height: 30,
  },
});

const LogoIcon = () => {
  const classes = useStyles();

  return (
    <svg
      className={classes.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
    >
      <defs>
        <linearGradient id="devhubIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      {/* Code brackets */}
      <path
        d="M8 8 L2 20 L8 32"
        fill="none"
        stroke="url(#devhubIconGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 8 L38 20 L32 32"
        fill="none"
        stroke="url(#devhubIconGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hub circle */}
      <circle
        cx="20"
        cy="20"
        r="6"
        fill="none"
        stroke="url(#devhubIconGradient)"
        strokeWidth="3"
      />
      {/* Connection lines */}
      <line x1="20" y1="6" x2="20" y2="14" stroke="url(#devhubIconGradient)" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="26" x2="20" y2="34" stroke="url(#devhubIconGradient)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export default LogoIcon;
