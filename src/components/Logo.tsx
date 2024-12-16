import { Box, Typography, useTheme } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'small' | 'medium' | 'large';
}

const Logo = ({ variant = 'full', size = 'medium' }: LogoProps) => {
  const theme = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small':
        return { icon: 28, text: '1.25rem', stack: 16 };
      case 'large':
        return { icon: 48, text: '1.75rem', stack: 28 };
      default:
        return { icon: 36, text: '1.5rem', stack: 22 };
    }
  };

  const dimensions = getSize();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: dimensions.icon,
          height: dimensions.icon,
        }}
      >
        {/* Background Circle */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                opacity: 0.9,
              },
              '50%': {
                transform: 'scale(1.05)',
                opacity: 0.8,
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 0.9,
              },
            },
          }}
        />

        {/* Stacked Icons */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PhoneAndroidIcon
            sx={{
              color: 'white',
              fontSize: dimensions.stack,
              position: 'absolute',
              zIndex: 1,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          />
          <AttachMoneyIcon
            sx={{
              color: 'white',
              fontSize: dimensions.stack * 0.8,
              position: 'absolute',
              transform: 'translate(50%, -50%)',
              zIndex: 2,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          />
        </Box>

        {/* Shine Effect */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(255,255,255,0.3), transparent 60%)',
            animation: 'shine 3s infinite',
            '@keyframes shine': {
              '0%': {
                transform: 'rotate(0deg)',
                opacity: 0.5,
              },
              '25%': {
                opacity: 0.7,
              },
              '50%': {
                transform: 'rotate(180deg)',
                opacity: 0.5,
              },
              '75%': {
                opacity: 0.7,
              },
              '100%': {
                transform: 'rotate(360deg)',
                opacity: 0.5,
              },
            },
          }}
        />
      </Box>

      {variant === 'full' && (
        <Typography
          variant="h6"
          sx={{
            fontSize: dimensions.text,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -4,
              left: 0,
              width: '100%',
              height: 2,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              opacity: 0.5,
              borderRadius: 1,
            },
          }}
        >
          PayJoy
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 